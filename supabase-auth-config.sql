-- Supabase Auth 설정 업데이트
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. 현재 Auth 설정 확인
SELECT 
  key,
  value
FROM auth.config
WHERE key IN ('SITE_URL', 'REDIRECT_URLS', 'ENABLE_EMAIL_CONFIRMATIONS');

-- 2. 이메일 확인이 필요한 사용자들 확인
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;

-- 3. 최근 가입한 사용자들의 상태 확인
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '이메일 미확인'
    WHEN last_sign_in_at IS NULL THEN '이메일 확인됨, 로그인 안함'
    ELSE '정상 로그인됨'
  END as status
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
