package com.project.app.application.service;

import com.project.app.application.domain.ProgramApplication;
import com.project.app.application.mapper.AdminApplicationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminApplicationService {

    private final AdminApplicationMapper adminApplicationMapper;

    public List<ProgramApplication> getApplicationList() {
        return adminApplicationMapper.findAll();
    }
}
