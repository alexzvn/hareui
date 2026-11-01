import { defineLocale } from './defineLocale'

/** Norsk Bokmål (`nb-NO`). Keys left out fall back to English. */
export const nb_no = defineLocale({
  name: 'Norsk Bokmål',
  code: 'nb-NO',
  messages: {
    alert: {
      close: 'Lukk',
    },
    alertDialog: {
      close: 'Lukk',
    },
    autocomplete: {
      searchPlaceholder: 'Søk…',
    },
    breadcrumbs: {
      label: 'brødsmulesti',
    },
    carousel: {
      dots: 'Velg lysbilde som skal vises',
      goto: 'Gå til lysbilde {slide}',
      next: 'Neste',
      prev: 'Forrige',
      roledescription: 'karusell',
      slide: 'lysbilde',
    },
    closeButton: {
      close: 'Lukk',
    },
    codeBlock: {
      copy: 'Kopier kode til utklippstavle',
    },
    comboBox: {
      trigger: 'Vis alternativer',
    },
    commandPalette: {
      back: 'Tilbake',
      close: 'Lukk',
      noData: 'Ingen data',
      placeholder: 'Skriv inn en kommando eller søk…',
      results: 'Resultater',
    },
    dashboardSidebar: {
      close: 'Lukk sidepanel',
    },
    dashboardSidebarCollapse: {
      collapse: 'Skjul sidepanel',
      expand: 'Utvid sidepanel',
    },
    dashboardSidebarToggle: {
      close: 'Lukk sidepanel',
      open: 'Åpne sidepanel',
    },
    drawer: {
      close: 'Lukk',
    },
    dropZone: {
      removeFile: 'Fjern {filename}',
    },
    error: {
      clear: 'Tilbake til forsiden',
    },
    header: {
      close: 'Lukk meny',
      open: 'Åpne meny',
    },
    metric: {
      progress: 'fremdrift',
    },
    modal: {
      close: 'Lukk',
    },
    numberField: {
      decrement: 'Reduser',
      increment: 'Øk',
      roledescription: 'tallfelt',
    },
    numberStepper: {
      decrement: 'Reduser',
      increment: 'Øk',
      roledescription: 'tallfelt',
    },
    pagination: {
      next: 'Neste side',
      nextLabel: 'Neste',
      prev: 'Forrige side',
      prevLabel: 'Forrige',
    },
    richTable: {
      noData: 'Ingen data',
    },
    sidebar: {
      close: 'Lukk sidepanel',
      toggle: 'Veksle',
    },
    spinner: {
      label: 'laster inn',
    },
    toast: {
      close: 'Lukk',
    },
    toc: {
      title: 'På denne siden',
    },
  },
})
