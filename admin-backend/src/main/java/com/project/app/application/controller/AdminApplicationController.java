package com.project.app.application.controller;

import com.project.app.application.domain.ProgramApplication;
import com.project.app.application.service.AdminApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/application")
@RequiredArgsConstructor
public class AdminApplicationController {

    private final AdminApplicationService adminApplicationService;

    @GetMapping
    public List<ProgramApplication> getApplicationList() {
        return adminApplicationService.getApplicationList();
    }
}
