import { defineLocale } from './defineLocale'

/** العربية (`ar`). Keys left out fall back to English. */
export const ar = defineLocale({
  name: 'العربية',
  code: 'ar',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'إغلاق',
    },
    alertDialog: {
      close: 'إغلاق',
    },
    autocomplete: {
      searchPlaceholder: 'بحث…',
    },
    breadcrumbs: {
      label: 'مسار التنقل',
    },
    carousel: {
      dots: 'اختر الشريحة المراد عرضها',
      goto: 'الذهاب إلى شريحة {slide}',
      next: 'التالي',
      prev: 'السابق',
      roledescription: 'عرض شرائح',
      slide: 'شريحة',
    },
    closeButton: {
      close: 'إغلاق',
    },
    codeBlock: {
      copy: 'نسخ الكود إلى الحافظة',
    },
    comboBox: {
      trigger: 'إظهار الخيارات',
    },
    commandPalette: {
      back: 'رجوع',
      close: 'إغلاق',
      noData: 'لا توجد بيانات',
      placeholder: 'اكتب أمرًا أو ابحث…',
      results: 'النتائج',
    },
    dashboardSidebar: {
      close: 'إغلاق الشريط الجانبي',
    },
    dashboardSidebarCollapse: {
      collapse: 'طي الشريط الجانبي',
      expand: 'توسيع الشريط الجانبي',
    },
    dashboardSidebarToggle: {
      close: 'إغلاق الشريط الجانبي',
      open: 'فتح الشريط الجانبي',
    },
    drawer: {
      close: 'إغلاق',
    },
    dropZone: {
      removeFile: 'إزالة {filename}',
    },
    error: {
      clear: 'العودة إلى الصفحة الرئيسية',
    },
    header: {
      close: 'إغلاق القائمة',
      open: 'فتح القائمة',
    },
    metric: {
      progress: 'التقدم',
    },
    modal: {
      close: 'إغلاق',
    },
    numberField: {
      decrement: 'تقليل',
      increment: 'زيادة',
      roledescription: 'حقل رقمي',
    },
    numberStepper: {
      decrement: 'تقليل',
      increment: 'زيادة',
      roledescription: 'حقل رقمي',
    },
    pagination: {
      next: 'الصفحة التالية',
      nextLabel: 'التالي',
      prev: 'الصفحة السابقة',
      prevLabel: 'السابق',
    },
    richTable: {
      noData: 'لا توجد بيانات',
    },
    sidebar: {
      close: 'إغلاق الشريط الجانبي',
      toggle: 'تبديل',
    },
    spinner: {
      label: 'جارٍ التحميل',
    },
    toast: {
      close: 'إغلاق',
    },
    toc: {
      title: 'في هذه الصفحة',
    },
  },
})
