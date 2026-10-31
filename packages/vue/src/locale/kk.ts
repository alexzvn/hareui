import { defineLocale } from './defineLocale'

/** Қазақша (`kk`). Keys left out fall back to English. */
export const kk = defineLocale({
  name: 'Қазақша',
  code: 'kk',
  messages: {
    alert: {
      close: 'Жабу',
    },
    alertDialog: {
      close: 'Жабу',
    },
    autocomplete: {
      searchPlaceholder: 'Іздеу…',
    },
    breadcrumbs: {
      label: 'навигациялық жол',
    },
    carousel: {
      dots: 'Көрсету үшін слайдты таңдаңыз',
      goto: '{slide} слайдқа өту',
      next: 'Келесі',
      prev: 'Алдыңғы',
      roledescription: 'карусель',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Жабу',
    },
    codeBlock: {
      copy: 'Кодты алмасу буферіне көшіру',
    },
    comboBox: {
      trigger: 'Нұсқаларды көрсету',
    },
    commandPalette: {
      back: 'Артқа',
      close: 'Жабу',
      noData: 'Деректер жоқ',
      placeholder: 'Команда енгізіңіз немесе іздеңіз…',
      results: 'Нәтижелер',
    },
    dashboardSidebar: {
      close: 'Жабу',
    },
    dashboardSidebarCollapse: {
      collapse: 'Жию',
      expand: 'Кеңейту',
    },
    dashboardSidebarToggle: {
      close: 'Жабу',
      open: 'Ашу',
    },
    drawer: {
      close: 'Жабу',
    },
    dropZone: {
      removeFile: '{filename} жою',
    },
    error: {
      clear: 'Тазалау',
    },
    header: {
      close: 'Жабу',
      open: 'Ашу',
    },
    metric: {
      progress: 'прогресс',
    },
    modal: {
      close: 'Жабу',
    },
    numberField: {
      decrement: 'Азайту',
      increment: 'Арттыру',
      roledescription: 'сандық өріс',
    },
    numberStepper: {
      decrement: 'Азайту',
      increment: 'Арттыру',
      roledescription: 'сандық өріс',
    },
    pagination: {
      next: 'Келесі бет',
      nextLabel: 'Келесі',
      prev: 'Алдыңғы бет',
      prevLabel: 'Алдыңғы',
    },
    richTable: {
      noData: 'Деректер жоқ',
    },
    sidebar: {
      close: 'Жабу',
      toggle: 'Ауыстыру',
    },
    spinner: {
      label: 'жүктелуде',
    },
    toast: {
      close: 'Жабу',
    },
    toc: {
      title: 'Мазмұны',
    },
  },
})
