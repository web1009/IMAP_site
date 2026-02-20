# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Gradle wrapper + 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle* ./

# 소스 제외하고 의존성만 먼저 다운로드 (캐시 활용)
RUN ./gradlew dependencies --no-daemon || true

# 소스 복사 후 빌드
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 빌드된 jar 복사
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8020

ENTRYPOINT ["java", "-jar", "app.jar"]
