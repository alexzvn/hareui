import { defineLocale } from './defineLocale'

/** Հայերեն (`hy`). Keys left out fall back to English. */
export const hy = defineLocale({
  name: 'Հայերեն',
  code: 'hy',
  messages: {
    alert: {
      close: 'Փակել',
    },
    alertDialog: {
      close: 'Փակել',
    },
    autocomplete: {
      searchPlaceholder: 'Որոնում…',
    },
    breadcrumbs: {
      label: 'նավիգացիոն ուղի',
    },
    carousel: {
      dots: 'Ընտրեք ցուցադրելու սլայդը',
      goto: 'Անցնել {slide}-ին',
      next: 'Առաջ',
      prev: 'Հետ',
      roledescription: 'կարուսել',
      slide: 'սլայդ',
    },
    closeButton: {
      close: 'Փակել',
    },
    codeBlock: {
      copy: 'Պատճենել կոդը սեղմատախտակին',
    },
    comboBox: {
      trigger: 'Ցույց տալ տարբերակները',
    },
    commandPalette: {
      back: 'Հետ',
      close: 'Փակել',
      noData: 'Տվյալներ չկան',
      placeholder: 'Մուտքագրեք հրաման կամ որոնեք…',
      results: 'Արդյունքներ',
    },
    dashboardSidebar: {
      close: 'Փակել կողային վահանակը',
    },
    dashboardSidebarCollapse: {
      collapse: 'Կոլապսել կողային վահանակը',
      expand: 'Ընդլայնել կողային վահանակը',
    },
    dashboardSidebarToggle: {
      close: 'Փակել կողային վահանակը',
      open: 'Բացել կողային վահանակը',
    },
    drawer: {
      close: 'Փակել',
    },
    dropZone: {
      removeFile: 'Ջնջել {filename}',
    },
    error: {
      clear: 'Վերադառնալ գլխավոր էջ',
    },
    header: {
      close: 'Փակել ընտրացանկը',
      open: 'Բացել ընտրացանկը',
    },
    metric: {
      progress: 'առաջընթաց',
    },
    modal: {
      close: 'Փակել',
    },
    numberField: {
      decrement: 'Պակասեցնել',
      increment: 'Ավելացնել',
      roledescription: 'թվային դաշտ',
    },
    numberStepper: {
      decrement: 'Պակասեցնել',
      increment: 'Ավելացնել',
      roledescription: 'թվային դաշտ',
    },
    pagination: {
      next: 'Հաջորդ էջ',
      nextLabel: 'Առաջ',
      prev: 'Նախորդ էջ',
      prevLabel: 'Հետ',
    },
    richTable: {
      noData: 'Տվյալներ չկան',
    },
    sidebar: {
      close: 'Փակել կողային վահանակը',
      toggle: 'Փոխարկել',
    },
    spinner: {
      label: 'բեռնում',
    },
    toast: {
      close: 'Փակել',
    },
    toc: {
      title: 'Այս էջում',
    },
  },
})
