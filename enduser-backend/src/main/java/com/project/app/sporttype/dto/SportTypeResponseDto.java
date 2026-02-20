package com.project.app.sporttype.dto;

import java.time.LocalDateTime;

import com.project.app.sporttype.entity.SportType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SportTypeResponseDto {

	private Long sportId;
	private String sportNm;
	private String groupCd;			// 그룹코드 (EMOTION/SELF/LIFE/EDUCATION/NETWORK)
	private String sportMemo;
	private boolean useYn;
	private LocalDateTime regDt;
	private LocalDateTime updDt;
	private LocalDateTime delDt;
	
	// dto 변환 메서드
	public static SportTypeResponseDto from(SportType sportType) {
		return SportTypeResponseDto.builder()
				.sportId(sportType.getSportId())
				.sportNm(sportType.getSportNm())
				.groupCd(sportType.getGroupCd())
				.sportMemo(sportType.getSportMemo())
				.useYn(sportType.isUseYn())
				.regDt(sportType.getRegDt())
				.updDt(sportType.getUpdDt())
				.delDt(sportType.getDelDt())
				.build();
	}
}
