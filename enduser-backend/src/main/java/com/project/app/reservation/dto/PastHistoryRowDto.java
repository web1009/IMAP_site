package com.project.app.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 이용내역/리뷰 조회용 행 DTO (MyBatis resultMap 매핑) */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PastHistoryRowDto {

    private Long rsvId;
    private Long schdId;
    private Long progId;
    private String sportName;
    private String brchNm;
    private String trainerName;
    private LocalDate rsvDt;
    private LocalTime rsvTime;
    private Boolean reviewWritten;
}
