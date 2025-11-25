# DESIGN.md

Cardly 비즈니스 카드 제너레이터의 디자인 시스템 문서입니다.

## 디자인 철학

Cardly는 **모던하고 직관적인 사용자 경험**을 목표로 합니다. 다크 테마를 기본으로 하며, 글래스모피즘(Glassmorphism)과 네온 효과를 활용한 현대적인 UI를 제공합니다.

## 색상 시스템 (Color System)

### 전역 테마 (Global Theme)

#### Dark Theme (Midnight - 기본)
```css
--primary: #667eea            /* 메인 보라색 */
--primary-hover: #5a67d8      /* 호버 상태 */
--accent: #f093fb             /* 강조색 (핑크) */
--accent-secondary: #4facfe   /* 보조 강조색 (청록) */
--background: #0a0e27         /* 배경색 */
--surface: #1a1f3a            /* 카드 표면색 */
--text: #f8fafc               /* 기본 텍스트 */
--text-secondary: #94a3b8     /* 보조 텍스트 */
```

#### Light Theme
```css
--primary: #4f46e5
--accent: #ec4899
--background: #f8fafc
--surface: #ffffff
--text: #0f172a
--text-secondary: #64748b
```

#### Nature Theme
```css
--primary: #4d7c0f            /* 자연 그린 */
--accent: #d97706             /* 오렌지 강조 */
--background: #fdfbf7         /* 따뜻한 화이트 */
--text: #292524
```

### 비즈니스 카드 테마 (Business Card Theme)

사용자가 생성하는 명함에 적용되는 6가지 테마:

| 테마 | 배경색 | 텍스트색 | 용도 |
|------|--------|---------|------|
| Light | `#f8fafc` | `#1e293b` | 깔끔하고 현대적인 느낌 |
| Dark | `#0f172a` | `#f8fafc` | 프로페셔널하고 고급스러움 |
| Cream | `#fdfbf7` | `#4a4a4a` | 따뜻하고 편안한 느낌 |
| Navy | `#1e3a8a` | `#f8fafc` | 신뢰감 있고 전통적 |
| Pastel | `linear-gradient(120deg, #fdf2f8, #fff1f2)` | `#881337` | 부드럽고 여성스러움 |
| Earth | `#f5f5f4` | `#44403c` | 자연스럽고 친환경적 |

## 레이아웃 시스템 (Layout System)

### 명함 기본 규격
- **크기**: 600px × 350px
- **비율**: 표준 명함 비율 (약 1.7:1)
- **출력 포맷**: PNG, PDF (A4 가로)

### 6가지 레이아웃 스타일

#### 1. Standard (Modern Standard)
```css
.layout-standard {
  /* 좌측: 이미지 (220px) */
  /* 우측: 텍스트 정보 */
  /* 구분선: border-right */
}
```
- **특징**: 가장 전통적이고 안정적인 구조
- **용도**: 프로페셔널, 기업용

#### 2. Bold (Bold Modern)
```css
.layout-bold {
  /* 50:50 분할 */
  /* 강렬한 타이포그래피 */
  /* 대문자 이름, 굵은 테두리 */
}
```
- **특징**: 강렬하고 현대적, 대담한 폰트
- **용도**: 크리에이티브 산업, 아티스트

#### 3. Geometric (Geometric Shapes)
```css
.layout-geometric {
  /* 이미지 영역: clip-path로 각도 있는 컷 */
  /* 우측 텍스트 정렬 */
  /* 기하학적 장식 요소 (삼각형, 원) */
}
```
- **특징**: 각진 이미지 영역, 기하학 도형 배경
- **용도**: 건축, 디자인, 테크 분야

#### 4. Elegant (Classic Elegant)
```css
.layout-elegant {
  /* 중앙 정렬 텍스트 */
  /* 세리프 폰트 (Playfair Display) */
  /* 원형/타원형 이미지 */
  /* 테두리 장식 */
}
```
- **특징**: 고급스럽고 우아한 세리프 폰트, 중앙 정렬
- **용도**: 변호사, 의사, 고급 서비스

#### 5. Creative (Artistic Creative)
```css
.layout-creative {
  /* 그라디언트 배경 */
  /* 글래스모피즘 카드 */
  /* 원형 장식 요소 */
}
```
- **특징**: 화려한 배경 그라디언트, 반투명 효과
- **용도**: 예술가, 디자이너, 크리에이티브

#### 6. Organic (Soft Organic)
```css
.layout-organic {
  /* 비정형 이미지 (blob 형태) */
  /* 손글씨 폰트 (Caveat) */
  /* 부드러운 색상 blob 배경 */
}
```
- **특징**: 자유로운 형태, 손글씨 느낌, 유기적 곡선
- **용도**: 요가, 웰니스, 예술치료

## 타이포그래피 (Typography)

### 폰트 패밀리

```css
/* 기본 UI 폰트 */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;

/* 레이아웃별 전용 폰트 */
'Playfair Display', serif    /* Elegant - 세리프 고급 */
'Caveat', cursive            /* Organic - 손글씨 */
'Outfit', sans-serif         /* Geometric - 기하학적 */
'Quicksand', sans-serif      /* Organic - 부드러움 */
'Lato', sans-serif           /* Elegant - 보조 폰트 */
```

### 폰트 크기

```css
/* 명함 내부 */
.card-name: 2rem (32px)       /* 기본 이름 */
.card-title: 1rem (16px)      /* 직업/직함 */
.card-details: 0.9rem (14.4px) /* 연락처 정보 */

/* Elegant 레이아웃 */
.card-name: 2.25rem (36px)
.card-title: 0.85rem (13.6px) /* 대문자, 넓은 자간 */

/* Bold 레이아웃 */
.card-name: 2.5rem (40px)     /* 대문자 전용 */

/* Organic 레이아웃 */
.card-name: 3rem (48px)       /* 손글씨 스타일 */
```

### 폰트 웨이트
- **이름**: 800 (Extra Bold) 기본, Elegant는 700
- **직함**: 500 (Medium)
- **연락처**: 400 (Regular)

## 컴포넌트 스타일 (Component Styles)

### 버튼 (Buttons)

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  border-radius: 10px;
  /* 호버 시 위로 2px 이동 */
}
```

#### Outline Button
```css
.btn-outline {
  background: rgba(26, 31, 58, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  /* 호버 시 보라색 배경 */
}
```

### 카드 (Cards)

```css
.card {
  background: rgba(26, 31, 58, 0.8);
  backdrop-filter: blur(20px);      /* 글래스모피즘 */
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  /* 호버 시 위로 2px, 테두리 밝아짐 */
}
```

### 폼 입력 (Form Inputs)

```css
.form-input {
  background-color: #020617;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
  /* 포커스 시 보라색 테두리 + 글로우 */
}
```

### 탭 네비게이션 (Tab Navigation)

```css
.tab-nav {
  background: var(--surface);
  border-radius: 12px;
  padding: 0.35rem;
  /* 활성 탭: 보라색 배경 + 그림자 */
}
```

## 이미지 그라디언트 시스템

사용자가 이미지에 부드러운 페이드 효과를 적용할 수 있는 기능:

```css
/* 직사각형 레이아웃 (Standard, Bold) */
.layout-standard .card-image-section.has-gradient {
  mask-image: linear-gradient(to right, black 90%, transparent 100%);
}

/* 비정형 레이아웃 (Organic, Elegant, Creative, Geometric) */
.layout-organic .card-image-section.has-gradient {
  mask-image: radial-gradient(circle, black 80%, transparent 100%);
}
```

**효과**: 이미지가 텍스트 영역으로 자연스럽게 페이드되어 가독성 향상

## 애니메이션 (Animations)

### 기본 페이드인
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* 메인 레이아웃 진입 시 0.4s */
```

### 버튼 ripple 효과
```css
.btn::before {
  /* 호버 시 중앙에서 퍼지는 원형 ripple */
  transition: width 0.6s, height 0.6s;
}
```

### Saved Cards 호버
```css
.saved-card-item:hover {
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.5);
  /* 하단 액션 버튼 슬라이드 업 */
}
```

## 반응형 디자인 (Responsive Design)

### 브레이크포인트

```css
/* 데스크톱 (1024px+) */
@media (min-width: 1024px) {
  .main-layout {
    grid-template-columns: 400px 1fr; /* 좌측 폼, 우측 프리뷰 */
  }
}

/* 모바일 (650px 미만) */
@media (max-width: 650px) {
  .scale-container {
    transform: scale(calc((100vw - 4rem) / 600));
    /* 명함이 화면 너비에 맞게 축소 */
  }
}

/* 탭 텍스트 숨김 (640px 미만) */
@media (max-width: 640px) {
  .tab-btn span { display: none; } /* 아이콘만 표시 */
}
```

### 명함 스케일링 전략

- **데스크톱**: 600×350px 원본 크기
- **모바일**: `transform: scale()` 사용하여 동적 축소
- **Saved Cards 그리드**: `scale(0.75)` 고정 비율

## 접근성 (Accessibility)

### 포커스 상태
```css
.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); /* 키보드 포커스 표시 */
}
```

### 색상 대비
- **다크 테마**: 흰색 텍스트 (#f8fafc) on 다크 배경 (#0a0e27)
- **라이트 테마**: 다크 텍스트 (#0f172a) on 라이트 배경 (#f8fafc)
- **WCAG AA 준수**: 모든 텍스트 4.5:1 이상 대비

### 터치 타겟
- **최소 크기**: 44×44px (모바일 터치 영역)
- **버튼 패딩**: 0.75rem × 1.5rem (12px × 24px)

## Toast 알림 시스템

### 타입별 스타일

```css
/* Success */
.toast-success {
  border-left: 5px solid #16a34a;
  background: #f0fdf4;
}

/* Error */
.toast-error {
  border-left: 5px solid #dc2626;
  background: #fef2f2;
}

/* Info */
.toast-info {
  border-left: 5px solid #2563eb;
  background: #eff6ff;
}
```

### 위치 및 애니메이션
- **위치**: 우측 상단 (top: 20px, right: 20px)
- **진입**: `slideIn` 0.3s (우측에서 슬라이드)
- **자동 사라짐**: 3초 후

## 글래스모피즘 효과 (Glassmorphism)

Cardly의 핵심 디자인 언어:

```css
.card {
  background: rgba(26, 31, 58, 0.8);         /* 반투명 배경 */
  backdrop-filter: blur(20px);               /* 배경 블러 */
  -webkit-backdrop-filter: blur(20px);       /* Safari 지원 */
  border: 1px solid rgba(102, 126, 234, 0.2); /* 반투명 테두리 */
}
```

## 이미지 그리드 (Image Selector)

```css
.image-grid {
  grid-template-columns: repeat(5, 1fr); /* 5열 그리드 */
  max-height: 400px;                     /* 4행 표시 */
  overflow-y: auto;                      /* 스크롤 */
}

.image-option {
  aspect-ratio: 1;                       /* 정사각형 유지 */
  border-radius: 8px;
  opacity: 0.7;                          /* 비선택 상태 */
}

.image-option.selected {
  opacity: 1;
  border: 2px solid var(--primary);      /* 선택 표시 */
}
```

## 내보내기 디자인 (Export Design)

### PNG 출력
- **해상도**: 600×350px (원본 크기)
- **품질**: 최고 품질 (`toPng` 라이브러리)

### PDF 출력
- **페이지**: A4 가로 (297×210mm)
- **명함 크기**: 전체 페이지 채움
- **포맷**: `jsPDF` 라이브러리

## 디자인 토큰 정리

```css
/* Spacing */
--spacing-xs: 0.25rem   (4px)
--spacing-sm: 0.5rem    (8px)
--spacing-md: 1rem      (16px)
--spacing-lg: 1.5rem    (24px)
--spacing-xl: 2rem      (32px)

/* Border Radius */
--radius-sm: 8px        /* 입력 필드, 작은 요소 */
--radius-md: 12px       /* 탭, 중간 카드 */
--radius-lg: 16px       /* 메인 카드 */

/* Shadows */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.15)
--shadow: 0 8px 24px rgba(0,0,0,0.25)
--shadow-lg: 0 20px 40px rgba(0,0,0,0.4)

/* Z-Index */
.container: 1               /* 메인 콘텐츠 */
.card-content: 10           /* 명함 텍스트 */
.geometric-shapes: 10-20    /* 장식 요소 */
.toast-container: 9999      /* 최상위 알림 */
```

## 디자인 패턴 모범 사례

### 새 테마 추가하기
1. `CardForm.jsx`에 `<option>` 추가
2. `index.css`에 `.theme-{name}` 클래스 생성
3. 색상 변수만 오버라이드 (구조는 유지)

```css
.business-card.theme-new {
  background: #색상;
  color: #텍스트색;
}
```

### 새 레이아웃 추가하기
1. `CardForm.jsx`에 `<option>` 추가
2. `index.css`에 `.layout-{name}` 클래스 생성
3. 필요시 `CardPreview.jsx`에 장식 요소 추가

```jsx
{layout === 'new' && <div className="deco-element" />}
```

### 새 장식 요소 추가하기
```css
.layout-creative .deco-circle {
  position: absolute;           /* 절대 위치 */
  border-radius: 50%;           /* 원형 */
  background: rgba(255,255,255,0.1);  /* 반투명 */
  z-index: 5;                   /* 텍스트 뒤에 */
}
```

## 성능 최적화

### CSS 최적화
- **Transform 사용**: `translateY()` 대신 `transform`으로 GPU 가속
- **Will-change 회피**: 과도한 사용 방지
- **Backdrop-filter 제한**: 글래스모피즘은 주요 카드에만 적용

### 이미지 최적화
- **Unsplash 파라미터**: `?w=800&q=80` (800px, 80% 품질)
- **Base64 저장**: 커스텀 이미지는 Supabase에 base64 저장
- **중복 방지**: 이미지 해시 비교로 중복 업로드 차단

### 애니메이션 성능
```css
.card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* cubic-bezier로 부드러운 easing */
}
```

## 브랜드 아이덴티티

### 로고 및 타이틀
```css
.header h1 {
  background: linear-gradient(to right, #818cf8, #c084fc);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  /* 그라디언트 텍스트 효과 */
}
```

### 컬러 팔레트 철학
- **보라/핑크 그라디언트**: 창의성과 혁신
- **다크 베이스**: 현대적이고 고급스러움
- **네온 강조**: 에너지와 활기

---

**마지막 업데이트**: 2025-11-25
**버전**: 1.0.0
**담당자**: Cardly Design Team
