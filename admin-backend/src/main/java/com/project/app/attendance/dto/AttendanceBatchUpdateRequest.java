package com.project.app.attendance.dto;

import java.util.List;

import com.project.app.attendance.entity.AttendanceStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 출석 상태 일괄 저장 요청
 */
@Getter
@Setter
@NoArgsConstructor
public class AttendanceBatchUpdateRequest {

    /** 예약별 출석 상태 목록 */
    private List<Item> items;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Item {
        private Long reservationId;
        private String status;

        public AttendanceStatus getStatusAsEnum() {
            if (status == null || status.isBlank()) return AttendanceStatus.UNCHECKED;
            try {
                return AttendanceStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                return AttendanceStatus.UNCHECKED;
            }
        }
    }
}
