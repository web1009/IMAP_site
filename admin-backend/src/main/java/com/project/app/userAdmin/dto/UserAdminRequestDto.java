package com.project.app.userAdmin.dto;

import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.app.userAdmin.entity.UserAdmin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // getter, setter, equals, hashCode, toString 자동 생성
@NoArgsConstructor      // 파라미터 없는 기본 생성자
@AllArgsConstructor     // 모든 필드를 파라미터로 받는 생성자
@Builder                // 빌더 패턴 구현
@JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시 (cashPoint, gradePoint 등)
public class UserAdminRequestDto {
	private String userId;
	private String email;
	private String userName;
	private String password;
	private String role;
	private String isActive;
	private String agreeAt;  // 프론트에서 boolean으로 보내도 String으로 받음
	private String phoneNumber;
	private Long brchId;  // 지점 ID 추가
	private boolean success;
	private String message;
}