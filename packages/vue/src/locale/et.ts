import { defineLocale } from './defineLocale'

/** Eesti (`et`). Keys left out fall back to English. */
export const et = defineLocale({
  name: 'Eesti',
  code: 'et',
  messages: {
    alert: {
      close: 'Sulge',
    },
    alertDialog: {
      close: 'Sulge',
    },
    autocomplete: {
      searchPlaceholder: 'Otsi…',
    },
    breadcrumbs: {
      label: 'navigeerimisrada',
    },
    carousel: {
      dots: 'Valige kuvatav slaid',
      goto: 'Mine slaidile {slide}',
      next: 'Järg',
      prev: 'Eel',
      roledescription: 'karussell',
      slide: 'slaid',
    },
    closeButton: {
      close: 'Sulge',
    },
    codeBlock: {
      copy: 'Kopeeri kood lõikelauale',
    },
    comboBox: {
      trigger: 'Kuva valikud',
    },
    commandPalette: {
      back: 'Tagasi',
      close: 'Sulge',
      noData: 'Pole andmeid',
      placeholder: 'Sisesta käsk või otsi…',
      results: 'Tulemused',
    },
    dashboardSidebar: {
      close: 'Sulge külgriba',
    },
    dashboardSidebarCollapse: {
      collapse: 'Ahenda külgriba',
      expand: 'Laienda külgriba',
    },
    dashboardSidebarToggle: {
      close: 'Sulge külgriba',
      open: 'Ava külgriba',
    },
    drawer: {
      close: 'Sulge',
    },
    dropZone: {
      removeFile: 'Eemalda {filename}',
    },
    error: {
      clear: 'Tagasi avalehele',
    },
    header: {
      close: 'Sulge menüü',
      open: 'Ava menüü',
    },
    metric: {
      progress: 'edenemine',
    },
    modal: {
      close: 'Sulge',
    },
    numberField: {
      decrement: 'Vähenda',
      increment: 'Suurenda',
      roledescription: 'numbriväli',
    },
    numberStepper: {
      decrement: 'Vähenda',
      increment: 'Suurenda',
      roledescription: 'numbriväli',
    },
    pagination: {
      next: 'Järgmine lehekülg',
      nextLabel: 'Järg',
      prev: 'Eelmine lehekülg',
      prevLabel: 'Eel',
    },
    richTable: {
      noData: 'Pole andmeid',
    },
    sidebar: {
      close: 'Sulge külgriba',
      toggle: 'Lülita',
    },
    spinner: {
      label: 'laadimine',
    },
    toast: {
      close: 'Sulge',
    },
    toc: {
      title: 'Sellel lehel',
    },
  },
})
