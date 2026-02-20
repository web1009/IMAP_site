package com.project.app.config.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends GenericFilterBean {

	// JWT 토큰을 처리하는 클래스
	private final JwtTokenProvider jwtTokenProvider;

	// 생성자: JwtTokenProvider를 주입받습니다
	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
		this.jwtTokenProvider = jwtTokenProvider;
	}

	/**
	 * 필터 메인 로직 모든 HTTP 요청이 들어올 때마다 실행됩니다
	 */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		try {
			// 1. HTTP 요청 헤더에서 JWT 토큰 추출
			String token = resolveToken((HttpServletRequest) request);

			// 2. 토큰이 존재하는 경우에만 검증 및 인증 처리
			// SecurityConfig에서 permitAll()로 설정된 경로는 토큰이 없어도 통과
			// 토큰이 있지만 유효하지 않으면 인증 정보를 설정하지 않고 통과 (SecurityConfig가 인증 필요 여부 결정)
			if (token != null) {
				try {
					if (jwtTokenProvider.validateToken(token)) {
						// 3. 토큰에서 사용자 정보를 추출하여 인증 객체 생성
						Authentication authentication = jwtTokenProvider.getAuthentication(token);
						// 4. Spring Security에 인증 정보 등록 (로그인 상태로 만듬)
						SecurityContextHolder.getContext().setAuthentication(authentication);
					}
					// 토큰이 유효하지 않으면 인증 정보를 설정하지 않고 통과
				} catch (Exception e) {
					// 토큰 파싱 오류 등이 발생해도 통과 (SecurityConfig가 인증 필요 여부 결정)
					// 로그만 남기고 계속 진행
				}
			}
			// 토큰이 없거나 유효하지 않아도 다음 필터로 진행 (SecurityConfig가 인증 필요 여부 결정)
			chain.doFilter(request, response);

		} catch (Exception e) {
			// 필터 체인 실행 중 예외 발생 시에만 에러 반환
			((jakarta.servlet.http.HttpServletResponse) response).sendError(500, "Internal server error");
			return;
		}
	}

	/**
	 * HTTP 요청 헤더에서 JWT 토큰 추출
	 * 
	 * 헤더 형식: Authorization: Bearer {JWT 토큰} 예시: Authorization: Bearer
	 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
	 * 
	 * @param request HTTP 요청 객체
	 * @return JWT 토큰 문자열 (없으면 null)
	 */
	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");

		// "Bearer " 로 시작하는지 확인
		if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
			// "Bearer " 를 제외한 나머지 부분이 실제 토큰
			return bearerToken.substring(7);
		}
		return null;
	}
}