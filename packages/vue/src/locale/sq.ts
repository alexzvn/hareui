import { defineLocale } from './defineLocale'

/** Shqip (`sq`). Keys left out fall back to English. */
export const sq = defineLocale({
  name: 'Shqip',
  code: 'sq',
  messages: {
    alert: {
      close: 'Mbyll',
    },
    alertDialog: {
      close: 'Mbyll',
    },
    autocomplete: {
      searchPlaceholder: 'Kërko…',
    },
    breadcrumbs: {
      label: 'shtegu i navigimit',
    },
    carousel: {
      dots: 'Zgjidh slajdin për të shfaqur',
      goto: 'Shko te slajdi {slide}',
      next: 'Tjetri',
      prev: 'Para',
      roledescription: 'karusel',
      slide: 'slajd',
    },
    closeButton: {
      close: 'Mbyll',
    },
    codeBlock: {
      copy: 'Kopjo kodin në kujtesë',
    },
    comboBox: {
      trigger: 'Shfaq opsionet',
    },
    commandPalette: {
      back: 'Pas',
      close: 'Mbyll',
      noData: 'Nuk ka të dhëna',
      placeholder: 'Shkruaj një komandë ose kërko…',
      results: 'Rezultatet',
    },
    dashboardSidebar: {
      close: 'Mbyll panelin anësor',
    },
    dashboardSidebarCollapse: {
      collapse: 'Palos panelin anësor',
      expand: 'Zgjero panelin anësor',
    },
    dashboardSidebarToggle: {
      close: 'Mbyll panelin anësor',
      open: 'Hap panelin anësor',
    },
    drawer: {
      close: 'Mbyll',
    },
    dropZone: {
      removeFile: 'Hiq {filename}',
    },
    error: {
      clear: 'Kthehu në kryefaqe',
    },
    header: {
      close: 'Mbyll menunë',
      open: 'Hap menunë',
    },
    metric: {
      progress: 'përparimi',
    },
    modal: {
      close: 'Mbyll',
    },
    numberField: {
      decrement: 'Zvogëlo',
      increment: 'Rrit',
      roledescription: 'fushë numerike',
    },
    numberStepper: {
      decrement: 'Zvogëlo',
      increment: 'Rrit',
      roledescription: 'fushë numerike',
    },
    pagination: {
      next: 'Faqja tjetër',
      nextLabel: 'Tjetri',
      prev: 'Faqja e mëparshme',
      prevLabel: 'Para',
    },
    richTable: {
      noData: 'Nuk ka të dhëna',
    },
    sidebar: {
      close: 'Mbyll panelin anësor',
      toggle: 'Ndërro',
    },
    spinner: {
      label: 'po ngarkohet',
    },
    toast: {
      close: 'Mbyll',
    },
    toc: {
      title: 'Në këtë faqe',
    },
  },
})
