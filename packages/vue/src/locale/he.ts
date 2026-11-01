import { defineLocale } from './defineLocale'

/** עברית (`he`). Keys left out fall back to English. */
export const he = defineLocale({
  name: 'עברית',
  code: 'he',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'סגור',
    },
    alertDialog: {
      close: 'סגור',
    },
    autocomplete: {
      searchPlaceholder: 'חפש…',
    },
    breadcrumbs: {
      label: 'פירורי לחם',
    },
    carousel: {
      dots: 'בחר שקופית להצגה',
      goto: 'מעבר ל {slide}',
      next: 'הבא',
      prev: 'הקודם',
      roledescription: 'קרוסלה',
      slide: 'שקופית',
    },
    closeButton: {
      close: 'סגור',
    },
    codeBlock: {
      copy: 'העתק קוד ללוח',
    },
    comboBox: {
      trigger: 'הצגת אפשרויות',
    },
    commandPalette: {
      back: 'חזור',
      close: 'סגור',
      noData: 'אין נתונים זמינים',
      placeholder: 'הקלד פקודה…',
      results: 'תוצאות',
    },
    dashboardSidebar: {
      close: 'סגור סרגל צד',
    },
    dashboardSidebarCollapse: {
      collapse: 'כווץ סרגל צד',
      expand: 'הרחב סרגל צד',
    },
    dashboardSidebarToggle: {
      close: 'סגור סרגל צד',
      open: 'פתח סרגל צד',
    },
    drawer: {
      close: 'סגור',
    },
    dropZone: {
      removeFile: 'הסר {filename}',
    },
    error: {
      clear: 'חזרה לדף הבית',
    },
    header: {
      close: 'סגור תפריט',
      open: 'פתח תפריט',
    },
    metric: {
      progress: 'התקדמות',
    },
    modal: {
      close: 'סגור',
    },
    numberField: {
      decrement: 'הפחת',
      increment: 'הוסף',
      roledescription: 'שדה מספרי',
    },
    numberStepper: {
      decrement: 'הפחת',
      increment: 'הוסף',
      roledescription: 'שדה מספרי',
    },
    pagination: {
      next: 'עמוד הבא',
      nextLabel: 'הבא',
      prev: 'עמוד הקודם',
      prevLabel: 'הקודם',
    },
    richTable: {
      noData: 'אין נתונים להצגה',
    },
    sidebar: {
      close: 'סגור סרגל צד',
      toggle: 'החלף',
    },
    spinner: {
      label: 'טוען',
    },
    toast: {
      close: 'סגור',
    },
    toc: {
      title: 'בדף זה',
    },
  },
})
