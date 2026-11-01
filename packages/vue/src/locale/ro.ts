import { defineLocale } from './defineLocale'

/** Română (`ro`). Keys left out fall back to English. */
export const ro = defineLocale({
  name: 'Română',
  code: 'ro',
  messages: {
    alert: {
      close: 'Închide',
    },
    alertDialog: {
      close: 'Închide',
    },
    autocomplete: {
      searchPlaceholder: 'Caută…',
    },
    breadcrumbs: {
      label: 'traseu de navigare',
    },
    carousel: {
      dots: 'Alegeți diapozitivul de afișat',
      goto: 'Mergi la diapozitivul {slide}',
      next: 'Următor',
      prev: 'Anterior',
      roledescription: 'carusel',
      slide: 'diapozitiv',
    },
    closeButton: {
      close: 'Închide',
    },
    codeBlock: {
      copy: 'Copiază codul în clipboard',
    },
    comboBox: {
      trigger: 'Afișează opțiunile',
    },
    commandPalette: {
      back: 'Înapoi',
      close: 'Închide',
      noData: 'Nu există date',
      placeholder: 'Tastează o comandă sau caută…',
      results: 'Rezultate',
    },
    dashboardSidebar: {
      close: 'Închide bara laterală',
    },
    dashboardSidebarCollapse: {
      collapse: 'Restrânge bara laterală',
      expand: 'Extinde bara laterală',
    },
    dashboardSidebarToggle: {
      close: 'Închide bara laterală',
      open: 'Deschide bara laterală',
    },
    drawer: {
      close: 'Închide',
    },
    dropZone: {
      removeFile: 'Elimină {filename}',
    },
    error: {
      clear: 'Înapoi la pagina principală',
    },
    header: {
      close: 'Închide meniul',
      open: 'Deschide meniul',
    },
    metric: {
      progress: 'progres',
    },
    modal: {
      close: 'Închide',
    },
    numberField: {
      decrement: 'Scade',
      increment: 'Crește',
      roledescription: 'câmp numeric',
    },
    numberStepper: {
      decrement: 'Scade',
      increment: 'Crește',
      roledescription: 'câmp numeric',
    },
    pagination: {
      next: 'Pagina următoare',
      nextLabel: 'Următor',
      prev: 'Pagina anterioară',
      prevLabel: 'Anterior',
    },
    richTable: {
      noData: 'Nu există date',
    },
    sidebar: {
      close: 'Închide bara laterală',
      toggle: 'Comutare',
    },
    spinner: {
      label: 'se încarcă',
    },
    toast: {
      close: 'Închide',
    },
    toc: {
      title: 'Pe această pagină',
    },
  },
})
