import { defineLocale } from './defineLocale'

/** Dansk (`da`). Keys left out fall back to English. */
export const da = defineLocale({
  name: 'Dansk',
  code: 'da',
  messages: {
    alert: {
      close: 'Luk',
    },
    alertDialog: {
      close: 'Luk',
    },
    autocomplete: {
      searchPlaceholder: 'Søg…',
    },
    breadcrumbs: {
      label: 'brødkrummesti',
    },
    carousel: {
      dots: 'Vælg dias til visning',
      goto: 'Gå til slide {slide}',
      next: 'Næste',
      prev: 'Forrige',
      roledescription: 'karrusel',
      slide: 'dias',
    },
    closeButton: {
      close: 'Luk',
    },
    codeBlock: {
      copy: 'Kopiér kode til udklipsholder',
    },
    comboBox: {
      trigger: 'Vis muligheder',
    },
    commandPalette: {
      back: 'Tilbage',
      close: 'Luk',
      noData: 'Ingen data',
      placeholder: 'Skriv en kommando eller søg…',
      results: 'Resultater',
    },
    dashboardSidebar: {
      close: 'Luk sidemenu',
    },
    dashboardSidebarCollapse: {
      collapse: 'Sammenfold sidemenu',
      expand: 'Udvid sidemenu',
    },
    dashboardSidebarToggle: {
      close: 'Luk sidemenu',
      open: 'Åbn sidemenu',
    },
    drawer: {
      close: 'Luk',
    },
    dropZone: {
      removeFile: 'Fjern {filename}',
    },
    error: {
      clear: 'Tilbage til forsiden',
    },
    header: {
      close: 'Luk menu',
      open: 'Åbn menu',
    },
    metric: {
      progress: 'fremskridt',
    },
    modal: {
      close: 'Luk',
    },
    numberField: {
      decrement: 'Reducer',
      increment: 'Øg',
      roledescription: 'talfelt',
    },
    numberStepper: {
      decrement: 'Reducer',
      increment: 'Øg',
      roledescription: 'talfelt',
    },
    pagination: {
      next: 'Næste side',
      nextLabel: 'Næste',
      prev: 'Forrige side',
      prevLabel: 'Forrige',
    },
    richTable: {
      noData: 'Ingen data',
    },
    sidebar: {
      close: 'Luk sidemenu',
      toggle: 'Skift',
    },
    spinner: {
      label: 'indlæser',
    },
    toast: {
      close: 'Luk',
    },
    toc: {
      title: 'På denne side',
    },
  },
})
