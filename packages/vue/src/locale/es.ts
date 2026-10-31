import { defineLocale } from './defineLocale'

/** Español (`es`). Keys left out fall back to English. */
export const es = defineLocale({
  name: 'Español',
  code: 'es',
  messages: {
    alert: {
      close: 'Cerrar',
    },
    alertDialog: {
      close: 'Cerrar',
    },
    autocomplete: {
      searchPlaceholder: 'Buscar…',
    },
    breadcrumbs: {
      label: 'ruta de navegación',
    },
    carousel: {
      dots: 'Elegir diapositiva a mostrar',
      goto: 'Ir a la diapositiva {slide}',
      next: 'Siguiente',
      prev: 'Anterior',
      roledescription: 'carrusel',
      slide: 'diapositiva',
    },
    closeButton: {
      close: 'Cerrar',
    },
    codeBlock: {
      copy: 'Copiar código al portapapeles',
    },
    comboBox: {
      trigger: 'Mostrar opciones',
    },
    commandPalette: {
      back: 'Atrás',
      close: 'Cerrar',
      noData: 'Sin datos',
      placeholder: 'Escribe un comando o busca…',
      results: 'Resultados',
    },
    dashboardSidebar: {
      close: 'Cerrar barra lateral',
    },
    dashboardSidebarCollapse: {
      collapse: 'Colapsar barra lateral',
      expand: 'Expandir barra lateral',
    },
    dashboardSidebarToggle: {
      close: 'Cerrar barra lateral',
      open: 'Abrir barra lateral',
    },
    drawer: {
      close: 'Cerrar',
    },
    dropZone: {
      removeFile: 'Eliminar {filename}',
    },
    error: {
      clear: 'Volver al inicio',
    },
    header: {
      close: 'Cerrar menú',
      open: 'Abrir menú',
    },
    metric: {
      progress: 'progreso',
    },
    modal: {
      close: 'Cerrar',
    },
    numberField: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'campo numérico',
    },
    numberStepper: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'campo numérico',
    },
    pagination: {
      next: 'Página siguiente',
      nextLabel: 'Siguiente',
      prev: 'Página anterior',
      prevLabel: 'Anterior',
    },
    richTable: {
      noData: 'Sin datos',
    },
    sidebar: {
      close: 'Cerrar barra lateral',
      toggle: 'Alternar',
    },
    spinner: {
      label: 'cargando',
    },
    toast: {
      close: 'Cerrar',
    },
    toc: {
      title: 'En esta página',
    },
  },
})
