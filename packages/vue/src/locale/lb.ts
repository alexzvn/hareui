import { defineLocale } from './defineLocale'

/** Lëtzebuergesch (`lb`). Keys left out fall back to English. */
export const lb = defineLocale({
  name: 'Lëtzebuergesch',
  code: 'lb',
  messages: {
    alert: {
      close: 'Zoumaachen',
    },
    alertDialog: {
      close: 'Zoumaachen',
    },
    autocomplete: {
      searchPlaceholder: 'Sichen…',
    },
    breadcrumbs: {
      label: 'Navigatiounswee',
    },
    carousel: {
      dots: 'Wielt Dia fir ze weisen',
      goto: "Gitt op d'Slide {slide}",
      next: 'Näch.',
      prev: 'Präz.',
      roledescription: 'Karussell',
      slide: 'Dia',
    },
    closeButton: {
      close: 'Zoumaachen',
    },
    codeBlock: {
      copy: "Code an d'Zwëschspäicher kopéieren",
    },
    comboBox: {
      trigger: 'Optiounen uweisen',
    },
    commandPalette: {
      back: 'Zréck',
      close: 'Zoumaachen',
      noData: 'Keng Donnéeën',
      placeholder: 'Tippt e Befeel oder sicht…',
      results: 'Resultater',
    },
    dashboardSidebar: {
      close: 'Sidebar zoumaachen',
    },
    dashboardSidebarCollapse: {
      collapse: 'Sidebar zouklappen',
      expand: 'Sidebar opklappen',
    },
    dashboardSidebarToggle: {
      close: 'Sidebar zoumaachen',
      open: 'Sidebar opmaachen',
    },
    drawer: {
      close: 'Zoumaachen',
    },
    dropZone: {
      removeFile: '{filename} ewechhuelen',
    },
    error: {
      clear: "Zréck op d'Startsäit",
    },
    header: {
      close: 'Menü zoumaachen',
      open: 'Menü opmaachen',
    },
    metric: {
      progress: 'Fortschrëtt',
    },
    modal: {
      close: 'Zoumaachen',
    },
    numberField: {
      decrement: 'Dekrementéieren',
      increment: 'Inkrementéieren',
      roledescription: 'Zuelefeld',
    },
    numberStepper: {
      decrement: 'Dekrementéieren',
      increment: 'Inkrementéieren',
      roledescription: 'Zuelefeld',
    },
    pagination: {
      next: 'Nächst Säit',
      nextLabel: 'Näch.',
      prev: 'Vireg Säit',
      prevLabel: 'Präz.',
    },
    richTable: {
      noData: 'Keng Donnéeën',
    },
    sidebar: {
      close: 'Sidebar zoumaachen',
      toggle: 'Ëmschalten',
    },
    spinner: {
      label: 'Lueden',
    },
    toast: {
      close: 'Zoumaachen',
    },
    toc: {
      title: 'Op dëser Säit',
    },
  },
})
