import { defineLocale } from './defineLocale'

/** Bahasa Indonesia (`id`). Keys left out fall back to English. */
export const id = defineLocale({
  name: 'Bahasa Indonesia',
  code: 'id',
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
      dots: 'Pilih slide untuk ditampilkan',
      goto: 'Pergi ke slide {slide}',
      next: 'Berikutnya',
      prev: 'Sebelumnya',
      roledescription: 'korsel',
      slide: 'slide',
    },
    closeButton: {
      close: 'Tutup',
    },
    codeBlock: {
      copy: 'Salin kode ke clipboard',
    },
    comboBox: {
      trigger: 'Tampilkan opsi',
    },
    commandPalette: {
      back: 'Kembali',
      close: 'Tutup',
      noData: 'Tidak ada data',
      placeholder: 'Ketik perintah atau cari…',
      results: 'Hasil',
    },
    dashboardSidebar: {
      close: 'Tutup sidebar',
    },
    dashboardSidebarCollapse: {
      collapse: 'Ciutkan sidebar',
      expand: 'Perluas sidebar',
    },
    dashboardSidebarToggle: {
      close: 'Tutup sidebar',
      open: 'Buka sidebar',
    },
    drawer: {
      close: 'Tutup',
    },
    dropZone: {
      removeFile: 'Hapus {filename}',
    },
    error: {
      clear: 'Kembali ke beranda',
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
      decrement: 'Kurangi',
      increment: 'Tambah',
      roledescription: 'bidang angka',
    },
    numberStepper: {
      decrement: 'Kurangi',
      increment: 'Tambah',
      roledescription: 'bidang angka',
    },
    pagination: {
      next: 'Halaman selanjutnya',
      nextLabel: 'Berikutnya',
      prev: 'Halaman sebelumnya',
      prevLabel: 'Sebelumnya',
    },
    richTable: {
      noData: 'Tidak ada data',
    },
    sidebar: {
      close: 'Tutup sidebar',
      toggle: 'Alihkan',
    },
    spinner: {
      label: 'memuat',
    },
    toast: {
      close: 'Tutup',
    },
    toc: {
      title: 'Pada halaman ini',
    },
  },
})
