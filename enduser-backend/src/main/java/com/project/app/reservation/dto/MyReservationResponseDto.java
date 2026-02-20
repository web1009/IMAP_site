package com.project.app.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.app.reservation.entity.AttendanceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyReservationResponseDto {

    private Long reservationId;  // rsv_id (취소 시 사용)
    private Long progId;
    private String sportName;
    private String brchNm;
    private String trainerName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate rsvDt;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime rsvTime;
    private AttendanceStatus attendanceStatus;

    /** reservation 기반 조회 행 → 응답 DTO */
    public static MyReservationResponseDto fromRow(MyReservationRowDto row) {
        if (row == null) return null;
        return MyReservationResponseDto.builder()
                .reservationId(row.getRsvId())
                .progId(row.getProgId())
                .sportName(row.getSportName())
                .brchNm(row.getBrchNm())
                .trainerName(row.getTrainerName())
                .rsvDt(row.getRsvDt())
                .rsvTime(row.getRsvTime())
                .attendanceStatus(parseAttendanceStatus(row.getAttendanceStatus()))
                .build();
    }

    private static AttendanceStatus parseAttendanceStatus(String value) {
        if (value == null || value.isEmpty()) return AttendanceStatus.UNCHECKED;
        try {
            return AttendanceStatus.valueOf(value);
        } catch (IllegalArgumentException e) {
            return AttendanceStatus.UNCHECKED;
        }
    }
}