package com.project.app.attendance.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "RESERVATION")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {

    @Id
    @Column(name = "rsv_id")
    private Long rsvId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "schd_id")
    private Long schdId;

    @Column(name = "brch_id")
    private Long brchId;

    @Column(name = "pass_id")
    private Long passId;

    @Column(name = "stts_cd")
    private String sttsCd;

    @Column(name = "rsv_dt")
    private LocalDate rsvDt;

    @Column(name = "rsv_time")
    private LocalTime rsvTime;

    @Column(name = "cncl_rsn")
    private String cnclRsn;

    @Column(name = "upd_id")
    private String updId;

    // 추가) 출석 상태 조회
    public AttendanceStatus getAttendanceStatus() {
        return switch (sttsCd) {
            case "ATTENDED" -> AttendanceStatus.ATTENDED;
            case "ABSENT" -> AttendanceStatus.ABSENT;
            default -> AttendanceStatus.UNCHECKED;
        };
    }

    // 출석 상태 변경
    public void changeAttendanceStatus(AttendanceStatus status) {
        switch (status) {
            case ATTENDED -> this.sttsCd = "ATTENDED";
            case ABSENT -> this.sttsCd = "ABSENT";
            case UNCHECKED -> this.sttsCd = "CONFIRMED";
        }
    }
    
    // 예약 상태를 CONFIRMED로 변경 (결제 확인 시 사용)
    public void confirm() {
        this.sttsCd = "CONFIRMED";
    }

    // 결제/예약 관리 로직에서 직접 상태 코드를 설정할 수 있도록 setter 추가
    public void setSttsCd(String sttsCd) {
        this.sttsCd = sttsCd;
    }
}