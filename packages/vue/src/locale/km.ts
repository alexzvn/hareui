import { defineLocale } from './defineLocale'

/** ភាសាខ្មែរ (`km`). Keys left out fall back to English. */
export const km = defineLocale({
  name: 'ភាសាខ្មែរ',
  code: 'km',
  messages: {
    alert: {
      close: 'បិទ',
    },
    alertDialog: {
      close: 'បិទ',
    },
    autocomplete: {
      searchPlaceholder: 'ស្វែងរក…',
    },
    breadcrumbs: {
      label: 'ផ្លូវរុករក',
    },
    carousel: {
      dots: 'ជ្រើសរើស​ស្លាយ​ដើម្បី​បង្ហាញ',
      goto: 'ឡើងទៅស្លាយ {slide}',
      next: 'បន្ទាប់',
      prev: 'មុន',
      roledescription: 'ការ៉ូសែល',
      slide: 'ស្លាយ',
    },
    closeButton: {
      close: 'បិទ',
    },
    codeBlock: {
      copy: 'ចម្លងកូដទៅក្ដារតម្បៀតខ្ទាស់',
    },
    comboBox: {
      trigger: 'បង្ហាញជម្រើស',
    },
    commandPalette: {
      back: 'ត្រឡប់',
      close: 'បិទ',
      noData: 'មិនមានទិន្នន័យ',
      placeholder: 'វាយពាក្យបញ្ជា ឬស្វែងរក…',
      results: 'លទ្ធផល',
    },
    dashboardSidebar: {
      close: 'បិទបារចំហៀង',
    },
    dashboardSidebarCollapse: {
      collapse: 'បង្រួមបារចំហៀង',
      expand: 'ពង្រីកបារចំហៀង',
    },
    dashboardSidebarToggle: {
      close: 'បិទបារចំហៀង',
      open: 'បើកបារចំហៀង',
    },
    drawer: {
      close: 'បិទ',
    },
    dropZone: {
      removeFile: 'លុប {filename}',
    },
    error: {
      clear: 'ត្រឡប់ទៅទំព័រដើម',
    },
    header: {
      close: 'បិទម៉ឺនុយ',
      open: 'បើកម៉ឺនុយ',
    },
    metric: {
      progress: 'វឌ្ឍនភាព',
    },
    modal: {
      close: 'បិទ',
    },
    numberField: {
      decrement: 'បន្ថយ',
      increment: 'បង្កើន',
      roledescription: 'វាលលេខ',
    },
    numberStepper: {
      decrement: 'បន្ថយ',
      increment: 'បង្កើន',
      roledescription: 'វាលលេខ',
    },
    pagination: {
      next: 'ទំព័របន្ទាប់',
      nextLabel: 'បន្ទាប់',
      prev: 'ទំព័រមុន',
      prevLabel: 'មុន',
    },
    richTable: {
      noData: 'មិនមានទិន្នន័យ',
    },
    sidebar: {
      close: 'បិទបារចំហៀង',
      toggle: 'បិទ/បើក',
    },
    spinner: {
      label: 'កំពុងផ្ទុក',
    },
    toast: {
      close: 'បិទ',
    },
    toc: {
      title: 'នៅលើទំព័រនេះ',
    },
  },
})
