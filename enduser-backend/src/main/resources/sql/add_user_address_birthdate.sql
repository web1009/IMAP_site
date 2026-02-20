-- USERS 테이블에 주소, 생년월일 컬럼 추가
-- 실행: mysql -u root -p DB명 < add_user_address_birthdate.sql

ALTER TABLE USERS
ADD COLUMN address VARCHAR(255) NULL AFTER phone_number,
ADD COLUMN birth_date DATE NULL AFTER address;
