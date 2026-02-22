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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtTokenProvider jwtTokenProvider
    ) throws Exception {

        http
            // REST API → CSRF 끄기
            .csrf(csrf -> csrf.disable())

            // ⭐ WebConfig의 CORS Bean 자동 사용
            .cors(cors -> {})

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 공개 API
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

                // 필요하면 인증 적용
                .requestMatchers(
                        "/api/reservations/**",
                        "/api/payment/**",
                        "/api/reviews/**",
                        "/api/user/**"
                ).permitAll()

                .anyRequest().permitAll()
            )

            // JWT 필터
            .addFilterBefore(
                    new JwtAuthenticationFilter(jwtTokenProvider),
                    UsernamePasswordAuthenticationFilter.class
            )

            // 세션 사용 안함
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}