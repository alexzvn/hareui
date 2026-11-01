import { defineLocale } from './defineLocale'

/** Українська (`uk`). Keys left out fall back to English. */
export const uk = defineLocale({
  name: 'Українська',
  code: 'uk',
  messages: {
    alert: {
      close: 'Закрити',
    },
    alertDialog: {
      close: 'Закрити',
    },
    autocomplete: {
      searchPlaceholder: 'Пошук…',
    },
    breadcrumbs: {
      label: 'навігаційний ланцюжок',
    },
    carousel: {
      dots: 'Виберіть слайд для відображення',
      goto: 'Перейти до {slide}',
      next: 'Далі',
      prev: 'Назад',
      roledescription: 'карусель',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Закрити',
    },
    codeBlock: {
      copy: 'Копіювати код у буфер обміну',
    },
    comboBox: {
      trigger: 'Показати варіанти',
    },
    commandPalette: {
      back: 'Назад',
      close: 'Закрити',
      noData: 'Немає даних',
      placeholder: 'Введіть команду або шукайте…',
      results: 'Результати',
    },
    dashboardSidebar: {
      close: 'Закрити бічну панель',
    },
    dashboardSidebarCollapse: {
      collapse: 'Згорнути бічну панель',
      expand: 'Розгорнути бічну панель',
    },
    dashboardSidebarToggle: {
      close: 'Закрити бічну панель',
      open: 'Відкрити бічну панель',
    },
    drawer: {
      close: 'Закрити',
    },
    dropZone: {
      removeFile: 'Видалити {filename}',
    },
    error: {
      clear: 'Повернутися на головну',
    },
    header: {
      close: 'Закрити меню',
      open: 'Відкрити меню',
    },
    metric: {
      progress: 'прогрес',
    },
    modal: {
      close: 'Закрити',
    },
    numberField: {
      decrement: 'Зменшити',
      increment: 'Збільшити',
      roledescription: 'числове поле',
    },
    numberStepper: {
      decrement: 'Зменшити',
      increment: 'Збільшити',
      roledescription: 'числове поле',
    },
    pagination: {
      next: 'Наступна сторінка',
      nextLabel: 'Далі',
      prev: 'Попередня сторінка',
      prevLabel: 'Назад',
    },
    richTable: {
      noData: 'Немає даних',
    },
    sidebar: {
      close: 'Закрити бічну панель',
      toggle: 'Перемикнути',
    },
    spinner: {
      label: 'завантаження',
    },
    toast: {
      close: 'Закрити',
    },
    toc: {
      title: 'На цій сторінці',
    },
  },
})
