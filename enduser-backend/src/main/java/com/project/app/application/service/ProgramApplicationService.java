package com.project.app.application.service;

import com.project.app.application.dto.ApplicationRequestDto;
import com.project.app.application.dto.ApplicationResponseDto;
import com.project.app.application.entity.ProgramApplication;
import com.project.app.application.repository.ProgramApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProgramApplicationService {

    private final ProgramApplicationRepository applicationRepository;

    @Transactional
    public ApplicationResponseDto createApplication(ApplicationRequestDto requestDto) {
        log.info("프로그램 신청 생성 요청: {}", requestDto);

        ProgramApplication application = ProgramApplication.builder()
                .name(requestDto.getName())
                .phone(requestDto.getPhone())
                .program(requestDto.getProgram())
                .motivation(requestDto.getMotivation())
                .status("PENDING")
                .build();

        ProgramApplication saved = applicationRepository.save(application);
        log.info("프로그램 신청 저장 완료: applicationId={}", saved.getApplicationId());

        return ApplicationResponseDto.from(saved);
    }
}
