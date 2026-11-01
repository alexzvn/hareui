import { defineLocale } from './defineLocale'

/** English (United Kingdom) (`en-GB`). Keys left out fall back to English. */
export const en_gb = defineLocale({
  name: 'English (United Kingdom)',
  code: 'en-GB',
  messages: {
    alert: {
      close: 'Close',
    },
    alertDialog: {
      close: 'Close',
    },
    autocomplete: {
      searchPlaceholder: 'Search…',
    },
    breadcrumbs: {
      label: 'breadcrumb',
    },
    carousel: {
      goto: 'Go to slide {slide}',
      roledescription: 'carousel',
      slide: 'slide',
    },
    closeButton: {
      close: 'Close',
    },
    commandPalette: {
      back: 'Back',
      close: 'Close',
      noData: 'No data',
      placeholder: 'Type a command or search…',
      results: 'Results',
    },
    dashboardSidebar: {
      close: 'Close sidebar',
    },
    dashboardSidebarCollapse: {
      collapse: 'Collapse sidebar',
      expand: 'Expand sidebar',
    },
    dashboardSidebarToggle: {
      close: 'Close sidebar',
      open: 'Open sidebar',
    },
    drawer: {
      close: 'Close',
    },
    dropZone: {
      removeFile: 'Remove {filename}',
    },
    error: {
      clear: 'Back to home',
    },
    header: {
      close: 'Close menu',
      open: 'Open menu',
    },
    metric: {
      progress: 'progress',
    },
    modal: {
      close: 'Close',
    },
    pagination: {
      next: 'Next page',
      prev: 'Previous page',
    },
    richTable: {
      noData: 'No data',
    },
    sidebar: {
      close: 'Close sidebar',
    },
    spinner: {
      label: 'loading',
    },
    toast: {
      close: 'Close',
    },
    toc: {
      title: 'On this page',
    },
  },
})
