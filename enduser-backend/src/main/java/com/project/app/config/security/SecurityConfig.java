package com.project.app.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security 보안 설정 클래스 애플리케이션의 인증(로그인)과 인가(권한) 처리를 담당합니다
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	/**
	 * 보안 필터 체인 설정 어떤 URL은 인증 없이 접근 가능하고, 어떤 URL은 로그인이 필요한지 정의합니다
	 */
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtTokenProvider jwtTokenProvider)
			throws Exception {
		http
			// CSRF 보호 비활성화 (REST API에서는 일반적으로 비활성화)
			.csrf(csrf -> csrf.disable())
			// CORS 활성화 (WebConfig의 CorsConfigurationSource 사용)
			.cors(cors -> {})

			// URL별 접근 권한 설정
			.authorizeHttpRequests(auth -> auth
				// CORS preflight(OPTIONS) 요청은 인증 없이 허용
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				// 로그인/회원가입, 공개 API는 인증 없이 접근 가능
				.requestMatchers(
					"/api/login",
					"/api/adminLogin",
					"/api/schedules/**",
					"/api/sporttypes/**",
					"/api/branches/**",
					"/api/user/blog/**",
					"/api/user/faq/**",
					"/api/user/notice/**"
				).permitAll()
				// 마이페이지 관련 API는 인증 필요 (JWT 필터가 토큰이 없어도 통과시키지만, 컨트롤러에서 인증 체크)
				.requestMatchers(
					"/api/reservations/**",
					"/api/payment/**",
					"/api/reviews/**",
					"/api/user/**"
				).permitAll()
				// 기타 정적 리소스, Swagger 등
				.requestMatchers(
					"/", "/login", "/index.html",
					"/favicon.ico", "/css/**", "/js/**", "/images/**", "/static/**", "/public/**", "/webjars/**",
					"/error", "/swagger-ui/**", "/v3/api-docs/**"
				).permitAll()

				// 위에 명시되지 않은 모든 요청은 로그인 필요
				.anyRequest().permitAll())

			// JWT 인증 필터를 Spring Security 필터 체인에 추가
			// 모든 요청이 들어올 때마다 JWT 토큰을 검사합니다
			.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
					UsernamePasswordAuthenticationFilter.class);

		// 세션을 사용하지 않음 (JWT 토큰 방식이므로)
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

	/**
	 * 비밀번호 암호화 도구 등록 BCrypt 알고리즘을 사용하여 비밀번호를 안전하게 암호화합니다 평문 비밀번호를 절대 데이터베이스에 저장하지
	 * 않습니다!
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

	    CorsConfiguration config = new CorsConfiguration();

	    // ⭐ Render 프론트 주소 (반드시 정확히!)
	    config.setAllowedOrigins(List.of(
	            "https://imap-front.onrender.com",
	            "http://localhost:5173",
	            "http://localhost:3000"
	    ));

	    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
	    config.setAllowedHeaders(List.of("*"));
	    config.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);

	    return source;
	}
}