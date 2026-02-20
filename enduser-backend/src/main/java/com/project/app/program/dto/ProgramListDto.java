package com.project.app.program.dto;

import com.project.app.program.entity.Program;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramListDto {
    private Long progId;
    private String progNm;

    public static ProgramListDto from(Program program) {
        return ProgramListDto.builder()
                .progId(program.getProgId())
                .progNm(program.getProgNm())
                .build();
    }
}
