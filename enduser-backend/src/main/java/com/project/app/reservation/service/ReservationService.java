package com.project.app.reservation.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.branch.entity.Branch;
import com.project.app.reservation.dto.MyReservationResponseDto;
import com.project.app.reservation.dto.MyReservationRowDto;
import com.project.app.reservation.dto.PastHistoryResponseDto;
import com.project.app.reservation.dto.PastHistoryRowDto;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;
import com.project.app.reservation.mapper.MyReservationMapper;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.user.entity.User;
import com.project.app.userpass.entity.PassLogChgTypeCd;
import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.service.PassLogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PassLogService passLogService;
    private final ScheduleRepository scheduleRepository;
    private final MyReservationMapper myReservationMapper;

    /**
     * 예약 생성
     * @param reservationStatus 예약 상태 (결제 완료 시 CONFIRMED, 대기 시 PENDING)
     */
    public Reservation createReservation(
            User user,
            Schedule schedule,
            Branch branch,
            UserPass userPass,
            LocalDate rsvDt,
            LocalTime rsvTime,
            RsvSttsCd reservationStatus
    ) {
        Reservation reservation = Reservation.builder()
                .user(user)
                .schedule(schedule)
                .branch(branch)
                .userPass(userPass)
                .rsvDt(rsvDt)
                .rsvTime(rsvTime)
                .sttsCd(reservationStatus != null ? reservationStatus : RsvSttsCd.CONFIRMED)
                .reviewWritten(false)
                .updID(user.getUserId())
                .build();

        reservation = reservationRepository.save(reservation);

        // schedule.rsv_cnt 동기화 (관리자 예약 관리 페이지에서 조회)
        schedule.setRsvCnt((schedule.getRsvCnt() == null ? 0 : schedule.getRsvCnt()) + 1);
        scheduleRepository.save(schedule);

        // 이용권으로 예약한 경우만 pass_log에 기록 (어드민 출석관리·마이페이지 예약 목록 연동)
        if (userPass != null) {
            passLogService.createReservationPassLog(userPass, schedule.getSchdId());
        }

        return reservation;
    }

    /**
     * 예약 취소 - 기존 PassLog 로직과 충돌 방지
     */
    public void cancelReservation(Long rsvId, String userId, String cancelReason) {
        
        Reservation reservation = reservationRepository.findById(rsvId)
                .orElseThrow(() -> new NoSuchElementException("예약을 찾을 수 없습니다. rsvId=" + rsvId));

        if (!reservation.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 예약만 취소할 수 있습니다.");
        }

        // 단순히 상태만 변경 (PassLog 로직은 다른 곳에서 처리)
        reservation.cancel(cancelReason, userId);
        reservationRepository.save(reservation);

        // schedule.rsv_cnt 동기화 (관리자 예약 관리 페이지에서 조회)
        Schedule schedule = reservation.getSchedule();
        int current = schedule.getRsvCnt() == null ? 0 : schedule.getRsvCnt();
        schedule.setRsvCnt(Math.max(0, current - 1));
        scheduleRepository.save(schedule);
    }

    /**
     * 내 예약 목록 조회 - pass_log 기준 (어드민 출결관리와 동일)
     */
    @Transactional(readOnly = true)
    public List<MyReservationResponseDto> getMyReservations(String userId) {
        List<MyReservationRowDto> rows = myReservationMapper.findMyReservationsByUserId(userId);
        return rows.stream()
                .map(MyReservationResponseDto::fromRow)
                .collect(Collectors.toList());
    }

    /**
     * 수업 완료 처리 (배치) - 이용권 차감 + COMPLETED 상태 변경
     */
    public int completeReservations(LocalDate baseDate, String batchUser) {

        // 기준 날짜 이전의 CONFIRMED 예약들을 찾아서 완료 처리
        List<Reservation> targets =
                reservationRepository.findByRsvDtBeforeAndSttsCd(baseDate, RsvSttsCd.CONFIRMED);

        for (Reservation r : targets) {
            // 이용권 차감 (이용 완료 시점)
            if (r.getUserPass() != null) {
                UserPass userPass = r.getUserPass();
                
                boolean success = userPass.decreaseRmnCnt();
                if (!success) {
                    log.warn("이용권 잔여 횟수 부족 - reservationId: {}", r.getRsvId());
                    continue;
                }

                // 이용내역 로그 생성
                passLogService.createPassLog(
                        userPass,
                        PassLogChgTypeCd.USE,
                        -1,
                        "수업 완료",
                        null
                );
            }

            // CONFIRMED → COMPLETED 상태 변경 (삭제 대신)
            r.complete();
            r.setUpdID(batchUser);
            reservationRepository.save(r);

            // schedule.rsv_cnt 동기화
            Schedule sched = r.getSchedule();
            int cnt = sched.getRsvCnt() == null ? 0 : sched.getRsvCnt();
            sched.setRsvCnt(Math.max(0, cnt - 1));
            scheduleRepository.save(sched);
        }
        return targets.size();
    }

    /**
     * 특정 사용자의 지난 예약만 완료 처리 (이용내역 조회 시 호출)
     */
    public int completeUserReservations(String userId, LocalDate baseDate, String batchUser) {
        List<Reservation> targets = reservationRepository
                .findByUser_UserIdAndRsvDtBeforeAndSttsCd(userId, baseDate, RsvSttsCd.CONFIRMED);
        for (Reservation r : targets) {
            if (r.getUserPass() != null) {
                UserPass userPass = r.getUserPass();
                if (userPass.decreaseRmnCnt()) {
                    passLogService.createPassLog(userPass, PassLogChgTypeCd.USE, -1, "수업 완료", null);
                }
            }
            r.complete();
            r.setUpdID(batchUser);
            reservationRepository.save(r);
            Schedule sched = r.getSchedule();
            int cnt = sched.getRsvCnt() == null ? 0 : sched.getRsvCnt();
            sched.setRsvCnt(Math.max(0, cnt - 1));
            scheduleRepository.save(sched);
        }
        return targets.size();
    }
    
    /**
     * 이용내역/리뷰: 출석(ATTENDED) 처리된 예약만 조회
     * @param unwrittenOnly true이면 리뷰 미작성 항목만 반환 (리뷰 작성하기 탭용)
     */
    @Transactional(readOnly = true)
    public List<PastHistoryResponseDto> getCompletedReservations(String userId, Boolean unwrittenOnly) {
        List<PastHistoryRowDto> rows = (Boolean.TRUE.equals(unwrittenOnly))
                ? myReservationMapper.findAttendedReservationsForHistoryFiltered(userId, true)
                : myReservationMapper.findAttendedReservationsForHistory(userId);
        if (rows == null) {
            return Collections.emptyList();
        }
        return rows.stream()
                .map(PastHistoryResponseDto::fromRow)
                .collect(Collectors.toList());
    }
}

