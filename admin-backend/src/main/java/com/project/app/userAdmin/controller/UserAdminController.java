// Fixed @PathVariable name issue
package com.project.app.userAdmin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.config.security.JwtTokenProvider;
import com.project.app.config.util.UserIdGenerator;
import com.project.app.userAdmin.dto.UserAdminRequestDto;
import com.project.app.userAdmin.entity.UserAdmin;
import com.project.app.userAdmin.service.UserAdminService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/admin/")
public class UserAdminController {

	private final UserAdminService userAdminService;

	public UserAdminController(UserAdminService userAdminService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
		this.userAdminService = userAdminService;
	}

	@GetMapping("/all")
	public ResponseEntity<List<UserAdmin>> getAllUsers(){
		List<UserAdmin> users = userAdminService.getAllUsers();
		return ResponseEntity.ok(users);
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> createUser(@RequestBody UserAdminRequestDto userAdminRequestDto) {
		try {
			// 필수 필드 검증
			if (userAdminRequestDto.getEmail() == null || userAdminRequestDto.getEmail().trim().isEmpty()) {
				return ResponseEntity.badRequest().body("이메일은 필수 항목입니다.");
			}
			
			if (userAdminRequestDto.getPassword() == null || userAdminRequestDto.getPassword().trim().isEmpty()) {
				return ResponseEntity.badRequest().body("비밀번호는 필수 항목입니다.");
			}
			
			if (userAdminRequestDto.getUserName() == null || userAdminRequestDto.getUserName().trim().isEmpty()) {
				return ResponseEntity.badRequest().body("이름은 필수 항목입니다.");
			}

			if (userAdminRequestDto.getUserId() == null || userAdminRequestDto.getUserId().equalsIgnoreCase("")) {
				UserIdGenerator generator = new UserIdGenerator();
				userAdminRequestDto.setUserId(generator.generateUniqueUserId());

				if (userAdminService.existsByEmail(userAdminRequestDto.getEmail())) {
					return ResponseEntity.badRequest().body("이미 사용중인 이메일 입니다.");
				}
				
				userAdminService.createAdminUser(userAdminRequestDto);
			} else {
				userAdminService.updateAdminUser(userAdminRequestDto);
			}

			return ResponseEntity.status(HttpStatus.CREATED).body(userAdminRequestDto);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원가입 처리 중 오류가 발생했습니다. : " + e.getMessage());
		}

	}

	@GetMapping("/userinfo/{userId}")
	public ResponseEntity<?> userinfo(@PathVariable("userId") String userId) {
		try {
			return ResponseEntity.ok(userAdminService.findByUserId(userId)); // 200 OK와 사용자 정보 반환
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("사용자 정보 조회 처리 중 오류가 발생했습니다. : " + e.getMessage());
		}

	}

	// 강사 지점 배정
	@PostMapping("/assign-branch")
	public ResponseEntity<?> assignBranchToInstructor(@RequestBody UserAdminRequestDto userAdminRequestDto) {
		try {
			if (userAdminRequestDto.getUserId() == null) {
				return ResponseEntity.badRequest().body("강사 ID가 필요합니다.");
			}
			if (userAdminRequestDto.getBrchId() == null) {
				return ResponseEntity.badRequest().body("지점 ID가 필요합니다.");
			}
			
			UserAdmin updated = userAdminService.updateAdminUser(userAdminRequestDto);
			return ResponseEntity.ok(updated);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("지점 배정 중 오류가 발생했습니다. : " + e.getMessage());
		}
	}

	// 지점별 강사 조회
	@GetMapping("/branch/{brchId}")
	public ResponseEntity<List<UserAdmin>> getInstructorsByBranch(@PathVariable("brchId") Long brchId) {
		try {
			List<UserAdmin> instructors = userAdminService.getInstructorsByBranchId(brchId);
			return ResponseEntity.ok(instructors);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}
