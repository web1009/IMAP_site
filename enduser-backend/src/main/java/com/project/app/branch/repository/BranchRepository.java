package com.project.app.branch.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.branch.entity.Branch;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
	
	// 운영 중인 지점만 조회 (oper_yn = true)
	List<Branch> findByOperYnTrue();

//	boolean existsByBrchNm(String brchNm);
//	Optional<Branch> findByBrchNm(String brchNm);
}