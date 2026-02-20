package com.project.app.application.dto;

import com.project.app.application.entity.ProgramApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDto {
    private Long applicationId;
    private String name;
    private String phone;
    private String program;
    private String motivation;
    private String status;
    private LocalDateTime regDt;

    public static ApplicationResponseDto from(ProgramApplication application) {
        return ApplicationResponseDto.builder()
                .applicationId(application.getApplicationId())
                .name(application.getName())
                .phone(application.getPhone())
                .program(application.getProgram())
                .motivation(application.getMotivation())
                .status(application.getStatus())
                .regDt(application.getRegDt())
                .build();
    }
}
