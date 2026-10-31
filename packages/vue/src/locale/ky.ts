import { defineLocale } from './defineLocale'

/** Кыргызча (`ky`). Keys left out fall back to English. */
export const ky = defineLocale({
  name: 'Кыргызча',
  code: 'ky',
  messages: {
    alert: {
      close: 'Жабуу',
    },
    alertDialog: {
      close: 'Жабуу',
    },
    autocomplete: {
      searchPlaceholder: 'Издөө…',
    },
    breadcrumbs: {
      label: 'навигациялык жол',
    },
    carousel: {
      dots: 'Көрсөтүү үчүн слайдды тандаңыз',
      goto: '{slide} слайдга өтүү',
      next: 'Кийинки',
      prev: 'Алдыңкы',
      roledescription: 'карусель',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Жабуу',
    },
    codeBlock: {
      copy: 'Кодду алмашуу буферине көчүрүү',
    },
    comboBox: {
      trigger: 'Варианттарды көрсөтүү',
    },
    commandPalette: {
      back: 'Артка',
      close: 'Жабуу',
      noData: 'Маалымат жок',
      placeholder: 'Буйрук киргизиңиз же издөө…',
      results: 'Жыйынтыктар',
    },
    dashboardSidebar: {
      close: 'Каптал тилкесин жабуу',
    },
    dashboardSidebarCollapse: {
      collapse: 'Каптал тилкесин жыйноо',
      expand: 'Каптал тилкесин кеңейтүү',
    },
    dashboardSidebarToggle: {
      close: 'Каптал тилкесин жабуу',
      open: 'Каптал тилкесин ачуу',
    },
    drawer: {
      close: 'Жабуу',
    },
    dropZone: {
      removeFile: '{filename} өчүрүү',
    },
    error: {
      clear: 'Башкы бетке кайтуу',
    },
    header: {
      close: 'Менюну жабуу',
      open: 'Менюну ачуу',
    },
    metric: {
      progress: 'прогресс',
    },
    modal: {
      close: 'Жабуу',
    },
    numberField: {
      decrement: 'Азайтуу',
      increment: 'Кошуу',
      roledescription: 'сандык талаа',
    },
    numberStepper: {
      decrement: 'Азайтуу',
      increment: 'Кошуу',
      roledescription: 'сандык талаа',
    },
    pagination: {
      next: 'Кийинки бет',
      nextLabel: 'Кийинки',
      prev: 'Алдыңкы бет',
      prevLabel: 'Алдыңкы',
    },
    richTable: {
      noData: 'Маалымат жок',
    },
    sidebar: {
      close: 'Каптал тилкесин жабуу',
      toggle: 'Которуу',
    },
    spinner: {
      label: 'жүктөлүүдө',
    },
    toast: {
      close: 'Жабуу',
    },
    toc: {
      title: 'Бул бетте',
    },
  },
})
