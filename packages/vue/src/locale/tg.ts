import { defineLocale } from './defineLocale'

/** Тоҷикӣ (`tg`). Keys left out fall back to English. */
export const tg = defineLocale({
  name: 'Тоҷикӣ',
  code: 'tg',
  messages: {
    alert: {
      close: 'Бастан',
    },
    alertDialog: {
      close: 'Бастан',
    },
    autocomplete: {
      searchPlaceholder: 'Ҷустуҷӯ…',
    },
    breadcrumbs: {
      label: 'занҷираи навигатсия',
    },
    carousel: {
      dots: 'Слайдро барои намоиш интихоб кунед',
      goto: 'Ба слайди {slide} гузаред',
      next: 'Баъдӣ',
      prev: 'Қаблӣ',
      roledescription: 'карусел',
      slide: 'слайд',
    },
    closeButton: {
      close: 'Бастан',
    },
    codeBlock: {
      copy: 'Нусха бардоштан',
    },
    comboBox: {
      trigger: 'Нишон додани имконот',
    },
    commandPalette: {
      back: 'Бозгашт',
      close: 'Бастан',
      noData: 'Маълумот нест',
      placeholder: 'Фармонро нависед ё ҷустуҷӯ кунед…',
      results: 'Натиҷаҳо',
    },
    dashboardSidebar: {
      close: 'Пӯшидан',
    },
    dashboardSidebarCollapse: {
      collapse: 'Кам кардан',
      expand: 'Васеъ кардан',
    },
    dashboardSidebarToggle: {
      close: 'Пӯшидан',
      open: 'Кушодан',
    },
    drawer: {
      close: 'Бастан',
    },
    dropZone: {
      removeFile: '{filename}-ро хориҷ кунед',
    },
    error: {
      clear: 'Тоза кардан',
    },
    header: {
      close: 'Пӯшидан',
      open: 'Кушодан',
    },
    metric: {
      progress: 'пешрафт',
    },
    modal: {
      close: 'Бастан',
    },
    numberField: {
      decrement: 'Кам кардан',
      increment: 'Зиёд кардан',
      roledescription: 'майдони рақамӣ',
    },
    numberStepper: {
      decrement: 'Кам кардан',
      increment: 'Зиёд кардан',
      roledescription: 'майдони рақамӣ',
    },
    pagination: {
      next: 'Саҳифаи баъдӣ',
      nextLabel: 'Баъдӣ',
      prev: 'Саҳифаи қаблӣ',
      prevLabel: 'Қаблӣ',
    },
    richTable: {
      noData: 'Маълумот нест',
    },
    sidebar: {
      close: 'Пӯшидан',
      toggle: 'Иваз кардан',
    },
    spinner: {
      label: 'боргирӣ',
    },
    toast: {
      close: 'Бастан',
    },
    toc: {
      title: 'Мундариҷа',
    },
  },
})
