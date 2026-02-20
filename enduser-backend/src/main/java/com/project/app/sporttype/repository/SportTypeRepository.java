package com.project.app.sporttype.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.sporttype.entity.SportType;

@Repository
public interface SportTypeRepository extends JpaRepository<SportType, Long> {
	
	// 사용 중인 종목만 조회 (use_yn = true, del_dt IS NULL은 @Where로 자동 처리됨)
	List<SportType> findByUseYnTrue();
}
