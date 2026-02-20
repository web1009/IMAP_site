package com.project.app.program.dto;

import com.project.app.admin.dto.TeacherInfoResponseDto;
import com.project.app.program.entity.Program;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramResponseDto {

	private Long progId;
	private String progNm;
	private Integer oneTimeAmt;
	private Integer rwdGamePnt;
	private boolean useYn;

	// 종목 정보
	private Long sportId;
	private String sportNm;
	private String sportMemo;
	private String groupCd; // SPORT_TYPE.group_cd (EMOTION / SELF / LIFE / EDUCATION / NETWORK)
	
	private TeacherInfoResponseDto teacherInfo;
	
	public static ProgramResponseDto from(Program program, TeacherInfoResponseDto teacherInfo) {
		return ProgramResponseDto.builder()
				.progId(program.getProgId())
				.progNm(program.getProgNm())
				.oneTimeAmt(program.getOneTimeAmt())
				.rwdGamePnt(program.getRwdGamePnt())
				.useYn(program.isUseYn())
				.sportId(program.getSportType().getSportId())
				.sportNm(program.getSportType().getSportNm())
				.sportMemo(program.getSportType().getSportMemo())
				.groupCd(program.getSportType().getGroupCd())
				.teacherInfo(teacherInfo)
				.build();
	}

}
