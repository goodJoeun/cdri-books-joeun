export const strings = {
  brand: 'CERTICOS BOOKS',

  nav: {
    search: '도서 검색',
    wishlist: '내가 찜한 책',
  },

  search: {
    pageTitle: '도서 검색',
    placeholder: '검색어를 입력하세요',
    detailSearch: '상세검색',
    detailPlaceholder: '검색어 입력',
    searchButton: '검색하기',
    recentHistory: '최근 검색어',
    clearAll: '전체 삭제',
    resultLabel: '도서 검색 결과',
    resultUnit: '건',
    loading: '검색 중...',
    error: '검색 중 오류가 발생했습니다.',
    targetOptions: {
      title: '제목',
      person: '저자명',
      publisher: '출판사',
    },
  },

  pagination: {
    prev: '이전',
    next: '다음',
  },

  book: {
    buy: '구매하기',
    detail: '상세보기',
    intro: '책 소개',
    noContents: '등록된 책 소개가 없습니다.',
    wishAdd: '찜하기',
    wishRemove: '찜 해제',
    originalPrice: (price: string) => `원가 ${price}원`,
    discountPrice: (price: string) => `할인가 ${price}원`,
    regularPrice: (price: string) => `${price}원`,
  },

  wishlist: {
    pageTitle: '내가 찜한 책',
    countPrefix: '찜한 책',
    countUnit: '건',
    emptyAlt: '찜한 책이 없습니다',
    empty: '찜한 책이 없습니다.',
  },
} as const;
