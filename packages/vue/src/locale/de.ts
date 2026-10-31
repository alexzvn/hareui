import { defineLocale } from './defineLocale'

/** Deutsch (`de`). Keys left out fall back to English. */
export const de = defineLocale({
  name: 'Deutsch',
  code: 'de',
  messages: {
    alert: {
      close: 'Schließen',
    },
    alertDialog: {
      close: 'Schließen',
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
      close: 'Schließen',
    },
    codeBlock: {
      copy: 'Code in die Zwischenablage kopieren',
    },
    comboBox: {
      trigger: 'Optionen anzeigen',
    },
    commandPalette: {
      back: 'Zurück',
      close: 'Schließen',
      noData: 'Keine Daten',
      placeholder: 'Geben Sie einen Befehl ein oder suchen Sie…',
      results: 'Ergebnisse',
    },
    dashboardSidebar: {
      close: 'Seitenleiste schließen',
    },
    dashboardSidebarCollapse: {
      collapse: 'Seitenleiste einklappen',
      expand: 'Seitenleiste erweitern',
    },
    dashboardSidebarToggle: {
      close: 'Seitenleiste schließen',
      open: 'Seitenleiste öffnen',
    },
    drawer: {
      close: 'Schließen',
    },
    dropZone: {
      removeFile: '{filename} entfernen',
    },
    error: {
      clear: 'Zurück zur Startseite',
    },
    header: {
      close: 'Menü schließen',
      open: 'Menü öffnen',
    },
    metric: {
      progress: 'Fortschritt',
    },
    modal: {
      close: 'Schließen',
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
      close: 'Seitenleiste schließen',
      toggle: 'Umschalten',
    },
    spinner: {
      label: 'wird geladen',
    },
    toast: {
      close: 'Schließen',
    },
    toc: {
      title: 'Auf dieser Seite',
    },
  },
})
