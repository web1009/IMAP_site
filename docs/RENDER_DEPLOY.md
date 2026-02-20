# Render 배포 가이드 (enduser-backend + enduser-frontend)

같은 저장소(IMAP_site)에서 **백엔드**와 **프론트엔드**를 **서로 다른 서비스 2개**로 배포합니다.

---

## 1. 빌드 오류 수정 (백엔드 Dockerfile)

`./gradlew: Permission denied` 가 나면 Dockerfile에서 `gradlew` 에 실행 권한을 줍니다.

- **이미 반영됨**: `RUN chmod +x gradlew` 가 Dockerfile에 추가되어 있음.
- 수정 후 **커밋 & 푸시** 한 번 해주세요.

```bash
git add enduser-backend/Dockerfile
git commit -m "Fix gradlew permission in Dockerfile"
git push
```

---

## 2. Render에서 만드는 서비스 (총 2개)

| 서비스 | 타입 | Root Directory | 설명 |
|--------|------|----------------|------|
| enduser-backend | **Web Service** (Docker) | `enduser-backend` | API 서버 |
| enduser-frontend | **Static Site** | `enduser-frontend` | React 빌드 결과 배포 |

---

## 3. 서비스 1: enduser-backend (Web Service)

1. **New +** → **Web Service**
2. 저장소: **web1009/IMAP_site** 선택
3. 설정:
   - **Name**: `enduser-backend`
   - **Region**: Singapore (또는 원하는 지역)
   - **Branch**: `main`
   - **Root Directory**: `enduser-backend`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `Dockerfile` (비워두거나 기본값)
4. **Environment** 탭에서 변수 추가 (예시):
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `SPRING_DATASOURCE_URL` = DB URL
   - `SPRING_DATASOURCE_USERNAME` = DB 사용자
   - `SPRING_DATASOURCE_PASSWORD` = DB 비밀번호
   - `SPRING_DATASOURCE_DRIVER_CLASS_NAME` = `org.mariadb.jdbc.Driver` (MariaDB 사용 시)
   - `JWT_SECRET` = 시크릿 값
   - `MY_CORS_ALLOWED_ORIGINS` = `https://enduser-frontend.onrender.com` (아래 4번에서 나온 프론트 URL로 변경)
5. **Create Web Service** → 배포 완료 후 **서비스 URL** 확인 (예: `https://enduser-backend.onrender.com`)

---

## 4. 서비스 2: enduser-frontend (Static Site)

1. **New +** → **Static Site**
2. 저장소: **web1009/IMAP_site** 선택
3. 설정:
   - **Name**: `enduser-frontend`
   - **Branch**: `main`
   - **Root Directory**: `enduser-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment** 탭에서 빌드 시 사용할 변수 추가:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://enduser-backend.onrender.com`  
     (실제 백엔드 서비스 URL로 맞추기. 백엔드 먼저 배포한 뒤 URL 복사)
5. **Create Static Site** → 배포 완료 후 **사이트 URL** 확인 (예: `https://enduser-frontend.onrender.com`)

---

## 5. CORS 설정 (백엔드)

프론트 도메인이 바뀌면 백엔드 CORS에 추가해야 합니다.

- **enduser-backend** 서비스 → **Environment**
- `MY_CORS_ALLOWED_ORIGINS` 에 프론트 URL 포함 (쉼표 구분)
  - 예: `https://enduser-frontend.onrender.com,http://localhost:5173`
- 저장 후 자동 재배포됨

---

## 6. 순서 요약

1. **Dockerfile** 수정 반영 후 `git push`
2. Render에서 **enduser-backend** Web Service 생성 및 배포 → URL 확인
3. Render에서 **enduser-frontend** Static Site 생성 시  
   `VITE_API_BASE_URL` = 백엔드 URL 로 설정 후 배포
4. 백엔드 **MY_CORS_ALLOWED_ORIGINS** 에 프론트 URL 추가

이렇게 하면 backend / frontend 가 나뉘어서 Render에 배포됩니다.
