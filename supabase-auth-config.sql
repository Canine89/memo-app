-- Supabase Auth 사용자 상태 확인
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. 이메일 확인이 필요한 사용자들 확인
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;

-- 2. 최근 가입한 사용자들의 상태 확인
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

-- 3. 모든 사용자 목록 (최근 20명)
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 20;
