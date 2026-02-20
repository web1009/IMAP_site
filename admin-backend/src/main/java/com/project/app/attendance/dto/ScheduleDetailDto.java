package com.project.app.attendance.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ScheduleDetailDto {

    private final SummaryDto summary;
    @JsonProperty("reservations")
    private final List<ReservationDto> reservations;

    public static ScheduleDetailDto of(
            SummaryDto summary,
            List<ReservationDto> reservations
    ) {
        return new ScheduleDetailDto(summary, reservations);
    }
}
