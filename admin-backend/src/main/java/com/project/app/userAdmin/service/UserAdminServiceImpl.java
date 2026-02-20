package com.project.app.userAdmin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.app.userAdmin.dto.UserAdminRequestDto;
import com.project.app.userAdmin.entity.UserAdmin;
import com.project.app.userAdmin.repository.UserAdminRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserAdminServiceImpl implements UserAdminService {
	private final UserAdminRepository userAdminRepository;
	private final PasswordEncoder passwordEncoder;

	public UserAdminServiceImpl(UserAdminRepository userAdminRepository, PasswordEncoder passwordEncoder) {
		this.userAdminRepository = userAdminRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public UserAdmin createAdminUser(UserAdminRequestDto userAdminRequestDto) {
		
		UserAdmin user = UserAdmin.builder()
				.userId(userAdminRequestDto.getUserId())
				.userName(userAdminRequestDto.getUserName())
				.password(passwordEncoder.encode(userAdminRequestDto.getPassword())) // 비밀번호 암호화
				.role("USER") // 기본 권한 설정 admin 사용자 관리 에서 수정.
				.email(userAdminRequestDto.getEmail())
				.phoneNumber(userAdminRequestDto.getPhoneNumber())
				.brchId(userAdminRequestDto.getBrchId()) // 지점 ID 설정
				.agreeAt(LocalDateTime.now())
				.isActive(true)
				.build();
		
		try {
			UserAdmin savedUser = userAdminRepository.save(user);
			log.info("UserAdmin 생성 성공 - userId: {}, email: {}", savedUser.getUserId(), savedUser.getEmail());
			return savedUser;
		} catch (Exception e) {
			log.error("UserAdmin 생성 실패 - userId: {}, email: {}, error: {}", 
					userAdminRequestDto.getUserId(), userAdminRequestDto.getEmail(), e.getMessage(), e);
			throw e;
		}
	}
	
	@Transactional
	public UserAdmin updateAdminUser(UserAdminRequestDto userAdminRequestDto) {
		UserAdmin existingUser = userAdminRepository.findByUserId(userAdminRequestDto.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
		existingUser.setUserName(userAdminRequestDto.getUserName());
		existingUser.setEmail(userAdminRequestDto.getEmail());
		existingUser.setPhoneNumber(userAdminRequestDto.getPhoneNumber());
		
		// 지점 배정 업데이트
		if (userAdminRequestDto.getBrchId() != null) {
			existingUser.setBrchId(userAdminRequestDto.getBrchId());
		}
		
		if (!passwordEncoder.matches(userAdminRequestDto.getPassword(), existingUser.getPassword())) {
			existingUser.setPassword(passwordEncoder.encode(userAdminRequestDto.getPassword()));	
		}

		return userAdminRepository.save(existingUser);
	}
	
	// 아이디 존재 유무조회
	public boolean existsByUserId(String userId) {
		return userAdminRepository.existsByUserId(userId);
	}

	// email 존재 유무조회
	public boolean existsByEmail(String email) {
		return userAdminRepository.existsByEmail(email);
	}

	// 아이디로 사용자 조회
	public Optional<UserAdmin> findByUserId(String userId) {
		return userAdminRepository.findByUserId(userId);
	}

	public List<UserAdmin> getAllUsers() {
		List<UserAdmin> users = userAdminRepository.findAll();
		return users;
	}

	/**
	 * 스케줄 관리 등에서 "강사" 목록. USERS_ADMIN의 instructor_01 등 강사 계정 반환.
	 * instructor → teacher 순으로 찾고, 없으면 전체 관리자 반환.
	 */
	public List<UserAdmin> getTeachers() {
		List<UserAdmin> list = userAdminRepository.findByUserIdContaining("instructor");
		if (list != null && !list.isEmpty()) return list;
		list = userAdminRepository.findByUserIdContaining("teacher");
		if (list != null && !list.isEmpty()) return list;
		return userAdminRepository.findAll();
	}

	public Optional<UserAdmin> getUserByEmailAdmin(String email) {
		return userAdminRepository.getUserByEmailAndRole(email, "ADMIN");
	}
	
	public Optional<UserAdmin> getUserByEmail(String email) {
        return userAdminRepository.getUserByEmail(email);
    }

	public List<UserAdmin> getInstructorsByBranchId(Long brchId) {
		return userAdminRepository.findByBrchId(brchId);
	}

}
