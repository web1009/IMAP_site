package com.project.app.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 관리자 예약관리 페이지용 스케줄 목록 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminScheduleListDto {
    private Long scheduleId;
    private String startTime;
    private String endTime;
    private String branchName;
    private String programName;
    private String instructorName;
    /** 예약한 사용자 이름 (쉼표 구분) */
    private String reservedUserNames;
    private Integer currentCount;
    private Integer maxCount;
    private String status;
}
