import { defineLocale } from './defineLocale'

/** Nederlands (`nl`). Keys left out fall back to English. */
export const nl = defineLocale({
  name: 'Nederlands',
  code: 'nl',
  messages: {
    alert: {
      close: 'Sluiten',
    },
    alertDialog: {
      close: 'Sluiten',
    },
    autocomplete: {
      searchPlaceholder: 'Zoeken…',
    },
    breadcrumbs: {
      label: 'kruimelpad',
    },
    carousel: {
      dots: 'Kies dia om weer te geven',
      goto: 'Ga naar dia {slide}',
      next: 'Volgende',
      prev: 'Vorige',
      roledescription: 'carrousel',
      slide: 'dia',
    },
    closeButton: {
      close: 'Sluiten',
    },
    codeBlock: {
      copy: 'Code naar klembord kopiëren',
    },
    comboBox: {
      trigger: 'Opties tonen',
    },
    commandPalette: {
      back: 'Terug',
      close: 'Sluiten',
      noData: 'Geen gegevens',
      placeholder: 'Typ een commando of zoek…',
      results: 'Resultaten',
    },
    dashboardSidebar: {
      close: 'Zijbalk sluiten',
    },
    dashboardSidebarCollapse: {
      collapse: 'Zijbalk invouwen',
      expand: 'Zijbalk uitvouwen',
    },
    dashboardSidebarToggle: {
      close: 'Zijbalk sluiten',
      open: 'Zijbalk openen',
    },
    drawer: {
      close: 'Sluiten',
    },
    dropZone: {
      removeFile: '{filename} verwijderen',
    },
    error: {
      clear: 'Terug naar home',
    },
    header: {
      close: 'Menu sluiten',
      open: 'Menu openen',
    },
    metric: {
      progress: 'voortgang',
    },
    modal: {
      close: 'Sluiten',
    },
    numberField: {
      decrement: 'Verlagen',
      increment: 'Verhogen',
      roledescription: 'getalveld',
    },
    numberStepper: {
      decrement: 'Verlagen',
      increment: 'Verhogen',
      roledescription: 'getalveld',
    },
    pagination: {
      next: 'Volgende pagina',
      nextLabel: 'Volgende',
      prev: 'Vorige pagina',
      prevLabel: 'Vorige',
    },
    richTable: {
      noData: 'Geen gegevens',
    },
    sidebar: {
      close: 'Zijbalk sluiten',
      toggle: 'Schakelen',
    },
    spinner: {
      label: 'laden',
    },
    toast: {
      close: 'Sluiten',
    },
    toc: {
      title: 'Op deze pagina',
    },
  },
})
