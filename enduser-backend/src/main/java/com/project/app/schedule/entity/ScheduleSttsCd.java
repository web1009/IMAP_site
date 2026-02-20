package com.project.app.schedule.entity;

public enum ScheduleSttsCd {
    AVAILABLE,  // 예약 가능 (유저 화면 노출)
    OPEN,       // 예약 가능 (관리자에서 OPEN으로 저장된 기존 데이터 호환)
    CLOSED;
}