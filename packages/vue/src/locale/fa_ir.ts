import { defineLocale } from './defineLocale'

/** فارسی (`fa-IR`). Keys left out fall back to English. */
export const fa_ir = defineLocale({
  name: 'فارسی',
  code: 'fa-IR',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'بستن',
    },
    alertDialog: {
      close: 'بستن',
    },
    autocomplete: {
      searchPlaceholder: 'جستجو…',
    },
    breadcrumbs: {
      label: 'مسیر ناوبری',
    },
    carousel: {
      dots: 'اسلاید مورد نظر برای نمایش را انتخاب کنید',
      goto: 'رفتن به اسلاید {slide}',
      next: 'بعدی',
      prev: 'قبلی',
      roledescription: 'کاروسل',
      slide: 'اسلاید',
    },
    closeButton: {
      close: 'بستن',
    },
    codeBlock: {
      copy: 'کپی کد در کلیپ‌بورد',
    },
    comboBox: {
      trigger: 'نمایش گزینه‌ها',
    },
    commandPalette: {
      back: 'بازگشت',
      close: 'بستن',
      noData: 'داده‌ای موجود نیست',
      placeholder: 'یک دستور وارد کنید یا جستجو کنید…',
      results: 'نتایج',
    },
    dashboardSidebar: {
      close: 'بستن نوار کناری',
    },
    dashboardSidebarCollapse: {
      collapse: 'جمع کردن نوار کناری',
      expand: 'گسترش نوار کناری',
    },
    dashboardSidebarToggle: {
      close: 'بستن نوار کناری',
      open: 'باز کردن نوار کناری',
    },
    drawer: {
      close: 'بستن',
    },
    dropZone: {
      removeFile: 'حذف {filename}',
    },
    error: {
      clear: 'بازگشت به صفحه اصلی',
    },
    header: {
      close: 'بستن منو',
      open: 'باز کردن منو',
    },
    metric: {
      progress: 'پیشرفت',
    },
    modal: {
      close: 'بستن',
    },
    numberField: {
      decrement: 'کاهش',
      increment: 'افزایش',
      roledescription: 'فیلد عددی',
    },
    numberStepper: {
      decrement: 'کاهش',
      increment: 'افزایش',
      roledescription: 'فیلد عددی',
    },
    pagination: {
      next: 'صفحه‌ی بعد',
      nextLabel: 'بعدی',
      prev: 'صفحه‌ی قبلی',
      prevLabel: 'قبلی',
    },
    richTable: {
      noData: 'داده‌ای موجود نیست',
    },
    sidebar: {
      close: 'بستن نوار کناری',
      toggle: 'تغییر وضعیت',
    },
    spinner: {
      label: 'در حال بارگذاری',
    },
    toast: {
      close: 'بستن',
    },
    toc: {
      title: 'در این صفحه',
    },
  },
})
