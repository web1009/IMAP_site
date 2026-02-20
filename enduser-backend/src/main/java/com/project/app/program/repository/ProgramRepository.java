package com.project.app.program.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.program.entity.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {

	/** 사용 여부가 Y인 프로그램 목록 조회 (신청 폼 등에서 사용) */
	List<Program> findByUseYnTrue();
}
