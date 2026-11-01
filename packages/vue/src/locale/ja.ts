import { defineLocale } from './defineLocale'

/** 日本語 (`ja`). Keys left out fall back to English. */
export const ja = defineLocale({
  name: '日本語',
  code: 'ja',
  messages: {
    alert: {
      close: '閉じる',
    },
    alertDialog: {
      close: '閉じる',
    },
    autocomplete: {
      searchPlaceholder: '検索…',
    },
    breadcrumbs: {
      label: 'パンくずリスト',
    },
    carousel: {
      dots: '表示するスライドを選択',
      goto: 'スライド {slide} に移動',
      next: '次へ',
      prev: '前へ',
      roledescription: 'カルーセル',
      slide: 'スライド',
    },
    closeButton: {
      close: '閉じる',
    },
    codeBlock: {
      copy: 'コードをクリップボードにコピー',
    },
    comboBox: {
      trigger: 'オプションを表示',
    },
    commandPalette: {
      back: '戻る',
      close: '閉じる',
      noData: 'データがありません',
      placeholder: 'コマンドを入力するか検索…',
      results: '検索結果',
    },
    dashboardSidebar: {
      close: 'サイドバーを閉じる',
    },
    dashboardSidebarCollapse: {
      collapse: 'サイドバーを折りたたむ',
      expand: 'サイドバーを展開',
    },
    dashboardSidebarToggle: {
      close: 'サイドバーを閉じる',
      open: 'サイドバーを開く',
    },
    drawer: {
      close: '閉じる',
    },
    dropZone: {
      removeFile: '{filename}を削除',
    },
    error: {
      clear: 'ホームに戻る',
    },
    header: {
      close: 'メニューを閉じる',
      open: 'メニューを開く',
    },
    metric: {
      progress: '進捗',
    },
    modal: {
      close: '閉じる',
    },
    numberField: {
      decrement: '減らす',
      increment: '増やす',
      roledescription: '数値フィールド',
    },
    numberStepper: {
      decrement: '減らす',
      increment: '増やす',
      roledescription: '数値フィールド',
    },
    pagination: {
      next: '次のページ',
      nextLabel: '次へ',
      prev: '前のページ',
      prevLabel: '前へ',
    },
    richTable: {
      noData: 'データがありません',
    },
    sidebar: {
      close: 'サイドバーを閉じる',
      toggle: '切り替え',
    },
    spinner: {
      label: '読み込み中',
    },
    toast: {
      close: '閉じる',
    },
    toc: {
      title: 'このページ内',
    },
  },
})
