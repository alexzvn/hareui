import { defineLocale } from './defineLocale'

/** Slovenčina (`sk`). Keys left out fall back to English. */
export const sk = defineLocale({
  name: 'Slovenčina',
  code: 'sk',
  messages: {
    alert: {
      close: 'Zatvoriť',
    },
    alertDialog: {
      close: 'Zatvoriť',
    },
    autocomplete: {
      searchPlaceholder: 'Hľadať…',
    },
    breadcrumbs: {
      label: 'navigačná cesta',
    },
    carousel: {
      dots: 'Vyberte snímku na zobrazenie',
      goto: 'Prejsť na {slide}',
      next: 'Nasledujúci',
      prev: 'Predchádzajúci',
      roledescription: 'karusel',
      slide: 'snímka',
    },
    closeButton: {
      close: 'Zatvoriť',
    },
    codeBlock: {
      copy: 'Kopírovať kód do schránky',
    },
    comboBox: {
      trigger: 'Zobraziť možnosti',
    },
    commandPalette: {
      back: 'Späť',
      close: 'Zavrieť',
      noData: 'Žiadne dáta',
      placeholder: 'Zadajte príkaz alebo vyhľadajte…',
      results: 'Výsledky',
    },
    dashboardSidebar: {
      close: 'Zatvoriť bočný panel',
    },
    dashboardSidebarCollapse: {
      collapse: 'Zbaliť bočný panel',
      expand: 'Rozbaliť bočný panel',
    },
    dashboardSidebarToggle: {
      close: 'Zatvoriť bočný panel',
      open: 'Otvoriť bočný panel',
    },
    drawer: {
      close: 'Zatvoriť',
    },
    dropZone: {
      removeFile: 'Odobrať {filename}',
    },
    error: {
      clear: 'Späť na domovskú stránku',
    },
    header: {
      close: 'Zatvoriť menu',
      open: 'Otvoriť menu',
    },
    metric: {
      progress: 'priebeh',
    },
    modal: {
      close: 'Zatvoriť',
    },
    numberField: {
      decrement: 'Znížiť',
      increment: 'Zvýšiť',
      roledescription: 'číselné pole',
    },
    numberStepper: {
      decrement: 'Znížiť',
      increment: 'Zvýšiť',
      roledescription: 'číselné pole',
    },
    pagination: {
      next: 'Ďalšia stránka',
      nextLabel: 'Nasledujúci',
      prev: 'Predchádzajúca stránka',
      prevLabel: 'Predchádzajúci',
    },
    richTable: {
      noData: 'Žiadne dáta',
    },
    sidebar: {
      close: 'Zatvoriť bočný panel',
      toggle: 'Prepnúť',
    },
    spinner: {
      label: 'načítava sa',
    },
    toast: {
      close: 'Zatvoriť',
    },
    toc: {
      title: 'Na tejto stránke',
    },
  },
})
