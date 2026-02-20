package com.project.app.review.service;

import com.project.app.reservation.mapper.MyReservationMapper;
import com.project.app.review.dto.ReviewDto;
import com.project.app.review.mapper.ReviewMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final MyReservationMapper myReservationMapper;

    public ReviewServiceImpl(ReviewMapper reviewMapper, MyReservationMapper myReservationMapper) {
        this.reviewMapper = reviewMapper;
        this.myReservationMapper = myReservationMapper;
    }

    public void createReview(ReviewDto reviewDto) {
        log.info("[ReviewServiceImpl] 리뷰 작성 시작 - reservationId: {}", reviewDto.getReservationId());
        reviewMapper.insertReview(reviewDto);
        // 예약에 리뷰 작성 완료 표시 (리뷰 작성하기 목록에서 제외됨) - MyBatis로 직접 업데이트
        myReservationMapper.updateReviewWritten(reviewDto.getReservationId(), true);
        log.info("[ReviewServiceImpl] 리뷰 작성 완료");
    }

    public List<ReviewDto> getMyReviewList(String userId) {
        log.info("[ReviewServiceImpl] getMyReviewList 호출됨 - userId: {}", userId);
        try {
            List<ReviewDto> result = reviewMapper.selectMyReviewList(userId);
            log.info("[ReviewServiceImpl] 조회 성공 - 결과 개수: {}", result != null ? result.size() : 0);
            return result;
        } catch (Exception e) {
            log.error("[ReviewServiceImpl] 조회 실패 - userId: {}, 에러: {}", userId, e.getMessage(), e);
            throw e;
        }
    }

    public void updateReview(Long reviewId, ReviewDto reviewDto) {
        int count = reviewMapper.countByReviewIdAndUserId(reviewId, reviewDto.getUserId());
        if (count == 0) {
            throw new RuntimeException("권한이 없습니다. 본인 리뷰만 수정 가능합니다.");
        }
        reviewDto.setReviewId(reviewId);
        reviewMapper.updateReview(reviewDto);
    }

    public void deleteReview(Long reviewId, String userId) {
        log.info("[ReviewServiceImpl] 리뷰 삭제 시작 - reviewId: {}, userId: {}", reviewId, userId);
        
        int count = reviewMapper.countByReviewIdAndUserId(reviewId, userId);
        if (count == 0) {
            throw new RuntimeException("권한이 없습니다. 본인 리뷰만 삭제 가능합니다.");
        }
        
        Long reservationId = reviewMapper.selectReviewDetail(reviewId).getReservationId();
        reviewMapper.deleteReview(reviewId);
        // 예약의 리뷰 작성 여부 초기화 (리뷰 작성하기 목록에 다시 표시됨)
        myReservationMapper.updateReviewWritten(reservationId, false);
        log.info("[ReviewServiceImpl] 리뷰 삭제 완료 - reviewId: {}", reviewId);
    }

    @Override
    public void updateReview(Long reviewId, String userId, ReviewDto reviewDto) {
        // TODO Auto-generated method stub
    }
}