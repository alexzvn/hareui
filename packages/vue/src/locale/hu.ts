import { defineLocale } from './defineLocale'

/** Magyar (`hu`). Keys left out fall back to English. */
export const hu = defineLocale({
  name: 'Magyar',
  code: 'hu',
  messages: {
    alert: {
      close: 'Bezárás',
    },
    alertDialog: {
      close: 'Bezárás',
    },
    autocomplete: {
      searchPlaceholder: 'Keresés…',
    },
    breadcrumbs: {
      label: 'navigációs útvonal',
    },
    carousel: {
      dots: 'Válassza ki a megjelenítendő diát',
      goto: 'Ugrás ide {slide}',
      next: 'Következő',
      prev: 'Előző',
      roledescription: 'körhinta',
      slide: 'dia',
    },
    closeButton: {
      close: 'Bezárás',
    },
    codeBlock: {
      copy: 'Kód másolása a vágólapra',
    },
    comboBox: {
      trigger: 'Lehetőségek megjelenítése',
    },
    commandPalette: {
      back: 'Vissza',
      close: 'Bezárás',
      noData: 'Nincs adat',
      placeholder: 'Írjon be egy parancsot vagy keressen…',
      results: 'Eredmények',
    },
    dashboardSidebar: {
      close: 'Oldalsáv bezárása',
    },
    dashboardSidebarCollapse: {
      collapse: 'Oldalsáv összecsukása',
      expand: 'Oldalsáv kinyitása',
    },
    dashboardSidebarToggle: {
      close: 'Oldalsáv bezárása',
      open: 'Oldalsáv megnyitása',
    },
    drawer: {
      close: 'Bezárás',
    },
    dropZone: {
      removeFile: '{filename} eltávolítása',
    },
    error: {
      clear: 'Vissza a főoldalra',
    },
    header: {
      close: 'Menü bezárása',
      open: 'Menü megnyitása',
    },
    metric: {
      progress: 'előrehaladás',
    },
    modal: {
      close: 'Bezárás',
    },
    numberField: {
      decrement: 'Csökkent',
      increment: 'Növel',
      roledescription: 'számmező',
    },
    numberStepper: {
      decrement: 'Csökkent',
      increment: 'Növel',
      roledescription: 'számmező',
    },
    pagination: {
      next: 'Következő oldal',
      nextLabel: 'Következő',
      prev: 'Előző oldal',
      prevLabel: 'Előző',
    },
    richTable: {
      noData: 'Nincs adat',
    },
    sidebar: {
      close: 'Oldalsáv bezárása',
      toggle: 'Váltás',
    },
    spinner: {
      label: 'betöltés',
    },
    toast: {
      close: 'Bezárás',
    },
    toc: {
      title: 'Ezen az oldalon',
    },
  },
})
