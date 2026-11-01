import { defineLocale } from './defineLocale'

/** 简体中文 (`zh-CN`). Keys left out fall back to English. */
export const zh_cn = defineLocale({
  name: '简体中文',
  code: 'zh-CN',
  messages: {
    alert: {
      close: '关闭',
    },
    alertDialog: {
      close: '关闭',
    },
    autocomplete: {
      searchPlaceholder: '搜索…',
    },
    breadcrumbs: {
      label: '面包屑导航',
    },
    carousel: {
      dots: '选择要显示的幻灯片',
      goto: '跳转到第 {slide} 页',
      next: '下一页',
      prev: '上一页',
      roledescription: '轮播',
      slide: '幻灯片',
    },
    closeButton: {
      close: '关闭',
    },
    codeBlock: {
      copy: '复制代码到剪贴板',
    },
    comboBox: {
      trigger: '显示选项',
    },
    commandPalette: {
      back: '返回',
      close: '关闭',
      noData: '没有数据',
      placeholder: '输入命令或搜索…',
      results: '搜索结果',
    },
    dashboardSidebar: {
      close: '关闭侧边栏',
    },
    dashboardSidebarCollapse: {
      collapse: '收起侧边栏',
      expand: '展开侧边栏',
    },
    dashboardSidebarToggle: {
      close: '关闭侧边栏',
      open: '打开侧边栏',
    },
    drawer: {
      close: '关闭',
    },
    dropZone: {
      removeFile: '删除 {filename}',
    },
    error: {
      clear: '返回首页',
    },
    header: {
      close: '关闭菜单',
      open: '打开菜单',
    },
    metric: {
      progress: '进度',
    },
    modal: {
      close: '关闭',
    },
    numberField: {
      decrement: '减少',
      increment: '增加',
      roledescription: '数字输入框',
    },
    numberStepper: {
      decrement: '减少',
      increment: '增加',
      roledescription: '数字输入框',
    },
    pagination: {
      next: '下一页',
      nextLabel: '下一页',
      prev: '上一页',
      prevLabel: '上一页',
    },
    richTable: {
      noData: '没有数据',
    },
    sidebar: {
      close: '关闭侧边栏',
      toggle: '切换',
    },
    spinner: {
      label: '加载中',
    },
    toast: {
      close: '关闭',
    },
    toc: {
      title: '本页内容',
    },
  },
})
