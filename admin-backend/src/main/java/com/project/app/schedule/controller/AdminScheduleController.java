package com.project.app.schedule.controller;

import com.project.app.schedule.dto.AdminScheduleListDto;
import com.project.app.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/schedules")
@RequiredArgsConstructor
public class AdminScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<AdminScheduleListDto>> getSchedules(
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "branchId", required = false) Long branchId) {
        List<AdminScheduleListDto> list = scheduleService.getAdminList(date, branchId);
        return ResponseEntity.ok(list);
    }
}
