import { defineLocale } from './defineLocale'

/** Galego (`gl`). Keys left out fall back to English. */
export const gl = defineLocale({
  name: 'Galego',
  code: 'gl',
  messages: {
    alert: {
      close: 'Pechar',
    },
    alertDialog: {
      close: 'Pechar',
    },
    autocomplete: {
      searchPlaceholder: 'Buscar…',
    },
    breadcrumbs: {
      label: 'ruta de navegación',
    },
    carousel: {
      dots: 'Escoller diapositiva a amostrar',
      goto: 'Ir á diapositiva {slide}',
      next: 'Seguinte',
      prev: 'Anterior',
      roledescription: 'carrusel',
      slide: 'diapositiva',
    },
    closeButton: {
      close: 'Pechar',
    },
    codeBlock: {
      copy: 'Copiar código ao portapapeis',
    },
    comboBox: {
      trigger: 'Mostrar opcións',
    },
    commandPalette: {
      back: 'Atrás',
      close: 'Pechar',
      noData: 'Sen datos',
      placeholder: 'Escribe un comando ou busca…',
      results: 'Resultados',
    },
    dashboardSidebar: {
      close: 'Pechar barra lateral',
    },
    dashboardSidebarCollapse: {
      collapse: 'Contraer barra lateral',
      expand: 'Despregar barra lateral',
    },
    dashboardSidebarToggle: {
      close: 'Pechar barra lateral',
      open: 'Abrir barra lateral',
    },
    drawer: {
      close: 'Pechar',
    },
    dropZone: {
      removeFile: 'Eliminar {filename}',
    },
    error: {
      clear: 'Volver ao inicio',
    },
    header: {
      close: 'Pechar menú',
      open: 'Abrir menú',
    },
    metric: {
      progress: 'progreso',
    },
    modal: {
      close: 'Pechar',
    },
    numberField: {
      decrement: 'Diminuír',
      increment: 'Aumentar',
      roledescription: 'campo numérico',
    },
    numberStepper: {
      decrement: 'Diminuír',
      increment: 'Aumentar',
      roledescription: 'campo numérico',
    },
    pagination: {
      next: 'Páxina seguinte',
      nextLabel: 'Seguinte',
      prev: 'Páxina anterior',
      prevLabel: 'Anterior',
    },
    richTable: {
      noData: 'Sen datos',
    },
    sidebar: {
      close: 'Pechar barra lateral',
      toggle: 'Alternar',
    },
    spinner: {
      label: 'cargando',
    },
    toast: {
      close: 'Pechar',
    },
    toc: {
      title: 'Nesta páxina',
    },
  },
})
