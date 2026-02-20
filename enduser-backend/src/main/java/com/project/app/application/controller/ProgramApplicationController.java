package com.project.app.application.controller;

import com.project.app.application.dto.ApplicationRequestDto;
import com.project.app.application.dto.ApplicationResponseDto;
import com.project.app.application.service.ProgramApplicationService;
import com.project.app.aspect.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/user/application")
@RequiredArgsConstructor
public class ProgramApplicationController {

    private final ProgramApplicationService applicationService;

    /**
     * 프로그램 신청
     * POST /api/user/application
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> createApplication(
            @RequestBody ApplicationRequestDto requestDto
    ) {
        try {
            log.info("프로그램 신청 API 호출: {}", requestDto);
            
            ApplicationResponseDto response = applicationService.createApplication(requestDto);
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            log.error("프로그램 신청 처리 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("프로그램 신청 처리 중 오류가 발생했습니다."));
        }
    }
}
