package com.project.app.schedule.service;

import com.project.app.schedule.domain.Schedule;
import com.project.app.schedule.dto.AdminScheduleListDto;

import java.util.List;

public interface ScheduleService {

    List<AdminScheduleListDto> getAdminList(String date, Long branchId);

    List<Schedule> findAll();
    Schedule findById(Long schdId);
    Schedule create(Schedule schedule);
    Schedule update(Schedule schedule);
    void delete(Long schdId);
}
