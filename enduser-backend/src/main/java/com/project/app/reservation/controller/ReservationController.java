package com.project.app.reservation.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.branch.entity.Branch;
import com.project.app.reservation.dto.CreateReservationRequestDto;
import com.project.app.reservation.dto.MyReservationResponseDto;
import com.project.app.reservation.dto.PastHistoryResponseDto;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;
import com.project.app.reservation.service.ReservationService;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;
import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.service.UserPassService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 예약 관련 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

	private final ReservationService reservationService;
	private final ScheduleRepository scheduleRepository;
	private final UserRepository userRepository;
	private final UserPassService userPassService;

    /**
     * 로그인한 사용자의 예약 목록을 조회합니다.
     *
     * GET /api/reservations/myReservations
     *
     * @return 예약 목록 응답
     */
    @GetMapping("/myReservations")
    public ResponseEntity<Map<String, Object>> getMyReservations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || authentication.getName() == null || "anonymousUser".equals(authentication.getName())) {
                Map<String, Object> err = new HashMap<>();
                err.put("resultCode", "UNAUTHORIZED");
                err.put("message", "로그인이 필요합니다.");
                err.put("data", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
            }
            String userId = authentication.getName();

            log.info("[ReservationController] 예약 목록 조회 요청 - userId: {}", userId);

            List<MyReservationResponseDto> reservations = reservationService.getMyReservations(userId);

            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("resultCode", "SUCCESS");
            response.put("message", "조회 성공");
            response.put("data", reservations);

            log.info("[ReservationController] 예약 목록 조회 완료 - 개수: {}", reservations.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("[ReservationController] 예약 목록 조회 중 오류 발생", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("resultCode", "ERROR");
            errorResponse.put("message", "예약 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
            errorResponse.put("data", null);

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * 예약을 취소합니다.
     *
     * DELETE /api/reservations/{rsvId}
     *
     * @param rsvId 예약 ID
     * @param cancelReason 취소 사유 (선택사항)
     * @return 취소 결과 응답
     */
    @DeleteMapping("/{rsvId}")
    public ResponseEntity<Map<String, Object>> cancelReservation(
            @PathVariable("rsvId") Long rsvId,
            @RequestParam(value = "cancelReason", required = false) String cancelReason) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();

            log.info("[ReservationController] 예약 취소 요청 - rsvId: {}, userId: {}", rsvId, userId);

            // 예약 취소 처리
            reservationService.cancelReservation(rsvId, userId, cancelReason);

            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("resultCode", "SUCCESS");
            response.put("message", "예약이 취소되었습니다.");
            response.put("data", null);

            log.info("[ReservationController] 예약 취소 완료 - rsvId: {}", rsvId);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("[ReservationController] 예약 취소 실패 (잘못된 요청) - rsvId: {}", rsvId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("resultCode", "BAD_REQUEST");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (IllegalStateException e) {
            log.warn("[ReservationController] 예약 취소 실패 (상태 오류) - rsvId: {}", rsvId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("resultCode", "BAD_REQUEST");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            log.error("[ReservationController] 예약 취소 중 오류 발생 - rsvId: {}", rsvId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("resultCode", "ERROR");
            errorResponse.put("message", "예약 취소 중 오류가 발생했습니다: " + e.getMessage());
            errorResponse.put("data", null);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * 결제 화면을 거치지 않고 바로 예약을 생성하는 엔드포인트입니다.
     * (예: group_cd가 EDUCATION 이 아닌 프로그램)
     *
     * POST /api/reservations/direct
     */
    @PostMapping("/direct")
    public ResponseEntity<Map<String, Object>> createDirectReservation(
            @RequestBody CreateReservationRequestDto requestDto) {
        try {
            // JWT 토큰에서 사용자 ID 추출 (비로그인/토큰만료 시 anonymousUser가 됨)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getName())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("resultCode", "UNAUTHORIZED");
                errorResponse.put("message", "로그인이 필요합니다. 토큰이 만료되었을 수 있으니 다시 로그인해 주세요.");
                errorResponse.put("data", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            String userId = authentication.getName();

            // 사용자 조회
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다."));

            // 스케줄 조회
            Schedule schedule = scheduleRepository.findById(requestDto.getSchdId())
                    .orElseThrow(() -> new NoSuchElementException("스케줄을 찾을 수 없습니다."));

            // 지점 정보 조회 (스케줄에 매핑된 강사 → 지점)
            Branch branch = null;
            if (schedule.getUserAdmin() != null && schedule.getUserAdmin().getBranch() != null) {
                branch = schedule.getUserAdmin().getBranch();
            } else {
                throw new NoSuchElementException("스케줄에 연결된 지점 정보를 찾을 수 없습니다.");
            }

            // 이용권 선택 시: 차감 후 예약 생성 → pass_log에 schd_id 저장 → 어드민 출석관리 참석자 표시
            UserPass userPass = null;
            if (requestDto.getUserPassId() != null) {
                userPass = userPassService.usePassForR(
                        requestDto.getUserPassId(),
                        "직접 예약(스케줄 " + schedule.getSchdId() + ")"
                );
            }

            Reservation reservation = reservationService.createReservation(
                    user,
                    schedule,
                    branch,
                    userPass,
                    requestDto.getRsvDt(),
                    requestDto.getRsvTime(),
                    RsvSttsCd.CONFIRMED  // 직접 예약은 즉시 확정
            );

            Map<String, Object> response = new HashMap<>();
            response.put("resultCode", "SUCCESS");
            response.put("message", "예약이 완료되었습니다.");
            response.put("data", reservation.getRsvId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (NoSuchElementException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("resultCode", "BAD_REQUEST");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("[ReservationController] 예약 생성 중 오류 발생", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("resultCode", "ERROR");
            errorResponse.put("message", "예약 생성 중 오류가 발생했습니다: " + e.getMessage());
            errorResponse.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/completedReservations")
    public ResponseEntity<Map<String,Object>> getCompletedReservations(
            @RequestParam(required = false) Boolean unwrittenOnly) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        List<PastHistoryResponseDto> data = reservationService.getCompletedReservations(userId, unwrittenOnly);

        Map<String, Object> response = new HashMap<>();
        response.put("resultCode", "SUCCESS");
        response.put("message", "조회 성공");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

}