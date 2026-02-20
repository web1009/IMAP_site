package com.project.app.reservation.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;
import com.project.app.reservation.repository.ReservationRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 예약일 하루 전 유저에게 리마인드 이메일 발송 (이미지 첨부)
 * app.reminder-mail.enabled=true 및 spring.mail.* 설정 시에만 빈 등록
 */
@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.reminder-mail.enabled", havingValue = "true")
@ConditionalOnBean(JavaMailSender.class)
public class ReservationReminderMailService {

	private static final String ATTACHMENT_PATH = "static/email.jpg";
	private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

	private final JavaMailSender mailSender;
	private final ReservationRepository reservationRepository;

	/**
	 * 내일 예약이 있는 확정 예약 목록을 조회해, 각 유저 이메일로 리마인드 메일 발송 (이미지 첨부)
	 * @return 발송 건수
	 */
	public int sendReminderEmailsForTomorrow() {
		LocalDate tomorrow = LocalDate.now().plusDays(1);
		List<Reservation> list = reservationRepository.findByRsvDtAndSttsCd(tomorrow, RsvSttsCd.CONFIRMED);
		int sent = 0;
		for (Reservation r : list) {
			try {
				sendReminderEmail(r);
				sent++;
			} catch (Exception e) {
				String email = r.getUser() != null ? r.getUser().getEmail() : null;
				log.warn("[ReservationReminder] 메일 발송 실패 rsvId={}, email={}", r.getRsvId(), email, e);
			}
		}
		return sent;
	}

	private void sendReminderEmail(Reservation r) throws MessagingException {
		if (r.getUser() == null) {
			throw new MessagingException("예약에 사용자 정보 없음 rsvId=" + r.getRsvId());
		}
		String to = r.getUser().getEmail();
		if (to == null || to.isBlank()) {
			throw new MessagingException("수신 이메일 없음 rsvId=" + r.getRsvId());
		}

		String userName = r.getUser().getUserName() != null ? r.getUser().getUserName() : "회원";
		String rsvDateStr = r.getRsvDt() != null ? r.getRsvDt().format(DATE_FMT) : "";
		String rsvTimeStr = r.getRsvTime() != null ? r.getRsvTime().toString() : "";
		String programName = "프로그램";
		if (r.getSchedule() != null && r.getSchedule().getProgram() != null && r.getSchedule().getProgram().getProgNm() != null) {
			programName = r.getSchedule().getProgram().getProgNm();
		}
		String branchName = "지점";
		if (r.getBranch() != null && r.getBranch().getBrchNm() != null) {
			branchName = r.getBranch().getBrchNm();
		}

		String subject = "[IMAP] 내일(" + rsvDateStr + ") 예약 안내";
		String htmlBody = String.format(
			"<h2>%s님, 내일 예약이 있습니다.</h2>" +
			"<p><strong>예약일:</strong> %s</p>" +
			"<p><strong>예약 시간:</strong> %s</p>" +
			"<p><strong>프로그램:</strong> %s</p>" +
			"<p><strong>지점:</strong> %s</p>" +
			"<p>당일 출석 확인을 위해 시간에 맞춰 방문해 주세요.</p>" +
			"<p>— IMAP</p>",
			userName, rsvDateStr, rsvTimeStr, programName, branchName
		);

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(htmlBody, true);

		Resource attachment = new ClassPathResource(ATTACHMENT_PATH);
		if (attachment.exists()) {
			helper.addAttachment("email.jpg", attachment);
		} else {
			log.debug("[ReservationReminder] 첨부 이미지 없음: {}", ATTACHMENT_PATH);
		}

		mailSender.send(message);
		log.info("[ReservationReminder] 발송 완료 rsvId={}, to={}", r.getRsvId(), to);
	}
}
