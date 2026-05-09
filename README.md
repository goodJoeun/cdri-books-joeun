# Certicos Books

Kakao Book Search API를 활용한 도서 검색 및 위시리스트 앱입니다.

## 기술 스택

- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **스타일**: Tailwind CSS
- **데이터 페칭**: TanStack React Query + Axios
- **인-메모리 DB**: better-sqlite3 (`:memory:` 모드) — 서버 재시작 시 초기화

## 시작하기

### 사전 요구 사항

- Node.js 18 이상
- npm 9 이상

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
REST_API_KEY=<카카오 REST API 키>
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build
npm run start
```

## 인-메모리 DB (H2DB 대체)

서버사이드 데이터 저장에 `better-sqlite3`를 `:memory:` 모드로 사용합니다.

| 항목 | 설명 |
|------|------|
| 저장 방식 | 서버 프로세스 메모리 내 SQLite |
| 초기화 시점 | 서버(Next.js) 재시작 시 |
| 개발 HMR | 핫 리로드 간 데이터 유지 (`global.__db` 싱글턴) |

### API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/search-history` | 검색 기록 조회 |
| POST | `/api/search-history` | 검색어 추가 |
| DELETE | `/api/search-history` | 전체 삭제 |
| DELETE | `/api/search-history/[term]` | 특정 검색어 삭제 |
| GET | `/api/wishlist` | 위시리스트 조회 |
| POST | `/api/wishlist` | 위시리스트 토글 (추가/삭제) |
| DELETE | `/api/wishlist/[isbn]` | 특정 도서 삭제 |

### 인증 토큰

`axios` 인터셉터가 `token` 쿠키에서 Bearer 토큰을 자동으로 읽어 요청 헤더에 추가합니다.

```js
// 로그인 후 토큰 설정 예시
document.cookie = `token=<your-token>; path=/; SameSite=Lax`;
```

## 코드 포맷

```bash
npm run format
```
