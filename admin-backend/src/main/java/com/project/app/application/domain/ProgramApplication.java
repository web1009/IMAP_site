package com.project.app.application.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 프로그램 신청 도메인 (MyBatis용)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramApplication {

    @JsonProperty("application_id")
    private Long applicationId;

    @JsonProperty("name")
    private String name;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("program")
    private String program;

    @JsonProperty("motivation")
    private String motivation;

    @JsonProperty("status")
    private String status;

    @JsonProperty("reg_dt")
    private String regDt;

    @JsonProperty("upd_dt")
    private String updDt;
}
