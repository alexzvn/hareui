import { defineLocale } from './defineLocale'

/** کوردی (`ckb`). Keys left out fall back to English. */
export const ckb = defineLocale({
  name: 'کوردی',
  code: 'ckb',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'داخستن',
    },
    alertDialog: {
      close: 'داخستن',
    },
    autocomplete: {
      searchPlaceholder: 'گەڕان…',
    },
    breadcrumbs: {
      label: 'ڕێڕەوی پەڕەکان',
    },
    carousel: {
      dots: 'سلایدێک هەڵبژێرە بۆ پیشاندان',
      goto: 'بڕۆ بۆ سلایدی {slide}',
      next: 'دواتر',
      prev: 'پێشتر',
      roledescription: 'کارۆسێل',
      slide: 'سلاید',
    },
    closeButton: {
      close: 'داخستن',
    },
    codeBlock: {
      copy: 'لەبەرگرتنەوەی کۆد',
    },
    comboBox: {
      trigger: 'پیشاندانی هەڵبژاردەکان',
    },
    commandPalette: {
      back: 'گەڕانەوە',
      close: 'داخستن',
      noData: 'هیچ داتایەک نییە',
      placeholder: 'فەرمانێک بنووسە یان بگەڕێ…',
      results: 'ئەنجامەکان',
    },
    dashboardSidebar: {
      close: 'داخستنی لاتەنیشت',
    },
    dashboardSidebarCollapse: {
      collapse: 'داخستنی لای تەنیشت',
      expand: 'فراوانکردنی لای تەنیشت',
    },
    dashboardSidebarToggle: {
      close: 'داخستنی لاتەنیشت',
      open: 'کردنەوەی لاتەنیشت',
    },
    drawer: {
      close: 'داخستن',
    },
    dropZone: {
      removeFile: '{filename} بسڕەوە',
    },
    error: {
      clear: 'گەڕانەوە بۆ سەرەتا',
    },
    header: {
      close: 'داخستنی پێڕست',
      open: 'کردنەوەی پێڕست',
    },
    metric: {
      progress: 'پێشکەوتن',
    },
    modal: {
      close: 'داخستن',
    },
    numberField: {
      decrement: 'کەمکردنەوە',
      increment: 'زیادکردن',
      roledescription: 'خانەی ژمارە',
    },
    numberStepper: {
      decrement: 'کەمکردنەوە',
      increment: 'زیادکردن',
      roledescription: 'خانەی ژمارە',
    },
    pagination: {
      next: 'پەڕەی دواتر',
      nextLabel: 'دواتر',
      prev: 'پەڕەی پێشوو',
      prevLabel: 'پێشتر',
    },
    richTable: {
      noData: 'هیچ داتایەک نییە',
    },
    sidebar: {
      close: 'داخستنی لاتەنیشت',
      toggle: 'گۆڕین',
    },
    spinner: {
      label: 'بارکردن',
    },
    toast: {
      close: 'داخستن',
    },
    toc: {
      title: 'لەم پەڕەیەدا',
    },
  },
})
