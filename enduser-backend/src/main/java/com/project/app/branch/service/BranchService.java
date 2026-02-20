package com.project.app.branch.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.branch.entity.Branch;
import com.project.app.branch.repository.BranchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BranchService {

    private final BranchRepository branchRepository;

    public List<Branch> getAllBranches() {
        // 운영 중인 지점만 조회 (oper_yn = true)
        List<Branch> result = branchRepository.findByOperYnTrue();
        log.info("조회된 지점 개수: {}", result.size());
        return result;
    }
}