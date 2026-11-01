import { defineLocale } from './defineLocale'

/** ქართული (`ka`). Keys left out fall back to English. */
export const ka = defineLocale({
  name: 'ქართული',
  code: 'ka',
  messages: {
    alert: {
      close: 'დახურვა',
    },
    alertDialog: {
      close: 'დახურვა',
    },
    autocomplete: {
      searchPlaceholder: 'ძიება…',
    },
    breadcrumbs: {
      label: 'ნავიგაციის ბილიკი',
    },
    carousel: {
      dots: 'აირჩიეთ სლაიდი საჩვენებლად',
      goto: 'გადასვლა სლაიდ {slide}-ზე',
      next: 'შემდეგი',
      prev: 'წინა',
      roledescription: 'კარუსელი',
      slide: 'სლაიდი',
    },
    closeButton: {
      close: 'დახურვა',
    },
    codeBlock: {
      copy: 'კოდის კოპირება ბუფერში',
    },
    comboBox: {
      trigger: 'ვარიანტების ჩვენება',
    },
    commandPalette: {
      back: 'უკან',
      close: 'დახურვა',
      noData: 'მონაცემები არ არის',
      placeholder: 'ჩაწერეთ ბრძანება ან ძიება…',
      results: 'შედეგები',
    },
    dashboardSidebar: {
      close: 'გვერდითი ზოლის დახურვა',
    },
    dashboardSidebarCollapse: {
      collapse: 'გვერდითი ზოლის ჩაკეცვა',
      expand: 'გვერდითი ზოლის გაშლა',
    },
    dashboardSidebarToggle: {
      close: 'გვერდითი ზოლის დახურვა',
      open: 'გვერდითი ზოლის გახსნა',
    },
    drawer: {
      close: 'დახურვა',
    },
    dropZone: {
      removeFile: 'მოაშორე {filename}',
    },
    error: {
      clear: 'მთავარზე დაბრუნება',
    },
    header: {
      close: 'მენიუს დახურვა',
      open: 'მენიუს გახსნა',
    },
    metric: {
      progress: 'პროგრესი',
    },
    modal: {
      close: 'დახურვა',
    },
    numberField: {
      decrement: 'დაკლება',
      increment: 'დამატება',
      roledescription: 'რიცხვითი ველი',
    },
    numberStepper: {
      decrement: 'დაკლება',
      increment: 'დამატება',
      roledescription: 'რიცხვითი ველი',
    },
    pagination: {
      next: 'შემდეგი გვერდი',
      nextLabel: 'შემდეგი',
      prev: 'წინა გვერდი',
      prevLabel: 'წინა',
    },
    richTable: {
      noData: 'მონაცემები არ არის',
    },
    sidebar: {
      close: 'გვერდითი ზოლის დახურვა',
      toggle: 'გადართვა',
    },
    spinner: {
      label: 'იტვირთება',
    },
    toast: {
      close: 'დახურვა',
    },
    toc: {
      title: 'ამ გვერდზე',
    },
  },
})
