import { defineLocale } from './defineLocale'

/** Schweizer Hochdeutsch (`de-CH`). Keys left out fall back to English. */
export const de_ch = defineLocale({
  name: 'Schweizer Hochdeutsch',
  code: 'de-CH',
  messages: {
    alert: {
      close: 'Schliessen',
    },
    alertDialog: {
      close: 'Schliessen',
    },
    autocomplete: {
      searchPlaceholder: 'Suchen…',
    },
    breadcrumbs: {
      label: 'Brotkrümelnavigation',
    },
    carousel: {
      dots: 'Folie zur Anzeige auswählen',
      goto: 'Gehe zu {slide}',
      next: 'Weiter',
      prev: 'Zurück',
      roledescription: 'Karussell',
      slide: 'Folie',
    },
    closeButton: {
      close: 'Schliessen',
    },
    codeBlock: {
      copy: 'Code in die Zwischenablage kopieren',
    },
    comboBox: {
      trigger: 'Optionen anzeigen',
    },
    commandPalette: {
      back: 'Zurück',
      close: 'Schliessen',
      noData: 'Keine Daten',
      placeholder: 'Geben Sie einen Befehl ein oder suchen Sie…',
      results: 'Ergebnisse',
    },
    dashboardSidebar: {
      close: 'Seitenleiste schliessen',
    },
    dashboardSidebarCollapse: {
      collapse: 'Seitenleiste einklappen',
      expand: 'Seitenleiste erweitern',
    },
    dashboardSidebarToggle: {
      close: 'Seitenleiste schliessen',
      open: 'Seitenleiste öffnen',
    },
    drawer: {
      close: 'Schliessen',
    },
    dropZone: {
      removeFile: '{filename} entfernen',
    },
    error: {
      clear: 'Zurück zur Startseite',
    },
    header: {
      close: 'Menü schliessen',
      open: 'Menü öffnen',
    },
    metric: {
      progress: 'Fortschritt',
    },
    modal: {
      close: 'Schliessen',
    },
    numberField: {
      decrement: 'Verringern',
      increment: 'Erhöhen',
      roledescription: 'Zahlenfeld',
    },
    numberStepper: {
      decrement: 'Verringern',
      increment: 'Erhöhen',
      roledescription: 'Zahlenfeld',
    },
    pagination: {
      next: 'Nächste Seite',
      nextLabel: 'Weiter',
      prev: 'Vorherige Seite',
      prevLabel: 'Zurück',
    },
    richTable: {
      noData: 'Keine Daten',
    },
    sidebar: {
      close: 'Seitenleiste schliessen',
      toggle: 'Umschalten',
    },
    spinner: {
      label: 'wird geladen',
    },
    toast: {
      close: 'Schliessen',
    },
    toc: {
      title: 'Auf dieser Seite',
    },
  },
})
