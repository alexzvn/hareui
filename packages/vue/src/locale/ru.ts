import { defineLocale } from './defineLocale'

/** Русский (`ru`). Keys left out fall back to English. */
export const ru = defineLocale({
  name: 'Русский',
  code: 'ru',
  messages: {
    alert: {
      close: 'Закрыть',
    },
    alertDialog: {
      close: 'Закрыть',
    },
    autocomplete: {
      searchPlaceholder: 'Поиск…',
    },
    breadcrumbs: {
      label: 'навигационная цепочка',
    },
    carousel: {
      dots: 'Выберите слайд для отображения',
      goto: 'Перейти к {slide}',
      next: 'Далее',
      prev: 'Назад',
      roledescription: 'карусель',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Закрыть',
    },
    codeBlock: {
      copy: 'Скопировать код в буфер обмена',
    },
    comboBox: {
      trigger: 'Показать варианты',
    },
    commandPalette: {
      back: 'Назад',
      close: 'Закрыть',
      noData: 'Нет данных',
      placeholder: 'Введите команду или выполните поиск…',
      results: 'Результаты',
    },
    dashboardSidebar: {
      close: 'Закрыть боковую панель',
    },
    dashboardSidebarCollapse: {
      collapse: 'Свернуть боковую панель',
      expand: 'Развернуть боковую панель',
    },
    dashboardSidebarToggle: {
      close: 'Закрыть боковую панель',
      open: 'Открыть боковую панель',
    },
    drawer: {
      close: 'Закрыть',
    },
    dropZone: {
      removeFile: 'Удалить {filename}',
    },
    error: {
      clear: 'Вернуться на главную',
    },
    header: {
      close: 'Закрыть меню',
      open: 'Открыть меню',
    },
    metric: {
      progress: 'прогресс',
    },
    modal: {
      close: 'Закрыть',
    },
    numberField: {
      decrement: 'Уменьшить',
      increment: 'Увеличить',
      roledescription: 'числовое поле',
    },
    numberStepper: {
      decrement: 'Уменьшить',
      increment: 'Увеличить',
      roledescription: 'числовое поле',
    },
    pagination: {
      next: 'Следующая страница',
      nextLabel: 'Далее',
      prev: 'Предыдущая страница',
      prevLabel: 'Назад',
    },
    richTable: {
      noData: 'Нет данных',
    },
    sidebar: {
      close: 'Закрыть боковую панель',
      toggle: 'Переключить',
    },
    spinner: {
      label: 'загрузка',
    },
    toast: {
      close: 'Закрыть',
    },
    toc: {
      title: 'На этой странице',
    },
  },
})
