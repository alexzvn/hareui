import { defineLocale } from './defineLocale'

/** Hrvatski (`hr`). Keys left out fall back to English. */
export const hr = defineLocale({
  name: 'Hrvatski',
  code: 'hr',
  messages: {
    alert: {
      close: 'Zatvori',
    },
    alertDialog: {
      close: 'Zatvori',
    },
    autocomplete: {
      searchPlaceholder: 'Pretraživanje…',
    },
    breadcrumbs: {
      label: 'navigacijski put',
    },
    carousel: {
      dots: 'Odaberite slajd za prikaz',
      goto: 'Idi na slajd {slide}',
      next: 'Sljedeći',
      prev: 'Prethodni',
      roledescription: 'vrtuljak',
      slide: 'slajd',
    },
    closeButton: {
      close: 'Zatvori',
    },
    codeBlock: {
      copy: 'Kopiraj kod u međuspremnik',
    },
    comboBox: {
      trigger: 'Prikaži opcije',
    },
    commandPalette: {
      back: 'Natrag',
      close: 'Zatvori',
      noData: 'Nema podataka',
      placeholder: 'Upišite naredbu ili pretraživanje…',
      results: 'Rezultati',
    },
    dashboardSidebar: {
      close: 'Zatvori bočnu traku',
    },
    dashboardSidebarCollapse: {
      collapse: 'Smanji bočnu traku',
      expand: 'Proširi bočnu traku',
    },
    dashboardSidebarToggle: {
      close: 'Zatvori bočnu traku',
      open: 'Otvori bočnu traku',
    },
    drawer: {
      close: 'Zatvori',
    },
    dropZone: {
      removeFile: 'Ukloni {filename}',
    },
    error: {
      clear: 'Natrag na početnu',
    },
    header: {
      close: 'Zatvori izbornik',
      open: 'Otvori izbornik',
    },
    metric: {
      progress: 'napredak',
    },
    modal: {
      close: 'Zatvori',
    },
    numberField: {
      decrement: 'Smanji',
      increment: 'Povećaj',
      roledescription: 'brojčano polje',
    },
    numberStepper: {
      decrement: 'Smanji',
      increment: 'Povećaj',
      roledescription: 'brojčano polje',
    },
    pagination: {
      next: 'Sljedeća stranica',
      nextLabel: 'Sljedeći',
      prev: 'Prethodna stranica',
      prevLabel: 'Prethodni',
    },
    richTable: {
      noData: 'Nema podataka',
    },
    sidebar: {
      close: 'Zatvori bočnu traku',
      toggle: 'Prebaci',
    },
    spinner: {
      label: 'učitavanje',
    },
    toast: {
      close: 'Zatvori',
    },
    toc: {
      title: 'Na ovoj stranici',
    },
  },
})
