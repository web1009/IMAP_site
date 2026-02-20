package com.project.app.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** reservation + schedule + program 조회 한 행 (마이페이지 예약 현황용) */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyReservationRowDto {

    /** 예약 PK (취소 시 사용) */
    private Long rsvId;
    private Long schdId;
    private Long progId;
    private String sportName;
    private String brchNm;
    private String trainerName;
    private LocalDate rsvDt;
    private LocalTime rsvTime;
    private String attendanceStatus;
}
