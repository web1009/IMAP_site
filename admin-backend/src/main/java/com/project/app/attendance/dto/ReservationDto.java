package com.project.app.attendance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.app.attendance.entity.AttendanceStatus;

import lombok.Getter;

@Getter
public class ReservationDto {

    @JsonProperty("reservationId")
    private final Long rsvId;
    private final String userId;
    private final String userName;
    @JsonProperty("phone")
    private final String phoneNumber;
    @JsonProperty("attendanceStatus")
    private final AttendanceStatus attendanceStatus;
    private final String rsvDt;
    private final String rsvTime;

    /** JPQL "SELECT new ReservationDto(...)" 용 - 5번째 인자는 출석상태 문자열(sttsCd) */
    public ReservationDto(Long rsvId, String userId, String userName, String phoneNumber,
                          String attendanceStatusStr, String rsvDt, String rsvTime) {
        this.rsvId = rsvId;
        this.userId = userId;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.attendanceStatus = parseAttendanceStatus(attendanceStatusStr);
        this.rsvDt = rsvDt;
        this.rsvTime = rsvTime;
    }

    private ReservationDto(Long rsvId, String userId, String userName, String phoneNumber,
                           AttendanceStatus attendanceStatus, String rsvDt, String rsvTime) {
        this.rsvId = rsvId;
        this.userId = userId;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.attendanceStatus = attendanceStatus;
        this.rsvDt = rsvDt;
        this.rsvTime = rsvTime;
    }

    public static ReservationDto of(Long rsvId, String userId, String userName,
                                   String phoneNumber, String attendanceStatusStr,
                                   String rsvDt, String rsvTime) {
        return new ReservationDto(rsvId, userId, userName, phoneNumber, attendanceStatusStr, rsvDt, rsvTime);
    }

    private static AttendanceStatus parseAttendanceStatus(String value) {
        if (value == null || value.isBlank()) return AttendanceStatus.UNCHECKED;
        try {
            return AttendanceStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return AttendanceStatus.UNCHECKED;
        }
    }
}

