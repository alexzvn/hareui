import { defineLocale } from './defineLocale'

/** اردو (`ur`). Keys left out fall back to English. */
export const ur = defineLocale({
  name: 'اردو',
  code: 'ur',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'بند کریں',
    },
    alertDialog: {
      close: 'بند کریں',
    },
    autocomplete: {
      searchPlaceholder: 'تلاش کریں…',
    },
    breadcrumbs: {
      label: 'نیویگیشن کا راستہ',
    },
    carousel: {
      dots: 'دکھانے کے لیے سلائیڈ منتخب کریں',
      goto: 'سلائیڈ {slide} پر جائیں',
      next: 'اگلا',
      prev: 'پچھلا',
      roledescription: 'کیروسل',
      slide: 'سلائیڈ',
    },
    closeButton: {
      close: 'بند کریں',
    },
    codeBlock: {
      copy: 'کوڈ کاپی کریں',
    },
    comboBox: {
      trigger: 'اختیارات دکھائیں',
    },
    commandPalette: {
      back: 'واپس',
      close: 'بند کریں',
      noData: 'کوئی ڈیٹا نہیں',
      placeholder: 'کمانڈ ٹائپ کریں یا تلاش کریں…',
      results: 'نتائج',
    },
    dashboardSidebar: {
      close: 'سائیڈ بار بند کریں',
    },
    dashboardSidebarCollapse: {
      collapse: 'سائیڈ بار کو سکیڑیں',
      expand: 'سائیڈ بار کو پھیلائیں',
    },
    dashboardSidebarToggle: {
      close: 'سائیڈ بار بند کریں',
      open: 'سائیڈ بار کھولیں',
    },
    drawer: {
      close: 'بند کریں',
    },
    dropZone: {
      removeFile: '{filename} ہٹائیں',
    },
    error: {
      clear: 'ہوم پیج پر واپس جائیں',
    },
    header: {
      close: 'مینو بند کریں',
      open: 'مینو کھولیں',
    },
    metric: {
      progress: 'پیش رفت',
    },
    modal: {
      close: 'بند کریں',
    },
    numberField: {
      decrement: 'کمی',
      increment: 'اضافہ',
      roledescription: 'عددی فیلڈ',
    },
    numberStepper: {
      decrement: 'کمی',
      increment: 'اضافہ',
      roledescription: 'عددی فیلڈ',
    },
    pagination: {
      next: 'اگلا صفحہ',
      nextLabel: 'اگلا',
      prev: 'پچھلا صفحہ',
      prevLabel: 'پچھلا',
    },
    richTable: {
      noData: 'کوئی ڈیٹا نہیں',
    },
    sidebar: {
      close: 'سائیڈ بار بند کریں',
      toggle: 'ٹوگل کریں',
    },
    spinner: {
      label: 'لوڈ ہو رہا ہے',
    },
    toast: {
      close: 'بند کریں',
    },
    toc: {
      title: 'اس صفحے پر',
    },
  },
})
