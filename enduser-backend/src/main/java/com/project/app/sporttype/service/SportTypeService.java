package com.project.app.sporttype.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.sporttype.entity.SportType;
import com.project.app.sporttype.repository.SportTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SportTypeService {

	private final SportTypeRepository sportTypeRepository;
	
	// 모든 종목 데이터 가져오기 메서드 (use_yn = true, del_dt IS NULL인 것만)
	@Transactional(readOnly = true)
	public List<SportType> getAllSportTypes() {
		List<SportType> result = sportTypeRepository.findByUseYnTrue();
		log.info("조회된 종목 개수: {}", result.size());
		return result;
	}
	
}
