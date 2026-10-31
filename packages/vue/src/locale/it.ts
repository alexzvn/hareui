import { defineLocale } from './defineLocale'

/** Italiano (`it`). Keys left out fall back to English. */
export const it = defineLocale({
  name: 'Italiano',
  code: 'it',
  messages: {
    alert: {
      close: 'Chiudi',
    },
    alertDialog: {
      close: 'Chiudi',
    },
    autocomplete: {
      searchPlaceholder: 'Cerca…',
    },
    breadcrumbs: {
      label: 'percorso di navigazione',
    },
    carousel: {
      dots: 'Scegli diapositiva da visualizzare',
      goto: 'Vai alla slide {slide}',
      next: 'Successiva',
      prev: 'Precedente',
      roledescription: 'carosello',
      slide: 'diapositiva',
    },
    closeButton: {
      close: 'Chiudi',
    },
    codeBlock: {
      copy: 'Copia codice negli appunti',
    },
    comboBox: {
      trigger: 'Mostra opzioni',
    },
    commandPalette: {
      back: 'Indietro',
      close: 'Chiudi',
      noData: 'Nessun dato',
      placeholder: 'Digita un comando o cerca…',
      results: 'Risultati',
    },
    dashboardSidebar: {
      close: 'Chiudi barra laterale',
    },
    dashboardSidebarCollapse: {
      collapse: 'Comprimi barra laterale',
      expand: 'Espandi barra laterale',
    },
    dashboardSidebarToggle: {
      close: 'Chiudi barra laterale',
      open: 'Apri barra laterale',
    },
    drawer: {
      close: 'Chiudi',
    },
    dropZone: {
      removeFile: 'Rimuovi {filename}',
    },
    error: {
      clear: 'Torna alla home',
    },
    header: {
      close: 'Chiudi menu',
      open: 'Apri menu',
    },
    metric: {
      progress: 'avanzamento',
    },
    modal: {
      close: 'Chiudi',
    },
    numberField: {
      decrement: 'Diminuisci',
      increment: 'Aumenta',
      roledescription: 'campo numerico',
    },
    numberStepper: {
      decrement: 'Diminuisci',
      increment: 'Aumenta',
      roledescription: 'campo numerico',
    },
    pagination: {
      next: 'Pagina seguente',
      nextLabel: 'Successiva',
      prev: 'Pagina precedente',
      prevLabel: 'Precedente',
    },
    richTable: {
      noData: 'Nessun dato',
    },
    sidebar: {
      close: 'Chiudi barra laterale',
      toggle: 'Alterna',
    },
    spinner: {
      label: 'caricamento',
    },
    toast: {
      close: 'Chiudi',
    },
    toc: {
      title: 'In questa pagina',
    },
  },
})
