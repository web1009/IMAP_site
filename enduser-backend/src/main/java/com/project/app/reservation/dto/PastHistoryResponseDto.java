package com.project.app.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.project.app.reservation.entity.Reservation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PastHistoryResponseDto {

    private Long reservationId;
    private Long scheduleId; // 스케줄 ID (프로그램 상세 페이지 연동용)
    private Long progId;     // 프로그램 ID (이미지 매칭용)
    private String sportName;
    private String brchNm;
    private String trainerName;
    private LocalDate rsvDt;
    private LocalTime rsvTime;
    private Long refId;
    private Boolean reviewWritten;
    
    public static PastHistoryResponseDto from(Reservation reservation) {
        if (reservation == null) {
            return null;
        }
        
        return PastHistoryResponseDto.builder()
                .reservationId(reservation.getRsvId())
                .scheduleId(reservation.getSchedule() != null ? reservation.getSchedule().getSchdId() : null)
                .progId(reservation.getSchedule() != null && reservation.getSchedule().getProgram() != null
                        ? reservation.getSchedule().getProgram().getProgId() : null)
                .sportName(
                        reservation.getSchedule() != null
                                && reservation.getSchedule().getProgram() != null
                                && reservation.getSchedule().getProgram().getSportType() != null
                                ? reservation.getSchedule().getProgram().getSportType().getSportNm()
                                : null)
                .brchNm(
                        reservation.getBranch() != null
                                ? reservation.getBranch().getBrchNm()
                                : null)
                .trainerName(
                        reservation.getSchedule() != null
                                && reservation.getSchedule().getUserAdmin() != null
                                ? reservation.getSchedule().getUserAdmin().getUserName()
                                : null)
                .rsvDt(reservation.getRsvDt())
                .rsvTime(reservation.getRsvTime())
                .refId(reservation.getRsvId())
                .reviewWritten(reservation.isReviewWritten())
                .build();
    }

    /** MyBatis 행(출석 ATTENDED 기준) → 응답 DTO */
    public static PastHistoryResponseDto fromRow(PastHistoryRowDto row) {
        if (row == null) return null;
        return PastHistoryResponseDto.builder()
                .reservationId(row.getRsvId())
                .scheduleId(row.getSchdId())
                .progId(row.getProgId())
                .sportName(row.getSportName())
                .brchNm(row.getBrchNm())
                .trainerName(row.getTrainerName())
                .rsvDt(row.getRsvDt())
                .rsvTime(row.getRsvTime())
                .refId(row.getRsvId())
                .reviewWritten(row.getReviewWritten() != null ? row.getReviewWritten() : false)
                .build();
    }
}