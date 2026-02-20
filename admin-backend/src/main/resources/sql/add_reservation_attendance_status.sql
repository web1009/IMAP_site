-- reservation 테이블에 출석 상태 컬럼 추가 (이용권 없이 예약한 건의 출석 저장용)
-- 실행: mysql -u root -p DB명 < add_reservation_attendance_status.sql
-- 이미 컬럼이 있으면 "Duplicate column" 에러 발생 → 무시해도 됨
-- ※ reservation 테이블에 user_pass_id 컬럼이 있어야 AttendanceMapper 동작 (enduser 스키마 기준)

ALTER TABLE reservation
ADD COLUMN attendance_status VARCHAR(20) NULL DEFAULT 'UNCHECKED'
COMMENT '출석상태(ATTENDED,ABSENT,UNCHECKED)';
