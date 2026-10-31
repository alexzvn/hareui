import { defineLocale } from './defineLocale'

/** Íslenska (`is`). Keys left out fall back to English. */
export const is = defineLocale({
  name: 'Íslenska',
  code: 'is',
  messages: {
    alert: {
      close: 'Loka',
    },
    alertDialog: {
      close: 'Loka',
    },
    autocomplete: {
      searchPlaceholder: 'Leita…',
    },
    breadcrumbs: {
      label: 'brauðmolaslóð',
    },
    carousel: {
      dots: 'Veldu mynd til að sýna',
      goto: 'Fara á mynd {slide}',
      next: 'Næsta',
      prev: 'Fyrri',
      roledescription: 'hringekja',
      slide: 'mynd',
    },
    closeButton: {
      close: 'Loka',
    },
    codeBlock: {
      copy: 'Afrita kóða á klippiborð',
    },
    comboBox: {
      trigger: 'Sýna valkosti',
    },
    commandPalette: {
      back: 'Til baka',
      close: 'Loka',
      noData: 'Engin gögn',
      placeholder: 'Sláðu inn skipun eða leitaðu…',
      results: 'Niðurstöður',
    },
    dashboardSidebar: {
      close: 'Loka hliðarstiku',
    },
    dashboardSidebarCollapse: {
      collapse: 'Fella hliðarstiku saman',
      expand: 'Stækka hliðarstiku',
    },
    dashboardSidebarToggle: {
      close: 'Loka hliðarstiku',
      open: 'Opna hliðarstiku',
    },
    drawer: {
      close: 'Loka',
    },
    dropZone: {
      removeFile: 'Fjarlægja {filename}',
    },
    error: {
      clear: 'Til baka heim',
    },
    header: {
      close: 'Loka valmynd',
      open: 'Opna valmynd',
    },
    metric: {
      progress: 'framvinda',
    },
    modal: {
      close: 'Loka',
    },
    numberField: {
      decrement: 'Minnka',
      increment: 'Auka',
      roledescription: 'talnareitur',
    },
    numberStepper: {
      decrement: 'Minnka',
      increment: 'Auka',
      roledescription: 'talnareitur',
    },
    pagination: {
      next: 'Næsta síða',
      nextLabel: 'Næsta',
      prev: 'Fyrri síða',
      prevLabel: 'Fyrri',
    },
    richTable: {
      noData: 'Engin gögn',
    },
    sidebar: {
      close: 'Loka hliðarstiku',
      toggle: 'Skipta',
    },
    spinner: {
      label: 'hleður',
    },
    toast: {
      close: 'Loka',
    },
    toc: {
      title: 'Á þessari síðu',
    },
  },
})
