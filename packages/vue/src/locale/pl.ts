import { defineLocale } from './defineLocale'

/** Polski (`pl`). Keys left out fall back to English. */
export const pl = defineLocale({
  name: 'Polski',
  code: 'pl',
  messages: {
    alert: {
      close: 'Zamknij',
    },
    alertDialog: {
      close: 'Zamknij',
    },
    autocomplete: {
      searchPlaceholder: 'Szukaj…',
    },
    breadcrumbs: {
      label: 'ścieżka nawigacji',
    },
    carousel: {
      dots: 'Wybierz slajd do wyświetlenia',
      goto: 'Idź do {slide}',
      next: 'Następny',
      prev: 'Poprzedni',
      roledescription: 'karuzela',
      slide: 'slajd',
    },
    closeButton: {
      close: 'Zamknij',
    },
    codeBlock: {
      copy: 'Kopiuj kod do schowka',
    },
    comboBox: {
      trigger: 'Pokaż opcje',
    },
    commandPalette: {
      back: 'Wstecz',
      close: 'Zamknij',
      noData: 'Brak danych',
      placeholder: 'Wpisz polecenie lub wyszukaj…',
      results: 'Wyniki',
    },
    dashboardSidebar: {
      close: 'Zamknij pasek boczny',
    },
    dashboardSidebarCollapse: {
      collapse: 'Zwiń pasek boczny',
      expand: 'Rozwiń pasek boczny',
    },
    dashboardSidebarToggle: {
      close: 'Zamknij pasek boczny',
      open: 'Otwórz pasek boczny',
    },
    drawer: {
      close: 'Zamknij',
    },
    dropZone: {
      removeFile: 'Usuń {filename}',
    },
    error: {
      clear: 'Powrót do strony głównej',
    },
    header: {
      close: 'Zamknij menu',
      open: 'Otwórz menu',
    },
    metric: {
      progress: 'postęp',
    },
    modal: {
      close: 'Zamknij',
    },
    numberField: {
      decrement: 'Zmniejsz',
      increment: 'Zwiększ',
      roledescription: 'pole liczbowe',
    },
    numberStepper: {
      decrement: 'Zmniejsz',
      increment: 'Zwiększ',
      roledescription: 'pole liczbowe',
    },
    pagination: {
      next: 'Następna strona',
      nextLabel: 'Następny',
      prev: 'Poprzednia strona',
      prevLabel: 'Poprzedni',
    },
    richTable: {
      noData: 'Brak danych',
    },
    sidebar: {
      close: 'Zamknij pasek boczny',
      toggle: 'Przełącz',
    },
    spinner: {
      label: 'ładowanie',
    },
    toast: {
      close: 'Zamknij',
    },
    toc: {
      title: 'Na tej stronie',
    },
  },
})
