# CERTICOS BOOKS

Kakao Book Search API를 활용한 도서 검색 및 위시리스트 웹 앱입니다.

---

## 프로젝트 개요

키워드로 책을 검색하고, 마음에 드는 책을 찜 목록에 저장할 수 있는 서비스입니다.

제목 검색뿐 아니라 저자명, 출판사로도 검색할 수 있고, 검색 결과는 무한 스크롤로 이어집니다. 찜한 책은 별도 페이지에서 확인할 수 있으며, 서버(better-sqlite3 인-메모리 DB)에 저장되어 새로고침 후에도 유지됩니다.

**주요 기능 요약**

- 도서 검색 (제목 / 저자 / 출판사)
- 최근 검색어 기록 및 관리
- 무한 스크롤 결과 목록
- 도서 상세 정보 확인 및 구매 링크
- 찜하기(위시리스트) 추가/삭제

---

## 실행 방법 및 환경 설정

### 요구 사항

- Node.js 18 이상
- npm 9 이상
- 카카오 개발자 계정 및 REST API 키 ([카카오 Developers](https://developers.kakao.com) 에서 발급)

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
REST_API_KEY=<카카오 REST API 키>
```

`.env.example`을 참고해 파일을 만들면 됩니다.

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드 및 실행
npm run build
npm run start
```

> 검색 이력과 위시리스트는 인-메모리 SQLite(`better-sqlite3 :memory:`)에 저장되기 때문에 **서버를 재시작하면 초기화**됩니다.

---

## 폴더 구조 및 주요 코드 설명

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # Route Handler (서버)
│   │   ├── books/search/       # Kakao API 프록시
│   │   ├── search-history/     # 검색 이력 CRUD
│   │   └── wishlist/           # 위시리스트 CRUD
│   ├── wishlist/               # 찜한 책 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈(검색) 페이지
│   ├── providers.tsx           # React Query Provider
│   └── globals.css             # Tailwind 테마 설정
├── components/
│   ├── book/                   # 도서 카드 관련 컴포넌트
│   ├── layout/                 # Header
│   ├── search/                 # 검색창, 결과 목록, 팝업
│   └── ui/                     # 재사용 원자 컴포넌트
├── hooks/                      # 커스텀 훅
├── lib/                        # axios, db, cn 유틸리티
├── resource/                   # 문자열 상수
└── types/                      # TypeScript 타입 정의
```

### 핵심 파일

| 파일                                        | 역할                                                     |
| ------------------------------------------- | -------------------------------------------------------- |
| `app/page.tsx`                              | 홈 페이지 (서버 컴포넌트, searchParams로 검색 상태 수신) |
| `components/search/SearchBar.tsx`           | 검색창, 이력 드롭다운, 상세검색 팝업 통합                |
| `components/search/InfiniteBookResults.tsx` | 무한 스크롤 결과 목록                                    |
| `components/book/BookCard.tsx`              | 도서 카드 (축약/확장 모드)                               |
| `hooks/useInfiniteBookSearch.ts`            | React Query 무한 페이지 훅                               |
| `lib/db.ts`                                 | 인-메모리 SQLite 싱글턴                                  |
| `lib/cn.ts`                                 | clsx + tailwind-merge 유틸리티                           |

### API 엔드포인트

| Method | Path                         | 설명                                  |
| ------ | ---------------------------- | ------------------------------------- |
| GET    | `/api/books/search`          | Kakao 도서 검색 (query, page, target) |
| GET    | `/api/search-history`        | 검색 이력 조회 (최대 8개)             |
| POST   | `/api/search-history`        | 검색어 추가                           |
| DELETE | `/api/search-history`        | 전체 삭제                             |
| DELETE | `/api/search-history/[term]` | 특정 검색어 삭제                      |
| GET    | `/api/wishlist`              | 위시리스트 전체 조회                  |
| POST   | `/api/wishlist`              | 위시리스트 토글 (추가/삭제)           |

---

## 라이브러리 선택 이유

### Next.js (App Router)

페이지 단위로 서버/클라이언트 컴포넌트를 분리할 수 있다는 점이 결정적이었습니다. 홈 페이지에서 URL의 `searchParams`를 읽어 초기 검색 상태를 렌더링하는 부분을 서버 컴포넌트로 처리해 클라이언트 번들 크기를 줄일 수 있었고, 별도 백엔드 없이 Route Handler로 API를 구성할 수 있어 프로젝트 구조도 단순하게 유지됐습니다.

### TanStack React Query

비동기 상태를 직접 관리하면 로딩/에러/캐싱 로직이 각 컴포넌트에 흩어지게 됩니다. React Query를 쓰면 그 부분을 훅 하나에 집약할 수 있고, `useInfiniteQuery`가 무한 스크롤에 필요한 페이지 누적과 다음 페이지 파라미터 관리를 내부적으로 처리해줘서 구현이 훨씬 간결해졌습니다.

### Tailwind CSS + clsx + CVA + tailwind-merge

Tailwind만 쓰면 조건부 클래스가 많아질수록 className이 지저분해집니다. 이를 해결하기 위해 세 라이브러리를 조합했습니다.
(관련 경험은 [링크](https://velog.io/@josuncom/Emotion%EC%97%90%EC%84%9C-Tailwind%EB%A1%9C-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-2-%EC%9E%AC%EC%82%AC%EC%9A%A9-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A1%9C) 에서 확인할 수 있습니다.)

- **CVA**: variant별 스타일을 한 곳에 정의해서 `variant="primary"` 같은 props만 넘기면 클래스가 자동으로 적용됩니다.
- **clsx**: 조건부 클래스를 배열/객체 형태로 읽기 좋게 작성할 수 있습니다.
- **tailwind-merge**: 외부에서 클래스를 override할 때 `text-sm text-lg` 같은 충돌이 자동으로 해결됩니다.

세 가지를 `cn()` 유틸리티 하나로 묶어서 프로젝트 전체에서 통일된 방식으로 사용했습니다.

```ts
// lib/cn.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### npm

yarn이나 pnpm과 비교했을 때 별도 설정 없이 바로 쓸 수 있고, `package-lock.json`이 의존성 버전을 고정해줘서 환경 간 설치 결과가 동일하게 유지됩니다. 팀 규모가 크거나 모노레포 구조라면 pnpm의 이점이 두드러지지만, 이 프로젝트 규모에서는 npm으로 충분하다고 판단했습니다.

### Turbopack (개발) / webpack (프로덕션)

Next.js 15부터 `next dev`의 기본 번들러가 Turbopack으로 바뀌었습니다. Rust로 작성되어 HMR 속도가 webpack 대비 훨씬 빠르고, 파일을 수정했을 때 변경된 모듈만 골라서 교체하기 때문에 개발 중 체감 속도 차이가 큽니다.

프로덕션 빌드(`next build`)는 webpack을 사용합니다. 트리쉐이킹, 코드 스플리팅, 번들 최적화 등 검증된 파이프라인이 있고, Next.js 생태계 전반에서 오랫동안 안정성이 확인된 조합이라 별도 설정 없이 그대로 사용했습니다.

### better-sqlite3

검색 이력과 위시리스트 저장을 위해 별도 DB 서버 없이 인-메모리 SQLite를 사용했습니다. 설정이 거의 없고 동기 API라 Route Handler 안에서 쓰기 편합니다. HMR 시 인스턴스가 중복 생성되는 문제는 `global.__db` 싱글턴으로 해결했습니다.
해당 경험은 부족했기 때문에 AI Agent를 활용해서 구현했습니다.

---

## 강조하고 싶은 기능

### 1. App Router 기반 RSC 활용

홈 페이지(`app/page.tsx`)는 서버 컴포넌트입니다. URL의 `searchParams`를 서버에서 직접 읽어 초기 검색 상태를 결정하고, 실제 데이터 페칭과 인터랙션이 필요한 부분만 클라이언트 컴포넌트(`InfiniteBookResults`, `SearchBar`)로 분리했습니다.
[Page Router에서 App Router로 마이그레이션 한 경험](https://velog.io/@josuncom/page-router%EC%97%90%EC%84%9C-app-router%EB%A1%9C-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98%ED%95%98%EA%B8%B0-2) 을 바탕으로 구현할 수 있었습니다.

```tsx
// app/page.tsx - 서버 컴포넌트
export default async function Page({ searchParams }: PageProps) {
  const { q, target } = await searchParams;

  return (
    <main>
      <SearchBar initialQuery={q} initialTarget={target} />
      <InfiniteBookResults query={q ?? ''} target={target} />
    </main>
  );
}
```

이 구조 덕분에 페이지를 직접 URL로 접근하거나 새로고침해도 검색 상태가 유지되고, 클라이언트 번들에 불필요한 코드가 포함되지 않습니다.

---

### 2. Tailwind 디자인 토큰 + CVA + cn()으로 스타일 시스템 구축

색상, 간격, 애니메이션 같은 디자인 값을 `globals.css`의 `@theme` 블록에 CSS 커스텀 프로퍼티로 정의해 Tailwind 토큰으로 사용했습니다. 매직 넘버가 컴포넌트 곳곳에 흩어지지 않고, 값을 바꿔야 할 때 이 파일 한 곳만 수정하면 됩니다.

```css
/* globals.css */
@theme {
  --color-palette-primary: #4880ee;
  --color-text-primary: #353c49;
  --color-text-secondary: #6d7582;

  --spacing-card-row: 6.25rem; /* 100px */
  --spacing-card-gap: 2.8125rem;
  --spacing-header: 5rem; /* 80px */

  --animate-expand-in: expandIn 0.25s ease-out;
}
```

정의한 토큰은 Tailwind 유틸리티 클래스처럼 바로 쓸 수 있어서 컴포넌트에서 별도 import 없이 참조됩니다.

```tsx
<div className="h-card-row gap-card-gap bg-palette-primary text-text-primary" />
```

컴포넌트 레벨에서는 CVA로 variant별 클래스를 한 곳에 정의하고, `cn()`(clsx + tailwind-merge)으로 조건부 클래스 합성과 충돌 해결을 동시에 처리했습니다. 외부에서 className을 override해도 `twMerge`가 중복을 정리해줘서 예상치 못한 스타일 충돌이 없습니다.

```tsx
const buttonVariants = cva('...기본 스타일...', {
  variants: {
    variant: {
      primary: 'bg-palette-primary text-white',
      outline: 'border border-palette-primary text-palette-primary',
      ghost: 'text-palette-primary hover:bg-blue-50',
    },
    size: {
      default: 'w-[115px] h-12',
      sm: 'w-[72px] h-[35px] text-xs',
      auto: 'w-auto px-4 h-12',
    },
  },
});
```

---

### 3. 재사용성 높은 컴포넌트 구조

`ui/` 폴더에 `Button`, `Text`, `Heading`, `Input`, `TruncatedTooltip` 같은 원자 컴포넌트를 모아두고, 그 위에 도메인 컴포넌트(`BookCard`, `SearchBar`)를 쌓는 구조입니다.

특히 `Text` 컴포넌트는 `size`, `weight`, `color`, `as` props를 조합해 타이포그래피를 일관되게 관리할 수 있도록 만들었고, `TruncatedTooltip`은 텍스트가 실제로 잘렸을 때만 툴팁을 보여줘서 긴 제목/저자명 처리에 활용했습니다.

---

### 4. 무한 스크롤

`IntersectionObserver`로 목록 맨 아래 sentinel 요소를 감지하고, 뷰포트에 진입하기 200px 전부터 다음 페이지를 미리 요청합니다. React Query의 `useInfiniteQuery`가 페이지 데이터 누적과 다음 페이지 파라미터를 관리하기 때문에 직접 처리할 상태가 거의 없습니다.

```ts
// hooks/useInfiniteBookSearch.ts
return useInfiniteQuery({
  queryKey: ['books', 'infinite', query, target],
  queryFn: ({ pageParam }) => fetchBooks(query, pageParam, target),
  initialPageParam: 1,
  getNextPageParam: (lastPage, _, lastPageParam) =>
    lastPage.meta.is_end ? undefined : lastPageParam + 1,
  enabled: query.trim().length > 0,
});
```

```tsx
// InfiniteBookResults.tsx - sentinel 감지
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { rootMargin: '200px' },
  );
  observer.observe(sentinelRef.current!);
  return () => observer.disconnect();
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);
```

Kakao API 응답의 `is_end` 필드로 마지막 페이지를 판별하고, ISBN 기준으로 중복 도서를 제거해 같은 책이 두 번 나오는 일도 없게 했습니다.

---

### 5. 반응형 디자인

모바일부터 데스크탑까지 Tailwind의 반응형 prefix(`sm:`, `lg:`)만으로 레이아웃을 조정했습니다. 도서 카드의 간격과 패딩은 `globals.css`에 커스텀 spacing 토큰으로 정의해서 여러 컴포넌트에서 일관되게 사용합니다.

```css
/* globals.css */
@utility card-row {
  @apply flex items-center gap-3 sm:gap-6 lg:gap-card-gap px-4 sm:px-6 lg:px-12 py-2 h-card-row;
}
```

헤더 네비게이션, 검색창, 도서 목록 모두 작은 화면에서도 사용하기 불편하지 않도록 구성했습니다.

---

### 6. 문자열 리소스 파일 관리

하드코딩된 리소스를 사용하면 유지보수에 어려움이 있습니다.
UI에 노출되는 텍스트를 컴포넌트 안에 직접 쓰지 않고 `resource/strings.ts` 한 파일에 모아서 관리했습니다.

```ts
// resource/strings.ts
export const strings = {
  nav: { search: '도서 검색', wishlist: '내가 찜한 책' },
  search: {
    placeholder: '검색어를 입력하세요',
    targetOptions: { title: '제목', person: '저자명', publisher: '출판사' },
    error: '검색 중 오류가 발생했습니다.',
    // ...
  },
  book: {
    buy: '구매하기',
    originalPrice: (price: string) => `원가 ${price}원`,
    discountPrice: (price: string) => `할인가 ${price}원`,
    // ...
  },
} as const;
```

`as const`로 선언해서 타입이 `string`이 아닌 리터럴 타입으로 좁혀지고, 오탈자도 컴파일 단계에서 잡힙니다. 문구를 바꿔야 할 때 컴포넌트를 뒤질 필요 없이 이 파일 한 곳만 수정하면 됩니다.

---

### 7. 찜하기 낙관적 업데이트

하트를 클릭하면 서버 응답을 기다리지 않고 UI가 즉시 반응합니다. React Query의 `onMutate` / `onError` / `onSettled`를 활용한 낙관적 업데이트 패턴으로 구현했습니다.

`onMutate`에서 기존 캐시를 snapshot해두고, 낙관적으로 토글한 뒤, 오류 발생 시 `onError`에서 복원합니다. `onSettled`는 최종 서버 상태와의 동기화를 보장합니다.

---

### 8. App Router 에러 / 로딩 처리

`app/error.tsx`와 `app/loading.tsx`로 에러·로딩 상태를 라우트 단위로 선언적으로 분리했습니다.

**loading.tsx** — 라우트 이동 중 Next.js가 자동으로 Suspense 경계를 생성해 스켈레톤 UI를 노출합니다.

**error.tsx** — React 에러 경계로 동작하며, `reset()`으로 라우트를 재시도할 수 있습니다.

`InfiniteBookResults`에서는 `isError` 상태를 인라인 렌더로 처리하는 대신 `throw error`로 에러 경계에 위임합니다.

---

### 9. 사용자 경험 향상

로딩·인터랙션 곳곳에 시각적 피드백을 추가해 체감 반응성을 높였습니다.

- **스켈레톤 UI**: 검색 결과 로딩 중 카드 형태의 회색 placeholder(`BookCardSkeleton`)를 표시해 레이아웃 이동(layout shift) 없이 자연스럽게 데이터가 채워지는 느낌을 줍니다.
- **Preloader**: 페이지 최초 진입 시 앱 로고와 함께 짧은 로딩 애니메이션을 보여줘 빈 화면 없이 첫 화면이 등장합니다.
- **TruncatedTooltip**: 도서 제목·저자명이 영역을 벗어나 잘릴 때에만 자동으로 툴팁을 노출합니다. `scrollWidth > offsetWidth` 판별로 실제로 잘린 경우에만 렌더링되기 때문에 불필요한 툴팁이 뜨지 않습니다.
- **상세보기 확장 애니메이션**: BookCard 상세 영역이 열릴 때 `expandIn` 키프레임(`0.25s ease-out`)으로 부드럽게 펼쳐집니다. 토큰은 `globals.css`의 `--animate-expand-in`으로 정의해 Tailwind 유틸리티처럼 사용합니다.

---

## 개선하고 싶었던 부분

### 도서 썸네일 이미지 최적화

`BookCardParts.tsx`에서 썸네일을 `<img>` 태그로 렌더링하고 있습니다. Next.js의 `<Image>` 컴포넌트로 교체하면 WebP 자동 변환, 뷰포트 기반 lazy loading, blur placeholder 같은 최적화를 추가 작업 없이 얻을 수 있습니다. Kakao API가 반환하는 이미지 도메인을 `next.config.ts`의 `images.remotePatterns`에 추가하기만 하면 되는데, 이미지 크기가 고정되지 않은 경우 `fill` 레이아웃 처리가 필요해서 시간 관계상 남겨뒀습니다.

### 위시리스트 페이지네이션 UI

`wishlist/page.tsx`에 `totalPages`, `currentPage` 계산 로직과 `setPage`가 이미 있는데, 실제 페이지 이동 버튼을 렌더링하는 코드가 빠져 있습니다. 현재는 찜한 책이 10권을 넘어도 첫 페이지만 볼 수 있는 상태입니다. 버튼 UI만 붙이면 되는 상황이라 아쉬운 부분입니다.

### 테스트 코드

커스텀 훅(`useInfiniteBookSearch`, `useWishlist`)과 API Route Handler에 대한 테스트가 없습니다. 특히 무한스크롤의 페이지 누적 로직이나 위시리스트 토글 동작은 사이드이펙트가 있어서 테스트로 검증해두면 리팩터링 시 안전망이 됩니다.

### 데이터 영속성

인-메모리 SQLite 특성상 서버를 재시작하면 검색 이력과 찜 목록이 초기화됩니다. 실제 서비스라면 파일 기반 SQLite(`:memory:` → 파일 경로)나 외부 DB로 교체가 필요합니다. 현재 구조는 `lib/db.ts` 한 파일만 바꾸면 되도록 설계해뒀습니다.
