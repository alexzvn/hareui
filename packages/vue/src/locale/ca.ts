import { defineLocale } from './defineLocale'

/** Català (`ca`). Keys left out fall back to English. */
export const ca = defineLocale({
  name: 'Català',
  code: 'ca',
  messages: {
    alert: {
      close: 'Tancar',
    },
    alertDialog: {
      close: 'Tancar',
    },
    autocomplete: {
      searchPlaceholder: 'Cerca…',
    },
    breadcrumbs: {
      label: 'ruta de navegació',
    },
    carousel: {
      dots: 'Tria la diapositiva a mostrar',
      goto: 'Anar a la diapositiva {slide}',
      next: 'Següent',
      prev: 'Anterior',
      roledescription: 'carrusel',
      slide: 'diapositiva',
    },
    closeButton: {
      close: 'Tancar',
    },
    codeBlock: {
      copy: 'Copiar codi al portapapers',
    },
    comboBox: {
      trigger: 'Mostra les opcions',
    },
    commandPalette: {
      back: 'Enrere',
      close: 'Tancar',
      noData: 'Sense dades',
      placeholder: 'Escriu una ordre o cerca…',
      results: 'Resultats',
    },
    dashboardSidebar: {
      close: 'Tancar barra lateral',
    },
    dashboardSidebarCollapse: {
      collapse: 'Contraure barra lateral',
      expand: 'Expandir barra lateral',
    },
    dashboardSidebarToggle: {
      close: 'Tancar barra lateral',
      open: 'Obrir barra lateral',
    },
    drawer: {
      close: 'Tancar',
    },
    dropZone: {
      removeFile: 'Eliminar {filename}',
    },
    error: {
      clear: "Tornar a l'inici",
    },
    header: {
      close: 'Tancar menú',
      open: 'Obrir menú',
    },
    metric: {
      progress: 'progrés',
    },
    modal: {
      close: 'Tancar',
    },
    numberField: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'camp numèric',
    },
    numberStepper: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'camp numèric',
    },
    pagination: {
      next: 'Pàgina següent',
      nextLabel: 'Següent',
      prev: 'Pàgina anterior',
      prevLabel: 'Anterior',
    },
    richTable: {
      noData: 'Sense dades',
    },
    sidebar: {
      close: 'Tancar barra lateral',
      toggle: 'Canviar',
    },
    spinner: {
      label: 'carregant',
    },
    toast: {
      close: 'Tancar',
    },
    toc: {
      title: 'En aquesta pàgina',
    },
  },
})
