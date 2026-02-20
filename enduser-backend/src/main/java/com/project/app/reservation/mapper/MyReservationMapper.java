package com.project.app.reservation.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.app.reservation.dto.MyReservationRowDto;
import com.project.app.reservation.dto.PastHistoryRowDto;

/**
 * 마이페이지 예약 현황 - pass_log 기준 조회 (어드민 출결관리와 동일 데이터 소스)
 */
@Mapper
public interface MyReservationMapper {

    List<MyReservationRowDto> findMyReservationsByUserId(@Param("userId") String userId);

    /** 이용내역/리뷰: 출석(ATTENDED) 처리된 예약만 조회 */
    List<PastHistoryRowDto> findAttendedReservationsForHistory(@Param("userId") String userId);

    /** 이용내역/리뷰: unwrittenOnly=true 시 리뷰 미작성(review_written=0)만 반환 */
    List<PastHistoryRowDto> findAttendedReservationsForHistoryFiltered(
            @Param("userId") String userId,
            @Param("unwrittenOnly") Boolean unwrittenOnly);

    /** 예약의 리뷰 작성 여부 업데이트 */
    int updateReviewWritten(@Param("rsvId") Long rsvId, @Param("reviewWritten") boolean reviewWritten);
}
