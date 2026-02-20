package com.project.app.attendance.dto;

import com.project.app.attendance.entity.AttendanceStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AttendanceUpdateRequest {

    /** 출석 상태: ATTENDED, ABSENT, UNCHECKED (enum 이름 문자열) */
    private String status;

    public AttendanceStatus getStatus() {
        if (status == null || status.isBlank()) {
            return AttendanceStatus.UNCHECKED;
        }
        try {
            return AttendanceStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return AttendanceStatus.UNCHECKED;
        }
    }
}
