import { defineLocale } from './defineLocale'

/** Latviešu (`lv`). Keys left out fall back to English. */
export const lv = defineLocale({
  name: 'Latviešu',
  code: 'lv',
  messages: {
    alert: {
      close: 'Aizvērt',
    },
    alertDialog: {
      close: 'Aizvērt',
    },
    autocomplete: {
      searchPlaceholder: 'Meklēt…',
    },
    breadcrumbs: {
      label: 'navigācijas ceļš',
    },
    carousel: {
      dots: 'Izvēlies slaidu, ko rādīt',
      goto: 'Pāriet uz slaidu {slide}',
      next: 'Nākamais',
      prev: 'Iepriekšējais',
      roledescription: 'karuselis',
      slide: 'slaids',
    },
    closeButton: {
      close: 'Aizvērt',
    },
    codeBlock: {
      copy: 'Kopēt kodu',
    },
    comboBox: {
      trigger: 'Rādīt opcijas',
    },
    commandPalette: {
      back: 'Atpakaļ',
      close: 'Aizvērt',
      noData: 'Nav datu',
      placeholder: 'Ievadi komandu vai meklē…',
      results: 'Rezultāti',
    },
    dashboardSidebar: {
      close: 'Aizvērt sānjoslu',
    },
    dashboardSidebarCollapse: {
      collapse: 'Sakļaut sānjoslu',
      expand: 'Izvērst sānjoslu',
    },
    dashboardSidebarToggle: {
      close: 'Aizvērt sānjoslu',
      open: 'Atvērt sānjoslu',
    },
    drawer: {
      close: 'Aizvērt',
    },
    dropZone: {
      removeFile: 'Noņemt {filename}',
    },
    error: {
      clear: 'Atpakaļ uz sākumlapu',
    },
    header: {
      close: 'Aizvērt izvēlni',
      open: 'Atvērt izvēlni',
    },
    metric: {
      progress: 'norise',
    },
    modal: {
      close: 'Aizvērt',
    },
    numberField: {
      decrement: 'Samazināt',
      increment: 'Palielināt',
      roledescription: 'skaitļu lauks',
    },
    numberStepper: {
      decrement: 'Samazināt',
      increment: 'Palielināt',
      roledescription: 'skaitļu lauks',
    },
    pagination: {
      next: 'Nākamā lapa',
      nextLabel: 'Nākamais',
      prev: 'Iepriekšējā lapa',
      prevLabel: 'Iepriekšējais',
    },
    richTable: {
      noData: 'Nav datu',
    },
    sidebar: {
      close: 'Aizvērt sānjoslu',
      toggle: 'Pārslēgt',
    },
    spinner: {
      label: 'ielādē',
    },
    toast: {
      close: 'Aizvērt',
    },
    toc: {
      title: 'Šajā lapā',
    },
  },
})
