package com.project.app.attendance.repository;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 출석 스케줄 목록 조회용 프로젝션
 */
public interface AttendanceScheduleView {
    Long getSchdId();
    String getUserId();
    LocalDate getStrtDt();
    LocalTime getStrtTm();
    String getSttsCd();
}
