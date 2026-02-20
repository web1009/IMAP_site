package com.project.app.attendance.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.attendance.dto.AttendanceBatchUpdateRequest;
import com.project.app.attendance.dto.AttendanceScheduleDto;
import com.project.app.attendance.dto.AttendanceUpdateRequest;
import com.project.app.attendance.dto.ScheduleDetailDto;
import com.project.app.attendance.service.AttendanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    private static boolean isAdmin(Authentication auth) {
        if (auth == null || auth.getAuthorities() == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    private static String getLoginUserId(Authentication auth) {
        return auth != null && auth.getName() != null ? auth.getName() : null;
    }

    /** 토큰 만료/미인증 시 401 반환 → 프론트에서 재로그인 유도 */
    private static void requireAuthenticated(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()
                || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "토큰이 만료되었거나 로그인이 필요합니다. 다시 로그인해 주세요.");
        }
    }

    // 1️ 출석 스케줄 목록은 프론트에서 GET /api/admin/schedules 사용 (전체 강의 목록)
    @GetMapping
    public ResponseEntity<List<AttendanceScheduleDto>> getMySchedules(Authentication auth) {
        requireAuthenticated(auth);
        String loginUserId = getLoginUserId(auth);
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(attendanceService.getMySchedules(loginUserId, isAdmin));
    }

    // 2️ 특정 스케줄 출석 상세 - ADMIN: 모든 스케줄 접근, 그 외: 담당 강사만
    @GetMapping("/{schdId}")
    public ResponseEntity<ScheduleDetailDto> getScheduleDetail(
            @PathVariable("schdId") Long schdId,
            Authentication auth
    ) {
        requireAuthenticated(auth);
        String loginUserId = getLoginUserId(auth);
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(
                attendanceService.getScheduleDetail(schdId, loginUserId, isAdmin)
        );
    }

    // 3️ 출석 상태 변경 (단건) - ADMIN: 모든 스케줄 수정 가능, 그 외: 담당 강사만
    @PatchMapping("/{schdId}/reservations/{reservationId}")
    public ResponseEntity<Void> updateAttendance(
            @PathVariable("schdId") Long schdId,
            @PathVariable("reservationId") Long reservationId,
            @RequestBody AttendanceUpdateRequest dto,
            Authentication auth
    ) {
        requireAuthenticated(auth);
        String loginUserId = getLoginUserId(auth);
        boolean isAdmin = isAdmin(auth);
        attendanceService.updateAttendanceStatus(
                schdId,
                reservationId,
                dto.getStatus(),
                loginUserId,
                isAdmin
        );
        return ResponseEntity.ok().build();
    }

    // 4️ 출석 상태 일괄 저장 - 저장 버튼 클릭 시 호출
    @PatchMapping("/{schdId}/reservations")
    public ResponseEntity<Void> batchUpdateAttendance(
            @PathVariable("schdId") Long schdId,
            @RequestBody AttendanceBatchUpdateRequest request,
            Authentication auth
    ) {
        requireAuthenticated(auth);
        String loginUserId = getLoginUserId(auth);
        boolean isAdmin = isAdmin(auth);
        attendanceService.batchUpdateAttendanceStatus(
                schdId,
                request.getItems(),
                loginUserId,
                isAdmin
        );
        return ResponseEntity.ok().build();
    }
}