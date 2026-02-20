package com.project.app.attendance.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.attendance.dto.AttendanceScheduleDto;
import com.project.app.attendance.dto.AttendeeRow;
import com.project.app.attendance.dto.ReservationDto;
import com.project.app.attendance.dto.ScheduleDetailDto;
import com.project.app.attendance.dto.SummaryDto;
import com.project.app.attendance.entity.AttendanceSchedule;
import com.project.app.attendance.entity.AttendanceStatus;
import com.project.app.attendance.mapper.AttendanceMapper;
import com.project.app.attendance.repository.AttendanceScheduleRepository;
import com.project.app.attendance.repository.AttendanceScheduleView;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceScheduleRepository scheduleRepository;
    private final AttendanceMapper attendanceMapper;

 // 1️. 목록 조회 - ADMIN: 전체(프론트는 /api/admin/schedules 사용), 그 외: 본인 스케줄만
    public List<AttendanceScheduleDto> getMySchedules(String loginUserId, boolean isAdmin) {
        if (isAdmin) {
            return List.of(); // 목록은 프론트에서 GET /api/admin/schedules 로 조회
        }
        List<AttendanceScheduleView> schedules = scheduleRepository.findByUserId(loginUserId);
        return schedules.stream()
                .map(AttendanceScheduleDto::from)
                .toList();
    }

    // 2️. 상세 조회 - ADMIN: 모든 스케줄 접근, 그 외: 담당 강사만
    public ScheduleDetailDto getScheduleDetail(Long schdId, String loginUserId, boolean isAdmin) {
        AttendanceSchedule schedule =
                scheduleRepository.findById(schdId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("출석 스케줄이 없습니다.")
                        );

        if (!isAdmin && (loginUserId == null || !schedule.getUserId().equals(loginUserId))) {
            throw new AccessDeniedException("접근 권한 없음");
        }

        // 예약 저장 구조: pass_log(schd_id) + user_pass + users. 참석자 = pass_log 기준 조회
        List<AttendeeRow> rows = attendanceMapper.findAttendeesBySchdId(schdId);
        List<ReservationDto> reservationDtos = rows.stream()
                .map(row -> ReservationDto.of(
                        row.getReservationId(),
                        row.getUserId(),
                        row.getUserName(),
                        row.getPhoneNumber(),
                        row.getAttendanceStatus(),
                        row.getRsvDt(),
                        row.getRsvTime()
                ))
                .collect(Collectors.toList());

        int total = reservationDtos.size();
        int attended = (int) reservationDtos.stream()
                .filter(r -> r.getAttendanceStatus() == AttendanceStatus.ATTENDED)
                .count();
        int absent = (int) reservationDtos.stream()
                .filter(r -> r.getAttendanceStatus() == AttendanceStatus.ABSENT)
                .count();

        return ScheduleDetailDto.of(
                SummaryDto.of(total, absent, attended),
                reservationDtos
        );
    }
    
    // 3️. 출석 상태 변경 - ADMIN: 모든 스케줄 수정 가능, 그 외: 담당 강사만
    @Transactional
    public void updateAttendanceStatus(
            Long schdId,
            Long reservationId,
            AttendanceStatus status,
            String loginUserId,
            boolean isAdmin
    ) {
        AttendanceSchedule schedule =
                scheduleRepository.findById(schdId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("출석 스케줄이 없습니다.")
                        );

        if (!isAdmin && (loginUserId == null || !schedule.getUserId().equals(loginUserId))) {
            throw new AccessDeniedException("접근 권한 없음");
        }

        // reservationId = rsv_id. 이용권 예약이면 pass_log, 아니면 reservation.attendance_status 갱신
        String statusValue = status.name();
        Long passLogId = attendanceMapper.findPassLogIdByRsvId(reservationId);
        if (passLogId != null) {
            attendanceMapper.updatePassLogAttendance(passLogId, statusValue);
        } else {
            int updated = attendanceMapper.updateReservationAttendance(reservationId, statusValue);
            if (updated == 0) {
                throw new IllegalArgumentException("예약(출결) 정보가 없습니다. rsv_id=" + reservationId);
            }
        }
    }

    /** 4. 출석 상태 일괄 저장 */
    @Transactional
    public void batchUpdateAttendanceStatus(
            Long schdId,
            List<com.project.app.attendance.dto.AttendanceBatchUpdateRequest.Item> items,
            String loginUserId,
            boolean isAdmin
    ) {
        if (items == null || items.isEmpty()) return;
        for (var item : items) {
            if (item.getReservationId() == null) continue;
            updateAttendanceStatus(
                    schdId,
                    item.getReservationId(),
                    item.getStatusAsEnum(),
                    loginUserId,
                    isAdmin
            );
        }
    }

}
