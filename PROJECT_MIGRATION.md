# Supabase 프로젝트 마이그레이션 가이드

## 완료된 작업
- ✅ 기존 프로젝트 (`vscthkxkohkuzknmmghu`)의 `business_cards` 테이블 삭제
- ✅ `.mcp.json` 파일 업데이트 (새 프로젝트 ID: `vjytsevajdsozlporyyn`)
- ✅ `.env` 파일의 URL 업데이트

## 다음 단계

### 1. Claude Code 재시작 (필수)
MCP 서버 연결을 새 프로젝트로 전환하려면 Claude Code를 재시작해야 합니다:

1. Claude Code 완전히 종료
2. Claude Code 다시 시작
3. 이 프로젝트 폴더로 다시 이동

### 2. 재시작 후 실행할 명령

Claude Code를 재시작한 후, 다음과 같이 요청하세요:

```
새 Supabase 프로젝트의 anon key를 가져와서 .env 파일을 업데이트하고,
business_cards 테이블을 생성해줘
```

### 3. 수동으로 진행하는 경우

Claude Code 재시작 후 다음 단계를 수행합니다:

#### Step 1: 새 프로젝트 키 가져오기
```bash
# Claude Code에서 실행
새 프로젝트의 anon key를 가져와줘
```

#### Step 2: .env 파일 업데이트
```
VITE_SUPABASE_URL=https://vjytsevajdsozlporyyn.supabase.co
VITE_SUPABASE_ANON_KEY=<실제_anon_key>
```

#### Step 3: 테이블 생성
```bash
# Claude Code에서 실행
business_cards 테이블을 생성해줘
```

#### Step 4: 개발 서버 재시작
```bash
npm run dev
```

## Supabase Dashboard 설정

새 프로젝트에서도 CORS 설정이 필요합니다:

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 새 프로젝트 선택: `vjytsevajdsozlporyyn`
3. **Authentication → URL Configuration**
   - Site URL: `http://localhost:5177`
   - Redirect URLs: `http://localhost:5177/**`
4. **Authentication → Providers → Email**
   - Enable Email provider 체크
   - Confirm email 비활성화 (개발용)
5. 저장

## 문제 해결

### MCP 연결이 안 되는 경우
- Claude Code를 완전히 재시작했는지 확인
- `.mcp.json` 파일의 project_ref가 올바른지 확인

### 환경 변수가 로드되지 않는 경우
- 개발 서버 재시작 (Ctrl+C 후 `npm run dev`)
- 브라우저 캐시 삭제 및 하드 리프레시

### 테이블이 보이지 않는 경우
- Supabase Dashboard에서 수동으로 확인
- 마이그레이션이 성공적으로 실행되었는지 확인
