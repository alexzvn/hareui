import { defineLocale } from './defineLocale'

/** Български (`bg`). Keys left out fall back to English. */
export const bg = defineLocale({
  name: 'Български',
  code: 'bg',
  messages: {
    alert: {
      close: 'Затворете',
    },
    alertDialog: {
      close: 'Затворете',
    },
    autocomplete: {
      searchPlaceholder: 'Потърсете…',
    },
    breadcrumbs: {
      label: 'навигационна пътека',
    },
    carousel: {
      dots: 'Изберете слайд за показване',
      goto: 'Отидете на слайд {slide}',
      next: 'Напред',
      prev: 'Назад',
      roledescription: 'карусел',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Затворете',
    },
    codeBlock: {
      copy: 'Копирай кода в клипборда',
    },
    comboBox: {
      trigger: 'Показване на опциите',
    },
    commandPalette: {
      back: 'Назад',
      close: 'Затворете',
      noData: 'Няма данни',
      placeholder: 'Въведете команда или потърсете…',
      results: 'Резултати',
    },
    dashboardSidebar: {
      close: 'Затвори',
    },
    dashboardSidebarCollapse: {
      collapse: 'Свий',
      expand: 'Разшири',
    },
    dashboardSidebarToggle: {
      close: 'Затвори',
      open: 'Отвори',
    },
    drawer: {
      close: 'Затворете',
    },
    dropZone: {
      removeFile: 'Премахни {filename}',
    },
    error: {
      clear: 'Изчисти',
    },
    header: {
      close: 'Затвори',
      open: 'Отвори',
    },
    metric: {
      progress: 'напредък',
    },
    modal: {
      close: 'Затворете',
    },
    numberField: {
      decrement: 'Намаляване',
      increment: 'Увеличаване',
      roledescription: 'числово поле',
    },
    numberStepper: {
      decrement: 'Намаляване',
      increment: 'Увеличаване',
      roledescription: 'числово поле',
    },
    pagination: {
      next: 'Следваща страница',
      nextLabel: 'Напред',
      prev: 'Предишна страница',
      prevLabel: 'Назад',
    },
    richTable: {
      noData: 'Няма данни',
    },
    sidebar: {
      close: 'Затвори',
      toggle: 'Превключване',
    },
    spinner: {
      label: 'зареждане',
    },
    toast: {
      close: 'Затворете',
    },
    toc: {
      title: 'Съдържание',
    },
  },
})
