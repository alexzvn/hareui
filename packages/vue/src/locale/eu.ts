import { defineLocale } from './defineLocale'

/** Euskara (`eu`). Keys left out fall back to English. */
export const eu = defineLocale({
  name: 'Euskara',
  code: 'eu',
  messages: {
    alert: {
      close: 'Itxi',
    },
    alertDialog: {
      close: 'Itxi',
    },
    autocomplete: {
      searchPlaceholder: 'Bilatu…',
    },
    breadcrumbs: {
      label: 'nabigazio-bidea',
    },
    carousel: {
      dots: 'Erakutsi beharreko diapositiba aukeratu',
      goto: 'Joan diapositibara {slide}',
      next: 'Hurrengoa',
      prev: 'Aurretikoa',
      roledescription: 'karrusela',
      slide: 'diapositiba',
    },
    closeButton: {
      close: 'Itxi',
    },
    codeBlock: {
      copy: 'Kopiatu kodea clipboard-era',
    },
    comboBox: {
      trigger: 'Erakutsi aukerak',
    },
    commandPalette: {
      back: 'Atzera',
      close: 'Itxi',
      noData: 'Daturik gabe',
      placeholder: 'Idatzi komando bat edo bilatu…',
      results: 'Emaitzak',
    },
    dashboardSidebar: {
      close: 'Alboko barra itxi',
    },
    dashboardSidebarCollapse: {
      collapse: 'Alboko barra itxi',
      expand: 'Alboko barra zabaldu',
    },
    dashboardSidebarToggle: {
      close: 'Alboko barra itxi',
      open: 'Alboko barra zabaldu',
    },
    drawer: {
      close: 'Itxi',
    },
    dropZone: {
      removeFile: 'Ezabatu {filename}',
    },
    error: {
      clear: 'Hasierara itzuli',
    },
    header: {
      close: 'Menua itxi',
      open: 'Menua zabaldu',
    },
    metric: {
      progress: 'aurrerapena',
    },
    modal: {
      close: 'Itxi',
    },
    numberField: {
      decrement: 'Murriztu',
      increment: 'Handitu',
      roledescription: 'zenbaki-eremua',
    },
    numberStepper: {
      decrement: 'Murriztu',
      increment: 'Handitu',
      roledescription: 'zenbaki-eremua',
    },
    pagination: {
      next: 'Hurrengo orria',
      nextLabel: 'Hurrengoa',
      prev: 'Aurreko orria',
      prevLabel: 'Aurretikoa',
    },
    richTable: {
      noData: 'Daturik gabe',
    },
    sidebar: {
      close: 'Alboko barra itxi',
      toggle: 'Txandakatu',
    },
    spinner: {
      label: 'kargatzen',
    },
    toast: {
      close: 'Itxi',
    },
    toc: {
      title: 'Orri honetan',
    },
  },
})
