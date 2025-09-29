-- Supabase 사용자 동기화 설정
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. 사용자 생성 시 자동으로 public.users에도 생성하는 함수
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, "createdAt", "updatedAt")
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    "updatedAt" = NOW();
  RETURN NEW;
END;
$$;

-- 2. 트리거 생성 (auth.users와 public.users 동기화)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. 기존 auth.users의 사용자들을 public.users에 동기화
INSERT INTO public.users (id, email, name, "createdAt", "updatedAt")
SELECT 
  u.id::text,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', u.email),
  u.created_at,
  u.updated_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.users p WHERE p.id = u.id::text
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  "updatedAt" = NOW();

-- 4. 동기화 결과 확인
SELECT 
  'auth.users' as table_name,
  COUNT(*) as user_count
FROM auth.users
UNION ALL
SELECT 
  'public.users' as table_name,
  COUNT(*) as user_count
FROM public.users;
