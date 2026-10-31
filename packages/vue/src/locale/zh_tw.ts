import { defineLocale } from './defineLocale'

/** 繁體中文 (`zh-TW`). Keys left out fall back to English. */
export const zh_tw = defineLocale({
  name: '繁體中文',
  code: 'zh-TW',
  messages: {
    alert: {
      close: '關閉',
    },
    alertDialog: {
      close: '關閉',
    },
    autocomplete: {
      searchPlaceholder: '搜尋…',
    },
    breadcrumbs: {
      label: '導覽路徑',
    },
    carousel: {
      dots: '選擇要顯示的投影片',
      goto: '跳轉到第 {slide} 頁',
      next: '下一頁',
      prev: '上一頁',
      roledescription: '輪播',
      slide: '投影片',
    },
    closeButton: {
      close: '關閉',
    },
    codeBlock: {
      copy: '複製程式碼到剪貼簿',
    },
    comboBox: {
      trigger: '顯示選項',
    },
    commandPalette: {
      back: '返回',
      close: '關閉',
      noData: '沒有資料',
      placeholder: '輸入命令或搜尋…',
      results: '搜尋結果',
    },
    dashboardSidebar: {
      close: '關閉側邊欄',
    },
    dashboardSidebarCollapse: {
      collapse: '收起側邊欄',
      expand: '展開側邊欄',
    },
    dashboardSidebarToggle: {
      close: '關閉側邊欄',
      open: '開啟側邊欄',
    },
    drawer: {
      close: '關閉',
    },
    dropZone: {
      removeFile: '移除 {filename}',
    },
    error: {
      clear: '返回首頁',
    },
    header: {
      close: '關閉選單',
      open: '開啟選單',
    },
    metric: {
      progress: '進度',
    },
    modal: {
      close: '關閉',
    },
    numberField: {
      decrement: '減少',
      increment: '增加',
      roledescription: '數字輸入欄位',
    },
    numberStepper: {
      decrement: '減少',
      increment: '增加',
      roledescription: '數字輸入欄位',
    },
    pagination: {
      next: '下一頁',
      nextLabel: '下一頁',
      prev: '上一頁',
      prevLabel: '上一頁',
    },
    richTable: {
      noData: '沒有資料',
    },
    sidebar: {
      close: '關閉側邊欄',
      toggle: '切換',
    },
    spinner: {
      label: '載入中',
    },
    toast: {
      close: '關閉',
    },
    toc: {
      title: '本頁內容',
    },
  },
})
