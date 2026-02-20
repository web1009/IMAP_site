package com.project.app.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * reservation + users (+ pass_log) 조회 결과 매핑용.
 * 서비스에서 ReservationDto로 변환해 API 응답에 사용.
 * reservationId = rsv_id (출석 체크 시 사용).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendeeRow {

    /** 예약 PK (출석 체크 시 이 ID로 pass_log 또는 reservation 업데이트) */
    private Long reservationId;
    private String userId;
    private String userName;
    private String phoneNumber;
    private String attendanceStatus;
    private String rsvDt;
    private String rsvTime;
}
