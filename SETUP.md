# 설정 가이드

## "Failed to fetch" 에러 해결 방법

### 1. 브라우저 콘솔 확인
브라우저의 개발자 도구를 열고(F12 또는 Cmd+Option+I) 콘솔 탭을 확인하세요:
- `Supabase URL:` 로그가 올바른 URL을 표시하는지 확인
- `Supabase Key exists:` 로그가 `true`를 표시하는지 확인

### 2. 개발 서버 재시작
환경 변수를 추가한 후에는 반드시 개발 서버를 재시작해야 합니다:
```bash
# 기존 서버 중지 (Ctrl+C)
# 다시 시작
npm run dev
```

### 3. Supabase 이메일 확인 비활성화 (개발용)

Supabase는 기본적으로 이메일 확인을 요구합니다. 개발 중에는 다음 방법으로 비활성화할 수 있습니다:

**방법 1: Supabase Dashboard 설정**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. Authentication → Providers → Email
4. "Confirm email" 옵션 **비활성화**

**방법 2: 이메일 확인 없이 회원가입 설정**
```sql
-- Supabase SQL Editor에서 실행
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
```

### 4. 네트워크 연결 확인

브라우저 개발자 도구의 Network 탭에서:
- Supabase API로의 요청이 실제로 전송되는지 확인
- 요청 실패 시 상태 코드와 응답 확인
- CORS 에러가 있는지 확인

### 5. 환경 변수 확인

`.env` 파일이 프로젝트 루트에 있는지 확인:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**중요**:
- 환경 변수 이름은 반드시 `VITE_`로 시작해야 Vite에서 로드됩니다
- `.env` 파일 수정 후에는 개발 서버 재시작 필수

### 6. Supabase 프로젝트 상태 확인

Supabase Dashboard에서:
- 프로젝트가 활성화되어 있는지 확인
- 프로젝트 URL과 키가 올바른지 확인
- API 설정에서 접근이 허용되어 있는지 확인

## 추가 디버깅 정보

콘솔에 출력되는 로그:
```
Supabase URL: https://vscthkxkohkuzknmmghu.supabase.co
Supabase Key exists: true
Attempting signup with: user@example.com
Signup response: { data, error }
```

에러가 계속 발생하면 콘솔 로그를 확인하고 구체적인 에러 메시지를 찾으세요.
