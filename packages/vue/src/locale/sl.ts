import { defineLocale } from './defineLocale'

/** Slovenščina (`sl`). Keys left out fall back to English. */
export const sl = defineLocale({
  name: 'Slovenščina',
  code: 'sl',
  messages: {
    alert: {
      close: 'Zapri',
    },
    alertDialog: {
      close: 'Zapri',
    },
    autocomplete: {
      searchPlaceholder: 'Išči…',
    },
    breadcrumbs: {
      label: 'drobtinice',
    },
    carousel: {
      dots: 'Izberite diapozitiv za prikaz',
      goto: 'Pojdi na {slide}',
      next: 'Naprej',
      prev: 'Nazaj',
      roledescription: 'vrtiljak',
      slide: 'diapozitiv',
    },
    closeButton: {
      close: 'Zapri',
    },
    codeBlock: {
      copy: 'Kopiraj kodo v odložišče',
    },
    comboBox: {
      trigger: 'Prikaži možnosti',
    },
    commandPalette: {
      back: 'Nazaj',
      close: 'Zapri',
      noData: 'Ni podatkov',
      placeholder: 'Vpiši ukaz ali išči…',
      results: 'Rezultati',
    },
    dashboardSidebar: {
      close: 'Zapri stransko vrstico',
    },
    dashboardSidebarCollapse: {
      collapse: 'Strni stransko vrstico',
      expand: 'Razširi stransko vrstico',
    },
    dashboardSidebarToggle: {
      close: 'Zapri stransko vrstico',
      open: 'Odpri stransko vrstico',
    },
    drawer: {
      close: 'Zapri',
    },
    dropZone: {
      removeFile: 'Odstrani {filename}',
    },
    error: {
      clear: 'Nazaj na domačo stran',
    },
    header: {
      close: 'Zapri meni',
      open: 'Odpri meni',
    },
    metric: {
      progress: 'napredek',
    },
    modal: {
      close: 'Zapri',
    },
    numberField: {
      decrement: 'Zmanjšaj',
      increment: 'Povišaj',
      roledescription: 'številsko polje',
    },
    numberStepper: {
      decrement: 'Zmanjšaj',
      increment: 'Povišaj',
      roledescription: 'številsko polje',
    },
    pagination: {
      next: 'Naslednja stran',
      nextLabel: 'Naprej',
      prev: 'Prejšnja stran',
      prevLabel: 'Nazaj',
    },
    richTable: {
      noData: 'Ni podatkov',
    },
    sidebar: {
      close: 'Zapri stransko vrstico',
      toggle: 'Preklopi',
    },
    spinner: {
      label: 'nalaganje',
    },
    toast: {
      close: 'Zapri',
    },
    toc: {
      title: 'Na tej strani',
    },
  },
})
