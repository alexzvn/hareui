import { defineLocale } from './defineLocale'

/** Lietuvių (`lt`). Keys left out fall back to English. */
export const lt = defineLocale({
  name: 'Lietuvių',
  code: 'lt',
  messages: {
    alert: {
      close: 'Uždaryti',
    },
    alertDialog: {
      close: 'Uždaryti',
    },
    autocomplete: {
      searchPlaceholder: 'Ieškoti…',
    },
    breadcrumbs: {
      label: 'naršymo kelias',
    },
    carousel: {
      dots: 'Pasirinkite skaidrę rodymui',
      goto: 'Eiti į skaidrę {slide}',
      next: 'Pirmyn',
      prev: 'Atgal',
      roledescription: 'karuselė',
      slide: 'skaidrė',
    },
    closeButton: {
      close: 'Uždaryti',
    },
    codeBlock: {
      copy: 'Kopijuoti kodą į iškarpinę',
    },
    comboBox: {
      trigger: 'Rodyti parinktis',
    },
    commandPalette: {
      back: 'Atgal',
      close: 'Uždaryti',
      noData: 'Nėra duomenų',
      placeholder: 'Įveskite komandą arba ieškokite…',
      results: 'Rezultatai',
    },
    dashboardSidebar: {
      close: 'Uždaryti šoninę juostą',
    },
    dashboardSidebarCollapse: {
      collapse: 'Suskleisti šoninę juostą',
      expand: 'Išplėsti šoninę juostą',
    },
    dashboardSidebarToggle: {
      close: 'Uždaryti šoninę juostą',
      open: 'Atidaryti šoninę juostą',
    },
    drawer: {
      close: 'Uždaryti',
    },
    dropZone: {
      removeFile: 'Pašalinti {filename}',
    },
    error: {
      clear: 'Grįžti į pradžią',
    },
    header: {
      close: 'Uždaryti meniu',
      open: 'Atidaryti meniu',
    },
    metric: {
      progress: 'eiga',
    },
    modal: {
      close: 'Uždaryti',
    },
    numberField: {
      decrement: 'Sumažinti',
      increment: 'Padidinti',
      roledescription: 'skaičių laukas',
    },
    numberStepper: {
      decrement: 'Sumažinti',
      increment: 'Padidinti',
      roledescription: 'skaičių laukas',
    },
    pagination: {
      next: 'Kitas puslapis',
      nextLabel: 'Pirmyn',
      prev: 'Ankstesnis puslapis',
      prevLabel: 'Atgal',
    },
    richTable: {
      noData: 'Nėra duomenų',
    },
    sidebar: {
      close: 'Uždaryti šoninę juostą',
      toggle: 'Perjungti',
    },
    spinner: {
      label: 'įkeliama',
    },
    toast: {
      close: 'Uždaryti',
    },
    toc: {
      title: 'Šiame puslapyje',
    },
  },
})
