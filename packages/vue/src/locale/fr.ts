import { defineLocale } from './defineLocale'

/** Français (`fr`). Keys left out fall back to English. */
export const fr = defineLocale({
  name: 'Français',
  code: 'fr',
  messages: {
    alert: {
      close: 'Fermer',
    },
    alertDialog: {
      close: 'Fermer',
    },
    autocomplete: {
      searchPlaceholder: 'Rechercher…',
    },
    breadcrumbs: {
      label: "fil d'Ariane",
    },
    carousel: {
      dots: 'Choisir la diapositive à afficher',
      goto: 'Aller à {slide}',
      next: 'Suivant',
      prev: 'Précédent',
      roledescription: 'carrousel',
      slide: 'diapositive',
    },
    closeButton: {
      close: 'Fermer',
    },
    codeBlock: {
      copy: 'Copier le code dans le presse-papiers',
    },
    comboBox: {
      trigger: 'Afficher les options',
    },
    commandPalette: {
      back: 'Retour',
      close: 'Fermer',
      noData: 'Aucune donnée',
      placeholder: 'Tapez une commande ou recherchez…',
      results: 'Résultats',
    },
    dashboardSidebar: {
      close: 'Fermer la barre latérale',
    },
    dashboardSidebarCollapse: {
      collapse: 'Replier la barre latérale',
      expand: 'Déployer la barre latérale',
    },
    dashboardSidebarToggle: {
      close: 'Fermer la barre latérale',
      open: 'Ouvrir la barre latérale',
    },
    drawer: {
      close: 'Fermer',
    },
    dropZone: {
      removeFile: 'Supprimer {filename}',
    },
    error: {
      clear: "Retour à l'accueil",
    },
    header: {
      close: 'Fermer le menu',
      open: 'Ouvrir le menu',
    },
    metric: {
      progress: 'progression',
    },
    modal: {
      close: 'Fermer',
    },
    numberField: {
      decrement: 'Diminuer',
      increment: 'Augmenter',
      roledescription: 'champ numérique',
    },
    numberStepper: {
      decrement: 'Diminuer',
      increment: 'Augmenter',
      roledescription: 'champ numérique',
    },
    pagination: {
      next: 'Page suivante',
      nextLabel: 'Suivant',
      prev: 'Page précédente',
      prevLabel: 'Précédent',
    },
    richTable: {
      noData: 'Aucune donnée',
    },
    sidebar: {
      close: 'Fermer la barre latérale',
      toggle: 'Basculer',
    },
    spinner: {
      label: 'chargement',
    },
    toast: {
      close: 'Fermer',
    },
    toc: {
      title: 'Sur cette page',
    },
  },
})
