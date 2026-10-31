import { defineLocale } from './defineLocale'

/** Čeština (`cs`). Keys left out fall back to English. */
export const cs = defineLocale({
  name: 'Čeština',
  code: 'cs',
  messages: {
    alert: {
      close: 'Zavřít',
    },
    alertDialog: {
      close: 'Zavřít',
    },
    autocomplete: {
      searchPlaceholder: 'Hledat…',
    },
    breadcrumbs: {
      label: 'drobečková navigace',
    },
    carousel: {
      dots: 'Vyberte snímek k zobrazení',
      goto: 'Přejít na {slide}',
      next: 'Další',
      prev: 'Předchozí',
      roledescription: 'karusel',
      slide: 'snímek',
    },
    closeButton: {
      close: 'Zavřít',
    },
    codeBlock: {
      copy: 'Kopírovat kód do schránky',
    },
    comboBox: {
      trigger: 'Zobrazit možnosti',
    },
    commandPalette: {
      back: 'Zpět',
      close: 'Zavřít',
      noData: 'Žádná data',
      placeholder: 'Zadejte příkaz nebo hledejte…',
      results: 'Výsledky',
    },
    dashboardSidebar: {
      close: 'Zavřít postranní panel',
    },
    dashboardSidebarCollapse: {
      collapse: 'Sbalit postranní panel',
      expand: 'Rozbalit postranní panel',
    },
    dashboardSidebarToggle: {
      close: 'Zavřít postranní panel',
      open: 'Otevřít postranní panel',
    },
    drawer: {
      close: 'Zavřít',
    },
    dropZone: {
      removeFile: 'Odebrat {filename}',
    },
    error: {
      clear: 'Zpět na úvod',
    },
    header: {
      close: 'Zavřít menu',
      open: 'Otevřít menu',
    },
    metric: {
      progress: 'průběh',
    },
    modal: {
      close: 'Zavřít',
    },
    numberField: {
      decrement: 'Snížit',
      increment: 'Zvýšit',
      roledescription: 'číselné pole',
    },
    numberStepper: {
      decrement: 'Snížit',
      increment: 'Zvýšit',
      roledescription: 'číselné pole',
    },
    pagination: {
      next: 'Další stránka',
      nextLabel: 'Další',
      prev: 'Předchozí stránka',
      prevLabel: 'Předchozí',
    },
    richTable: {
      noData: 'Žádná data',
    },
    sidebar: {
      close: 'Zavřít postranní panel',
      toggle: 'Přepnout',
    },
    spinner: {
      label: 'načítání',
    },
    toast: {
      close: 'Zavřít',
    },
    toc: {
      title: 'Na této stránce',
    },
  },
})
