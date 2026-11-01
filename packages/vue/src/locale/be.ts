import { defineLocale } from './defineLocale'

/** Беларуская (`be`). Keys left out fall back to English. */
export const be = defineLocale({
  name: 'Беларуская',
  code: 'be',
  messages: {
    alert: {
      close: 'Закрыць',
    },
    alertDialog: {
      close: 'Закрыць',
    },
    autocomplete: {
      searchPlaceholder: 'Пошук…',
    },
    breadcrumbs: {
      label: 'навігацыйны ланцужок',
    },
    carousel: {
      dots: 'Выберыце слайд для адлюстравання',
      goto: 'Перайсці да {slide}',
      next: 'Далей',
      prev: 'Назад',
      roledescription: 'карусель',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Закрыць',
    },
    codeBlock: {
      copy: 'Скапіяваць код у буфер абмену',
    },
    comboBox: {
      trigger: 'Паказаць варыянты',
    },
    commandPalette: {
      back: 'Назад',
      close: 'Закрыць',
      noData: 'Няма даных',
      placeholder: 'Увядзіце каманду або выканайце пошук…',
      results: 'Вынікі',
    },
    dashboardSidebar: {
      close: 'Закрыць бакавую панэль',
    },
    dashboardSidebarCollapse: {
      collapse: 'Згарнуць бакавую панэль',
      expand: 'Разгарнуць бакавую панэль',
    },
    dashboardSidebarToggle: {
      close: 'Закрыць бакавую панэль',
      open: 'Адкрыць бакавую панэль',
    },
    drawer: {
      close: 'Закрыць',
    },
    dropZone: {
      removeFile: 'Выдаліць {filename}',
    },
    error: {
      clear: 'Вярнуцца на галоўную',
    },
    header: {
      close: 'Закрыць меню',
      open: 'Адкрыць меню',
    },
    metric: {
      progress: 'прагрэс',
    },
    modal: {
      close: 'Закрыць',
    },
    numberField: {
      decrement: 'Паменшыць',
      increment: 'Павялічыць',
      roledescription: 'лікавае поле',
    },
    numberStepper: {
      decrement: 'Паменшыць',
      increment: 'Павялічыць',
      roledescription: 'лікавае поле',
    },
    pagination: {
      next: 'Наступная старонка',
      nextLabel: 'Далей',
      prev: 'Папярэдняя старонка',
      prevLabel: 'Назад',
    },
    richTable: {
      noData: 'Няма даных',
    },
    sidebar: {
      close: 'Закрыць бакавую панэль',
      toggle: 'Пераключыць',
    },
    spinner: {
      label: 'загрузка',
    },
    toast: {
      close: 'Закрыць',
    },
    toc: {
      title: 'На гэтай старонцы',
    },
  },
})
