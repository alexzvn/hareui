import { defineLocale } from './defineLocale'

/** Azərbaycanca (`az`). Keys left out fall back to English. */
export const az = defineLocale({
  name: 'Azərbaycanca',
  code: 'az',
  messages: {
    alert: {
      close: 'Bağla',
    },
    alertDialog: {
      close: 'Bağla',
    },
    autocomplete: {
      searchPlaceholder: 'Axtar…',
    },
    breadcrumbs: {
      label: 'naviqasiya yolu',
    },
    carousel: {
      dots: 'Göstərmək üçün slayd seçin',
      goto: 'Slayd {slide} keç',
      next: 'Növbəti',
      prev: 'Əvvəlki',
      roledescription: 'karusel',
      slide: 'slayd',
    },
    closeButton: {
      close: 'Bağla',
    },
    codeBlock: {
      copy: 'Kodu buferə kopyala',
    },
    comboBox: {
      trigger: 'Seçimləri göstər',
    },
    commandPalette: {
      back: 'Geri',
      close: 'Bağla',
      noData: 'Məlumat yoxdur',
      placeholder: 'Əmr daxil edin və ya axtarın…',
      results: 'Nəticələr',
    },
    dashboardSidebar: {
      close: 'Yan paneli bağla',
    },
    dashboardSidebarCollapse: {
      collapse: 'Yan paneli daralt',
      expand: 'Yan paneli genişlət',
    },
    dashboardSidebarToggle: {
      close: 'Yan paneli bağla',
      open: 'Yan paneli aç',
    },
    drawer: {
      close: 'Bağla',
    },
    dropZone: {
      removeFile: '{filename} sil',
    },
    error: {
      clear: 'Ana səhifəyə qayıt',
    },
    header: {
      close: 'Menyunu bağla',
      open: 'Menyunu aç',
    },
    metric: {
      progress: 'irəliləyiş',
    },
    modal: {
      close: 'Bağla',
    },
    numberField: {
      decrement: 'Azalt',
      increment: 'Artır',
      roledescription: 'rəqəm sahəsi',
    },
    numberStepper: {
      decrement: 'Azalt',
      increment: 'Artır',
      roledescription: 'rəqəm sahəsi',
    },
    pagination: {
      next: 'Növbəti səhifə',
      nextLabel: 'Növbəti',
      prev: 'Əvvəlki səhifə',
      prevLabel: 'Əvvəlki',
    },
    richTable: {
      noData: 'Məlumat yoxdur',
    },
    sidebar: {
      close: 'Yan paneli bağla',
      toggle: 'Dəyişdir',
    },
    spinner: {
      label: 'yüklənir',
    },
    toast: {
      close: 'Bağla',
    },
    toc: {
      title: 'Bu səhifədə',
    },
  },
})
