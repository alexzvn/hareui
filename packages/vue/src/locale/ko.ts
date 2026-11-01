import { defineLocale } from './defineLocale'

/** 한국어 (`ko`). Keys left out fall back to English. */
export const ko = defineLocale({
  name: '한국어',
  code: 'ko',
  messages: {
    alert: {
      close: '닫기',
    },
    alertDialog: {
      close: '닫기',
    },
    autocomplete: {
      searchPlaceholder: '검색…',
    },
    breadcrumbs: {
      label: '탐색 경로',
    },
    carousel: {
      dots: '표시할 슬라이드 선택',
      goto: '{slide} 페이지로 이동',
      next: '다음',
      prev: '이전',
      roledescription: '캐러셀',
      slide: '슬라이드',
    },
    closeButton: {
      close: '닫기',
    },
    codeBlock: {
      copy: '코드를 클립보드에 복사',
    },
    comboBox: {
      trigger: '옵션 표시',
    },
    commandPalette: {
      back: '뒤로',
      close: '닫기',
      noData: '데이터가 없습니다.',
      placeholder: '명령을 입력하거나 검색…',
      results: '결과',
    },
    dashboardSidebar: {
      close: '사이드바 닫기',
    },
    dashboardSidebarCollapse: {
      collapse: '사이드바 축소',
      expand: '사이드바 확장',
    },
    dashboardSidebarToggle: {
      close: '사이드바 닫기',
      open: '사이드바 열기',
    },
    drawer: {
      close: '닫기',
    },
    dropZone: {
      removeFile: '{filename} 제거',
    },
    error: {
      clear: '홈으로 돌아가기',
    },
    header: {
      close: '메뉴 닫기',
      open: '메뉴 열기',
    },
    metric: {
      progress: '진행 상황',
    },
    modal: {
      close: '닫기',
    },
    numberField: {
      decrement: '감소',
      increment: '증가',
      roledescription: '숫자 필드',
    },
    numberStepper: {
      decrement: '감소',
      increment: '증가',
      roledescription: '숫자 필드',
    },
    pagination: {
      next: '다음 페이지',
      nextLabel: '다음',
      prev: '이전 페이지',
      prevLabel: '이전',
    },
    richTable: {
      noData: '데이터가 없습니다.',
    },
    sidebar: {
      close: '사이드바 닫기',
      toggle: '토글',
    },
    spinner: {
      label: '로딩 중',
    },
    toast: {
      close: '닫기',
    },
    toc: {
      title: '이 페이지에서',
    },
  },
})
