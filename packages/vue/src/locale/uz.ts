import { defineLocale } from './defineLocale'

/** Oʻzbek (`uz`). Keys left out fall back to English. */
export const uz = defineLocale({
  name: 'Oʻzbek',
  code: 'uz',
  messages: {
    alert: {
      close: 'Yopish',
    },
    alertDialog: {
      close: 'Yopish',
    },
    autocomplete: {
      searchPlaceholder: 'Qidirish…',
    },
    breadcrumbs: {
      label: 'navigatsiya zanjiri',
    },
    carousel: {
      dots: 'Koʻrsatish uchun slaydni tanlang',
      goto: "{slide}-slaydga o'tish",
      next: 'Oldinga',
      prev: 'Ortga',
      roledescription: 'karusel',
      slide: 'slayd',
    },
    closeButton: {
      close: 'Yopish',
    },
    codeBlock: {
      copy: 'Koddan buferga nusxa olish',
    },
    comboBox: {
      trigger: 'Variantlarni koʻrsatish',
    },
    commandPalette: {
      back: 'Orqaga',
      close: 'Yopish',
      noData: 'Maʼlumot yoʻq',
      placeholder: 'Buyruq kiriting yoki qidiring…',
      results: 'Natijalar',
    },
    dashboardSidebar: {
      close: 'Yon panelni yopish',
    },
    dashboardSidebarCollapse: {
      collapse: "Yon panelni yig'ish",
      expand: 'Yon panelni kengaytirish',
    },
    dashboardSidebarToggle: {
      close: 'Yon panelni yopish',
      open: 'Yon panelni ochish',
    },
    drawer: {
      close: 'Yopish',
    },
    dropZone: {
      removeFile: '{filename}ni oʻchirish',
    },
    error: {
      clear: 'Bosh sahifaga qaytish',
    },
    header: {
      close: 'Menyuni yopish',
      open: 'Menyuni ochish',
    },
    metric: {
      progress: 'jarayon',
    },
    modal: {
      close: 'Yopish',
    },
    numberField: {
      decrement: 'Ayirish',
      increment: 'Qoʻshish',
      roledescription: 'raqamli maydon',
    },
    numberStepper: {
      decrement: 'Ayirish',
      increment: 'Qoʻshish',
      roledescription: 'raqamli maydon',
    },
    pagination: {
      next: 'Keyingi sahifa',
      nextLabel: 'Oldinga',
      prev: 'Oldingi sahifa',
      prevLabel: 'Ortga',
    },
    richTable: {
      noData: 'Maʼlumot yoʻq',
    },
    sidebar: {
      close: 'Yon panelni yopish',
      toggle: 'Almashtirish',
    },
    spinner: {
      label: 'yuklanmoqda',
    },
    toast: {
      close: 'Yopish',
    },
    toc: {
      title: 'Ushbu sahifada',
    },
  },
})
