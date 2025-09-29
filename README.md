# 메모 앱

Next.js 기반의 간단하고 빠른 메모 관리 앱입니다.

## 기능

- ✅ 사용자 인증 (회원가입, 로그인, 로그아웃)
- ✅ 메모 CRUD (생성, 조회, 수정, 삭제)
- ✅ 반응형 디자인
- ✅ 다크 모드 지원
- ✅ Supabase (PostgreSQL) 데이터베이스
- ✅ Prisma ORM

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Custom (bcryptjs)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일이 이미 생성되어 있습니다:

```env
DATABASE_URL="postgresql://postgres.civpgvwknaknsvsmielw:!memoapp0701@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_SUPABASE_URL="https://civpgvwknaknsvsmielw.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpdnBndndrbmFrbnN2c21pZWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNDc4OTksImV4cCI6MjA3NDcyMzg5OX0.oIRdnI6Tk4fBEfl_CIyvSQ8pPRWO-MEYLbyBoc0PJ_Q"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpdnBndndrbmFrbnN2c21pZWx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE0Nzg5OSwiZXhwIjoyMDc0NzIzODk5fQ.7Thg9u__7BbpzKVOie3EHWN_j4oNeXF9Eg4PD2o1CV0"
```

### 3. 데이터베이스 설정

```bash
npx prisma generate
npx prisma db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

## Supabase 마이그레이션

이 프로젝트는 원래 SQLite를 사용했지만, 현재는 Supabase (PostgreSQL)를 사용합니다.

### 마이그레이션된 데이터
- **사용자**: 2명 (기존 SQLite에서 마이그레이션됨)
- **메모**: 1개 (기존 SQLite에서 마이그레이션됨)

### 마이그레이션 스크립트
기존 SQLite 데이터를 Supabase로 마이그레이션하는 스크립트가 포함되어 있습니다:

```bash
# 데이터베이스 연결 테스트
node scripts/test-supabase-connection.js

# API 엔드포인트 테스트
node scripts/test-api.js
```

## 사용법

1. **회원가입**: 처음 방문 시 회원가입 페이지에서 계정을 만드세요.
2. **로그인**: 이메일과 비밀번호로 로그인하세요.
3. **메모 작성**: "새 메모" 버튼을 클릭하여 메모를 작성하세요.
4. **메모 수정**: 메모 카드의 편집 버튼을 클릭하여 수정하세요.
5. **메모 삭제**: 메모 카드의 삭제 버튼을 클릭하여 삭제하세요.

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── register/route.ts
│   │   └── memos/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── auth/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── auth-form.tsx
│   ├── memo-app.tsx
│   ├── memo-form.tsx
│   └── memo-list.tsx
└── lib/
    ├── auth.ts
    ├── auth-utils.ts
    ├── prisma.ts
    └── utils.ts
```

## 데이터베이스 스키마

### User
- `id`: 고유 식별자
- `email`: 이메일 (고유)
- `password`: 해시된 비밀번호
- `name`: 사용자 이름 (선택사항)
- `createdAt`: 생성일시
- `updatedAt`: 수정일시

### Memo
- `id`: 고유 식별자
- `title`: 메모 제목
- `content`: 메모 내용
- `userId`: 사용자 ID (외래키)
- `createdAt`: 생성일시
- `updatedAt`: 수정일시

## 라이선스

MIT License