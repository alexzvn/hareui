import { defineLocale } from './defineLocale'

/** Svenska (`sv`). Keys left out fall back to English. */
export const sv = defineLocale({
  name: 'Svenska',
  code: 'sv',
  messages: {
    alert: {
      close: 'Stäng',
    },
    alertDialog: {
      close: 'Stäng',
    },
    autocomplete: {
      searchPlaceholder: 'Sök…',
    },
    breadcrumbs: {
      label: 'brödsmulor',
    },
    carousel: {
      dots: 'Välj bild att visa',
      goto: 'Gå till {slide}',
      next: 'Nästa',
      prev: 'Föregående',
      roledescription: 'karusell',
      slide: 'bild',
    },
    closeButton: {
      close: 'Stäng',
    },
    codeBlock: {
      copy: 'Kopiera kod till urklipp',
    },
    comboBox: {
      trigger: 'Visa alternativ',
    },
    commandPalette: {
      back: 'Tillbaka',
      close: 'Stäng',
      noData: 'Inga data',
      placeholder: 'Skriv ett kommando eller sök…',
      results: 'Resultat',
    },
    dashboardSidebar: {
      close: 'Stäng sidofältet',
    },
    dashboardSidebarCollapse: {
      collapse: 'Minimera sidofältet',
      expand: 'Expandera sidofältet',
    },
    dashboardSidebarToggle: {
      close: 'Stäng sidofältet',
      open: 'Öppna sidofältet',
    },
    drawer: {
      close: 'Stäng',
    },
    dropZone: {
      removeFile: 'Ta bort {filename}',
    },
    error: {
      clear: 'Tillbaka till startsidan',
    },
    header: {
      close: 'Stäng menyn',
      open: 'Öppna menyn',
    },
    metric: {
      progress: 'förlopp',
    },
    modal: {
      close: 'Stäng',
    },
    numberField: {
      decrement: 'Minska',
      increment: 'Öka',
      roledescription: 'sifferfält',
    },
    numberStepper: {
      decrement: 'Minska',
      increment: 'Öka',
      roledescription: 'sifferfält',
    },
    pagination: {
      next: 'Nästa sida',
      nextLabel: 'Nästa',
      prev: 'Föregående sida',
      prevLabel: 'Föregående',
    },
    richTable: {
      noData: 'Inga data',
    },
    sidebar: {
      close: 'Stäng sidofältet',
      toggle: 'Växla',
    },
    spinner: {
      label: 'laddar',
    },
    toast: {
      close: 'Stäng',
    },
    toc: {
      title: 'På denna sida',
    },
  },
})
