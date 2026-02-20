package com.project.app.schedule.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.entity.ScheduleSttsCd;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // --- 종목 ID를 통한 스케줄 조회 (스케줄의 지점 = schedule.brch_id 기준) ---
    @Query("SELECT s FROM Schedule s " +
            "JOIN s.program p " +
            "JOIN p.sportType st " +
            "JOIN s.userAdmin ua " +
            "JOIN s.branch sb " +
            "WHERE st.sportId = :sportId " +
            "AND s.sttsCd IN :scheduleStatuses " +
            "AND s.strtDt >= :currentDate " +
            "AND (:selectedDate IS NULL OR s.strtDt = :selectedDate) " +
            "AND (" +
            "    :searchKeyword IS NULL OR :searchKeyword = '' OR " +
            "    LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
            "    LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
            "    LOWER(sb.brchNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
            ") " +
            "ORDER BY s.strtDt ASC, s.userAdmin.userId ASC, s.program.progId ASC, s.strtTm ASC, s.endTm ASC")
    List<Schedule> findAvailableSchedulesBySportId(
            @Param("sportId") Long sportId,
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime,
            @Param("selectedDate") LocalDate selectedDate,
            @Param("searchKeyword") String searchKeyword,
            @Param("scheduleStatuses") Collection<ScheduleSttsCd> scheduleStatuses
    );

    // --- 지점 ID를 통한 스케줄 조회 (스케줄의 brch_id = 수업 진행 지점 기준, 강사 소속 지점 무관) ---
    @Query("SELECT s FROM Schedule s " +
            "JOIN s.program p " +
            "JOIN s.userAdmin ua " +
            "JOIN s.branch sb " +
            "WHERE sb.brchId = :brchId " +
            "AND s.sttsCd IN :scheduleStatuses " +
            "AND s.strtDt >= :currentDate " +
            "AND (:selectedDate IS NULL OR s.strtDt = :selectedDate) " +
            "AND (" +
            "    :searchKeyword IS NULL OR :searchKeyword = '' OR " +
            "    LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
            "    LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
            "    LOWER(sb.brchNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
            ") " +
            "ORDER BY s.strtDt ASC, s.userAdmin.userId ASC, s.program.progId ASC, s.strtTm ASC, s.endTm ASC")
    List<Schedule> findAvailableSchedulesByBrchId(
            @Param("brchId") Long brchId,
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime,
            @Param("selectedDate") LocalDate selectedDate,
            @Param("searchKeyword") String searchKeyword,
            @Param("scheduleStatuses") Collection<ScheduleSttsCd> scheduleStatuses
    );

    List<Schedule> findByStrtDtBeforeAndSttsCdIn(LocalDate strtDt, Collection<ScheduleSttsCd> sttsCds);
    
    // 결제 처리 시 사용: program과 userAdmin, branch를 함께 로드
    @Query("SELECT s FROM Schedule s " +
           "LEFT JOIN FETCH s.program p " +
           "LEFT JOIN FETCH s.userAdmin ua " +
           "LEFT JOIN FETCH ua.branch b " +
           "WHERE s.schdId = :schdId")
    Schedule findByIdWithDetails(@Param("schdId") Long schdId);

}