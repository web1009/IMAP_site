package com.project.app.payment.service;

import com.project.app.attendance.entity.Reservation;
import com.project.app.attendance.repository.ReservationRepository;
import com.project.app.payment.domain.Payment;
import com.project.app.payment.mapper.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentMapper paymentMapper;
    private final ReservationRepository reservationRepository;
    
    // PassProductService와 PassLogService는 나중에 필요시 추가
    // private final PassProductService passProductService;
    // private final PassLogService passLogService;
    
    @Override
    public List<Payment> findAll() {
        return paymentMapper.findAll();
    }
    
    @Override
    public Payment findById(Long payId) {
        return paymentMapper.findById(payId);
    }
    
    @Override
    public Payment create(Payment payment) {
        paymentMapper.insert(payment);
        
        // 결제 생성 시 자동으로 PURCHASE 타입의 로그 생성 기능은
        // PassProductService와 PassLogService가 구현되면 활성화
    /*
    if (payment.getRefId() != null && payment.getPayId() != null) {
        PassProduct product = passProductService.findById(payment.getRefId());
        if (product != null) {
            PassLog passLog = PassLog.builder()
                .userPassId(payment.getPayId())
                .chgTypeCd("PURCHASE")
                .chgCnt(product.getPrvCnt())
                .chgRsn("상품 구매")
                .usrId(payment.getUsrId())
                .regDt(LocalDateTime.now())
                .build();
            passLogService.create(passLog);
        }
    }
    */

        return payment;
    }
    
    @Override
    public Payment update(Payment payment) {
        // 기존 결제 정보 조회
        Payment existingPayment = paymentMapper.findById(payment.getPayId());
        
        if (existingPayment != null 
            && payment.getTargetId() != null
            && "SCHEDULE_RESERVATION".equals(payment.getPayTypeCd())) {
            
            // 결제 상태가 PENDING에서 PAID로 변경되는 경우 예약 상태도 업데이트
            if ("PENDING".equals(existingPayment.getSttsCd()) 
                && "PAID".equals(payment.getSttsCd())) {
                
                // 스케줄 예약 결제인 경우, 해당 예약을 CONFIRMED로 변경
                List<Reservation> reservations = reservationRepository.findBySchdIdAndUserId(
                    payment.getTargetId(), 
                    payment.getUsrId()
                );
                
                for (Reservation reservation : reservations) {
                    // 예약 상태가 PENDING인 경우만 CONFIRMED로 변경
                    String currentStatus = reservation.getSttsCd();
                    if ("PENDING".equals(currentStatus)) {
                        reservation.confirm();
                        reservationRepository.save(reservation);
                    }
                }
            }
            // 결제 상태가 PAID에서 PENDING으로 변경되는 경우 예약 상태도 PENDING으로 변경
            else if ("PAID".equals(existingPayment.getSttsCd()) 
                && "PENDING".equals(payment.getSttsCd())) {
                
                // 스케줄 예약 결제인 경우, 해당 예약을 PENDING으로 변경
                List<Reservation> reservations = reservationRepository.findBySchdIdAndUserId(
                    payment.getTargetId(), 
                    payment.getUsrId()
                );
                
                for (Reservation reservation : reservations) {
                    // 예약 상태가 CONFIRMED인 경우만 PENDING으로 변경
                    String currentStatus = reservation.getSttsCd();
                    if ("CONFIRMED".equals(currentStatus)) {
                        reservation.setSttsCd("PENDING");
                        reservationRepository.save(reservation);
                    }
                }
            }
        }
        
        paymentMapper.update(payment);
        return payment;
    }
    
    @Override
    public void delete(Long payId) {
        paymentMapper.delete(payId);
    }
}


