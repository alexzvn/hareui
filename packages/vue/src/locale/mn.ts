import { defineLocale } from './defineLocale'

/** Монгол (`mn`). Keys left out fall back to English. */
export const mn = defineLocale({
  name: 'Монгол',
  code: 'mn',
  messages: {
    alert: {
      close: 'Хаах',
    },
    alertDialog: {
      close: 'Хаах',
    },
    autocomplete: {
      searchPlaceholder: 'Хайх…',
    },
    breadcrumbs: {
      label: 'навигацийн зам',
    },
    carousel: {
      dots: 'Харуулах слайдыг сонгоно уу',
      goto: '{slide}-р хуудсанд шилжих',
      next: 'Дараах',
      prev: 'Өмнөх',
      roledescription: 'карусель',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Хаах',
    },
    codeBlock: {
      copy: 'Кодыг санах ойд хуулах',
    },
    comboBox: {
      trigger: 'Сонголтуудыг харуулах',
    },
    commandPalette: {
      back: 'Буцах',
      close: 'Хаах',
      noData: 'Мэдээлэл байхгүй',
      placeholder: 'Комманд бичих эсвэл хайлт хийх…',
      results: 'Үр дүн',
    },
    dashboardSidebar: {
      close: 'Хажуугийн самбарыг хаах',
    },
    dashboardSidebarCollapse: {
      collapse: 'Хажуугийн самбарыг хураах',
      expand: 'Хажуугийн самбарыг дэлгэх',
    },
    dashboardSidebarToggle: {
      close: 'Хажуугийн самбарыг хаах',
      open: 'Хажуугийн самбарыг нээх',
    },
    drawer: {
      close: 'Хаах',
    },
    dropZone: {
      removeFile: '{filename} устгах',
    },
    error: {
      clear: 'Нүүр хуудас руу буцах',
    },
    header: {
      close: 'Цэсийг хаах',
      open: 'Цэсийг нээх',
    },
    metric: {
      progress: 'явц',
    },
    modal: {
      close: 'Хаах',
    },
    numberField: {
      decrement: 'Хасах',
      increment: 'Нэмэх',
      roledescription: 'тоон талбар',
    },
    numberStepper: {
      decrement: 'Хасах',
      increment: 'Нэмэх',
      roledescription: 'тоон талбар',
    },
    pagination: {
      next: 'Дараах хуудас',
      nextLabel: 'Дараах',
      prev: 'Өмнөх хуудас',
      prevLabel: 'Өмнөх',
    },
    richTable: {
      noData: 'Мэдээлэл байхгүй',
    },
    sidebar: {
      close: 'Хажуугийн самбарыг хаах',
      toggle: 'Сэлгэх',
    },
    spinner: {
      label: 'ачаалж байна',
    },
    toast: {
      close: 'Хаах',
    },
    toc: {
      title: 'Энэ хуудсанд',
    },
  },
})
