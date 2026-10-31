import { defineLocale } from './defineLocale'

/** Português (`pt`). Keys left out fall back to English. */
export const pt = defineLocale({
  name: 'Português',
  code: 'pt',
  messages: {
    alert: {
      close: 'Fechar',
    },
    alertDialog: {
      close: 'Fechar',
    },
    autocomplete: {
      searchPlaceholder: 'Pesquisar…',
    },
    breadcrumbs: {
      label: 'trilho de navegação',
    },
    carousel: {
      dots: 'Escolher slide para exibir',
      goto: 'Ir ao diapositivo {slide}',
      next: 'Próximo',
      prev: 'Anterior',
      roledescription: 'carrossel',
      slide: 'diapositivo',
    },
    closeButton: {
      close: 'Fechar',
    },
    codeBlock: {
      copy: 'Copiar código para a área de transferência',
    },
    comboBox: {
      trigger: 'Mostrar opções',
    },
    commandPalette: {
      back: 'Voltar',
      close: 'Fechar',
      noData: 'Sem dados',
      placeholder: 'Digite um comando ou pesquise…',
      results: 'Resultados',
    },
    dashboardSidebar: {
      close: 'Fechar barra lateral',
    },
    dashboardSidebarCollapse: {
      collapse: 'Recolher barra lateral',
      expand: 'Expandir barra lateral',
    },
    dashboardSidebarToggle: {
      close: 'Fechar barra lateral',
      open: 'Abrir barra lateral',
    },
    drawer: {
      close: 'Fechar',
    },
    dropZone: {
      removeFile: 'Remover {filename}',
    },
    error: {
      clear: 'Voltar para a página inicial',
    },
    header: {
      close: 'Fechar menu',
      open: 'Abrir menu',
    },
    metric: {
      progress: 'progresso',
    },
    modal: {
      close: 'Fechar',
    },
    numberField: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'campo numérico',
    },
    numberStepper: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'campo numérico',
    },
    pagination: {
      next: 'Próxima página',
      nextLabel: 'Próximo',
      prev: 'Página anterior',
      prevLabel: 'Anterior',
    },
    richTable: {
      noData: 'Sem dados',
    },
    sidebar: {
      close: 'Fechar barra lateral',
      toggle: 'Alternar',
    },
    spinner: {
      label: 'a carregar',
    },
    toast: {
      close: 'Fechar',
    },
    toc: {
      title: 'Nesta página',
    },
  },
})
