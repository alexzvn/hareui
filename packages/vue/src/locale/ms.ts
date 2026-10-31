import { defineLocale } from './defineLocale'

/** Melayu (`ms`). Keys left out fall back to English. */
export const ms = defineLocale({
  name: 'Melayu',
  code: 'ms',
  messages: {
    alert: {
      close: 'Tutup',
    },
    alertDialog: {
      close: 'Tutup',
    },
    autocomplete: {
      searchPlaceholder: 'Cari…',
    },
    breadcrumbs: {
      label: 'jejak navigasi',
    },
    carousel: {
      dots: 'Pilih slaid untuk dipaparkan',
      goto: 'Pergi ke slaid {slide}',
      next: 'Seterusnya',
      prev: 'Sebelum',
      roledescription: 'karusel',
      slide: 'slaid',
    },
    closeButton: {
      close: 'Tutup',
    },
    codeBlock: {
      copy: 'Salin kod ke papan klip',
    },
    comboBox: {
      trigger: 'Tunjukkan pilihan',
    },
    commandPalette: {
      back: 'Kembali',
      close: 'Tutup',
      noData: 'Tiada data',
      placeholder: 'Taip arahan atau carian…',
      results: 'Keputusan',
    },
    dashboardSidebar: {
      close: 'Tutup bar sisi',
    },
    dashboardSidebarCollapse: {
      collapse: 'Runtuhkan bar sisi',
      expand: 'Kembangkan bar sisi',
    },
    dashboardSidebarToggle: {
      close: 'Tutup bar sisi',
      open: 'Buka bar sisi',
    },
    drawer: {
      close: 'Tutup',
    },
    dropZone: {
      removeFile: 'Buang {filename}',
    },
    error: {
      clear: 'Kembali ke laman utama',
    },
    header: {
      close: 'Tutup menu',
      open: 'Buka menu',
    },
    metric: {
      progress: 'kemajuan',
    },
    modal: {
      close: 'Tutup',
    },
    numberField: {
      decrement: 'Kurangkan',
      increment: 'Naikkan',
      roledescription: 'medan nombor',
    },
    numberStepper: {
      decrement: 'Kurangkan',
      increment: 'Naikkan',
      roledescription: 'medan nombor',
    },
    pagination: {
      next: 'Halaman seterusnya',
      nextLabel: 'Seterusnya',
      prev: 'Halaman sebelumnya',
      prevLabel: 'Sebelum',
    },
    richTable: {
      noData: 'Tiada data',
    },
    sidebar: {
      close: 'Tutup bar sisi',
      toggle: 'Togol',
    },
    spinner: {
      label: 'memuatkan',
    },
    toast: {
      close: 'Tutup',
    },
    toc: {
      title: 'Di halaman ini',
    },
  },
})
