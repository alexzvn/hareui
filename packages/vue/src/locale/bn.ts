import { defineLocale } from './defineLocale'

/** বাংলা (`bn`). Keys left out fall back to English. */
export const bn = defineLocale({
  name: 'বাংলা',
  code: 'bn',
  messages: {
    alert: {
      close: 'বন্ধ করুন',
    },
    alertDialog: {
      close: 'বন্ধ করুন',
    },
    autocomplete: {
      searchPlaceholder: 'অনুসন্ধান করুন…',
    },
    breadcrumbs: {
      label: 'ব্রেডক্রাম্ব',
    },
    carousel: {
      dots: 'প্রদর্শনের জন্য স্লাইড নির্বাচন করুন',
      goto: 'স্লাইড {slide} এ যান',
      next: 'পরবর্তী',
      prev: 'পূর্ববর্তী',
      roledescription: 'ক্যারোসেল',
      slide: 'স্লাইড',
    },
    closeButton: {
      close: 'বন্ধ করুন',
    },
    codeBlock: {
      copy: 'কোড ক্লিপবোর্ডে কপি করুন',
    },
    comboBox: {
      trigger: 'বিকল্পগুলি দেখান',
    },
    commandPalette: {
      back: 'পেছনে',
      close: 'বন্ধ করুন',
      noData: 'কোন তথ্য নেই',
      placeholder: 'কমান্ড টাইপ করুন বা অনুসন্ধান করুন…',
      results: 'ফলাফল',
    },
    dashboardSidebar: {
      close: 'সাইডবার বন্ধ করুন',
    },
    dashboardSidebarCollapse: {
      collapse: 'সাইডবার সংকুচিত করুন',
      expand: 'সাইডবার প্রসারিত করুন',
    },
    dashboardSidebarToggle: {
      close: 'সাইডবার বন্ধ করুন',
      open: 'সাইডবার খুলুন',
    },
    drawer: {
      close: 'বন্ধ করুন',
    },
    dropZone: {
      removeFile: '{filename} সরান',
    },
    error: {
      clear: 'হোম পেজে ফিরে যান',
    },
    header: {
      close: 'মেনু বন্ধ করুন',
      open: 'মেনু খুলুন',
    },
    metric: {
      progress: 'অগ্রগতি',
    },
    modal: {
      close: 'বন্ধ করুন',
    },
    numberField: {
      decrement: 'হ্রাস করুন',
      increment: 'বৃদ্ধি করুন',
      roledescription: 'সংখ্যা ক্ষেত্র',
    },
    numberStepper: {
      decrement: 'হ্রাস করুন',
      increment: 'বৃদ্ধি করুন',
      roledescription: 'সংখ্যা ক্ষেত্র',
    },
    pagination: {
      next: 'পরবর্তী পৃষ্ঠা',
      nextLabel: 'পরবর্তী',
      prev: 'পূর্ববর্তী পৃষ্ঠা',
      prevLabel: 'পূর্ববর্তী',
    },
    richTable: {
      noData: 'কোন তথ্য নেই',
    },
    sidebar: {
      close: 'সাইডবার বন্ধ করুন',
      toggle: 'টগল করুন',
    },
    spinner: {
      label: 'লোড হচ্ছে',
    },
    toast: {
      close: 'বন্ধ করুন',
    },
    toc: {
      title: 'এই পৃষ্ঠায়',
    },
  },
})
