package com.project.app.reservation.scheduler;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.project.app.reservation.service.ReservationReminderMailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 예약일 하루 전 리마인드 이메일 스케줄러
 * 매일 오전 9시에 내일 예약이 있는 유저에게 이메일 발송 (이미지 첨부)
 * 사용 시 application에서 app.reminder-mail.enabled=true 및 spring.mail.* 설정 필요
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.reminder-mail.enabled", havingValue = "true")
@ConditionalOnBean(ReservationReminderMailService.class)
public class ReservationReminderScheduler {

	private final ReservationReminderMailService reservationReminderMailService;

	/** 매일 오전 9시 실행 (cron: 초 분 시 일 월 요일) */
	@Scheduled(cron = "0 0 9 * * ?")
	public void sendReservationReminders() {
		log.info("[ReservationReminderScheduler] 예약 리마인드 메일 스케줄러 시작");

		try {
			int sent = reservationReminderMailService.sendReminderEmailsForTomorrow();
			log.info("[ReservationReminderScheduler] 리마인드 메일 발송 완료 - 건수: {}", sent);
		} catch (Exception e) {
			log.error("[ReservationReminderScheduler] 리마인드 메일 발송 중 오류", e);
		}

		log.info("[ReservationReminderScheduler] 예약 리마인드 메일 스케줄러 종료");
	}
}
