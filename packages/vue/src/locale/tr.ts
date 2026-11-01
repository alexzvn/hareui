import { defineLocale } from './defineLocale'

/** Türkçe (`tr`). Keys left out fall back to English. */
export const tr = defineLocale({
  name: 'Türkçe',
  code: 'tr',
  messages: {
    alert: {
      close: 'Kapat',
    },
    alertDialog: {
      close: 'Kapat',
    },
    autocomplete: {
      searchPlaceholder: 'Ara…',
    },
    breadcrumbs: {
      label: 'içerik haritası',
    },
    carousel: {
      dots: 'Görüntülenecek slaydı seçin',
      goto: '{slide}. slayda git',
      next: 'Sonraki',
      prev: 'Önceki',
      roledescription: 'karusel',
      slide: 'slayt',
    },
    closeButton: {
      close: 'Kapat',
    },
    codeBlock: {
      copy: 'Kodu panoya kopyala',
    },
    comboBox: {
      trigger: 'Seçenekleri göster',
    },
    commandPalette: {
      back: 'Geri',
      close: 'Kapat',
      noData: 'Veri yok',
      placeholder: 'Bir komut yazın veya arama yapın…',
      results: 'Sonuçlar',
    },
    dashboardSidebar: {
      close: 'Kenar çubuğunu kapat',
    },
    dashboardSidebarCollapse: {
      collapse: 'Kenar çubuğunu daralt',
      expand: 'Kenar çubuğunu genişlet',
    },
    dashboardSidebarToggle: {
      close: 'Kenar çubuğunu kapat',
      open: 'Kenar çubuğunu aç',
    },
    drawer: {
      close: 'Kapat',
    },
    dropZone: {
      removeFile: '{filename} kaldır',
    },
    error: {
      clear: 'Ana sayfaya dön',
    },
    header: {
      close: 'Menüyü kapat',
      open: 'Menüyü aç',
    },
    metric: {
      progress: 'ilerleme',
    },
    modal: {
      close: 'Kapat',
    },
    numberField: {
      decrement: 'Azalt',
      increment: 'Arttır',
      roledescription: 'sayı alanı',
    },
    numberStepper: {
      decrement: 'Azalt',
      increment: 'Arttır',
      roledescription: 'sayı alanı',
    },
    pagination: {
      next: 'Sonraki sayfa',
      nextLabel: 'Sonraki',
      prev: 'Önceki sayfa',
      prevLabel: 'Önceki',
    },
    richTable: {
      noData: 'Veri yok',
    },
    sidebar: {
      close: 'Kenar çubuğunu kapat',
      toggle: 'Değiştir',
    },
    spinner: {
      label: 'yükleniyor',
    },
    toast: {
      close: 'Kapat',
    },
    toc: {
      title: 'Bu sayfada',
    },
  },
})
