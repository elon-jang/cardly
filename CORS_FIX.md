# CORS 에러 해결 가이드

## 문제 상황
브라우저 콘솔에 다음과 같은 에러가 표시됩니다:
```
CORS error
Failed to fetch
```

## 해결 방법

### 1. Supabase Dashboard 설정 (필수)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택: `vscthkxkohkuzknmmghu`

2. **Authentication → URL Configuration**
   - **Site URL** 설정:
     ```
     http://localhost:5177
     ```

   - **Redirect URLs** 추가:
     ```
     http://localhost:5177
     http://localhost:5177/**
     ```

3. **Authentication → Providers → Email**
   - **Enable Email provider** 체크 확인
   - **Confirm email** 옵션을 **비활성화** (개발 중)
   - 저장

4. **프로젝트 설정 확인**
   - Settings → API
   - Project URL이 `https://vscthkxkohkuzknmmghu.supabase.co`인지 확인
   - anon/public key가 올바른지 확인

### 2. 개발 서버 포트 고정 (권장)

현재 서버가 포트 5177에서 실행 중이므로, vite.config.js에 포트를 고정하는 것이 좋습니다:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177
  }
})
```

### 3. 브라우저 재시작

설정 변경 후:
1. 브라우저의 모든 탭 닫기
2. 개발 서버 재시작 (Ctrl+C 후 `npm run dev`)
3. 브라우저 재시작
4. http://localhost:5177 접속

### 4. 확인 사항

브라우저 콘솔에서 다음 정보 확인:
```
Supabase URL: https://vscthkxkohkuzknmmghu.supabase.co
Supabase Key exists: true
```

## 대체 방법: 이메일 확인 없이 테스트

회원가입 시 이메일 확인 없이 바로 사용하려면:

1. **Supabase Dashboard → Authentication → Providers → Email**
2. **Confirm email** 체크박스 **비활성화**
3. 저장

또는 SQL Editor에서 실행:
```sql
-- 기존 사용자의 이메일 확인 상태를 자동으로 설정
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

## 여전히 문제가 있다면

1. **프로젝트 상태 확인**
   - Supabase Dashboard에서 프로젝트가 "Active" 상태인지 확인
   - 일시 중지된 경우 재개

2. **API 키 재생성**
   - Settings → API → Reset anon key
   - 새 키를 `.env` 파일에 업데이트
   - 개발 서버 재시작

3. **로그 확인**
   - Supabase Dashboard → Logs → Auth
   - 실패한 요청의 상세 정보 확인
