import { defineLocale } from './defineLocale'

/** Suomi (`fi`). Keys left out fall back to English. */
export const fi = defineLocale({
  name: 'Suomi',
  code: 'fi',
  messages: {
    alert: {
      close: 'Sulje',
    },
    alertDialog: {
      close: 'Sulje',
    },
    autocomplete: {
      searchPlaceholder: 'Hae…',
    },
    breadcrumbs: {
      label: 'murupolku',
    },
    carousel: {
      dots: 'Valitse näytettävä dia',
      goto: 'Siirry sivulle {slide}',
      next: 'Seuraava',
      prev: 'Edellinen',
      roledescription: 'karuselli',
      slide: 'dia',
    },
    closeButton: {
      close: 'Sulje',
    },
    codeBlock: {
      copy: 'Kopioi koodi leikepöydälle',
    },
    comboBox: {
      trigger: 'Näytä vaihtoehdot',
    },
    commandPalette: {
      back: 'Takaisin',
      close: 'Sulje',
      noData: 'Ei tietoja',
      placeholder: 'Kirjoita komento tai hae…',
      results: 'Tulokset',
    },
    dashboardSidebar: {
      close: 'Sulje sivupalkki',
    },
    dashboardSidebarCollapse: {
      collapse: 'Supista sivupalkki',
      expand: 'Laajenna sivupalkki',
    },
    dashboardSidebarToggle: {
      close: 'Sulje sivupalkki',
      open: 'Avaa sivupalkki',
    },
    drawer: {
      close: 'Sulje',
    },
    dropZone: {
      removeFile: 'Poista {filename}',
    },
    error: {
      clear: 'Takaisin etusivulle',
    },
    header: {
      close: 'Sulje valikko',
      open: 'Avaa valikko',
    },
    metric: {
      progress: 'edistyminen',
    },
    modal: {
      close: 'Sulje',
    },
    numberField: {
      decrement: 'Vähennä',
      increment: 'Kasvata',
      roledescription: 'numerokenttä',
    },
    numberStepper: {
      decrement: 'Vähennä',
      increment: 'Kasvata',
      roledescription: 'numerokenttä',
    },
    pagination: {
      next: 'Seuraava sivu',
      nextLabel: 'Seuraava',
      prev: 'Edellinen sivu',
      prevLabel: 'Edellinen',
    },
    richTable: {
      noData: 'Ei tietoja',
    },
    sidebar: {
      close: 'Sulje sivupalkki',
      toggle: 'Vaihda',
    },
    spinner: {
      label: 'ladataan',
    },
    toast: {
      close: 'Sulje',
    },
    toc: {
      title: 'Tällä sivulla',
    },
  },
})
