package com.project.app.attendance.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.app.attendance.dto.AttendeeRow;

/**
 * 출결 관리 - 참석자 목록은 RESERVATION 기준, 출석 상태는 pass_log 또는 reservation에 저장.
 * - 참석자 목록: 해당 스케줄의 예약(reservation) 전부 (이용권 유무 관계없이)
 * - 출석 체크: 이용권 예약이면 pass_log, 이용권 없이 예약이면 reservation.attendance_status
 */
@Mapper
public interface AttendanceMapper {

    /** 스케줄별 참석자 목록 (reservation.schd_id 기준, CONFIRMED/PENDING) */
    List<AttendeeRow> findAttendeesBySchdId(@Param("schdId") Long schdId);

    /** rsv_id로 해당 예약의 pass_log_id 조회 (이용권 예약이면 1건) */
    Long findPassLogIdByRsvId(@Param("rsvId") Long rsvId);

    /** 출석 체크: pass_log.attendance_status 갱신 */
    int updatePassLogAttendance(@Param("passLogId") Long passLogId, @Param("status") String status);

    /** 출석 체크: 이용권 없이 예약한 건 - reservation.attendance_status 갱신 */
    int updateReservationAttendance(@Param("rsvId") Long rsvId, @Param("status") String status);
}
