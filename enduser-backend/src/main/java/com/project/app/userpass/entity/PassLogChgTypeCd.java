package com.project.app.userpass.entity;

public enum PassLogChgTypeCd {
    USE,
    BUY,
    CANCEL,
    /** 예약 시 기록 (어드민 출석관리 참석자 목록 연동) */
    RESERVE,

    // 거래 로그 타입 추가
    TRADE_SELL,
    TRADE_BUY
}