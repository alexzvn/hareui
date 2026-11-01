import { defineLocale } from './defineLocale'

/** Ελληνικά (`el`). Keys left out fall back to English. */
export const el = defineLocale({
  name: 'Ελληνικά',
  code: 'el',
  messages: {
    alert: {
      close: 'Κλείσιμο',
    },
    alertDialog: {
      close: 'Κλείσιμο',
    },
    autocomplete: {
      searchPlaceholder: 'Αναζήτηση…',
    },
    breadcrumbs: {
      label: 'διαδρομή πλοήγησης',
    },
    carousel: {
      dots: 'Επιλέξτε διαφάνεια για εμφάνιση',
      goto: 'Μετάβαση στη διαφάνεια {slide}',
      next: 'Επόμενο',
      prev: 'Προηγούμενο',
      roledescription: 'καρουζέλ',
      slide: 'διαφάνεια',
    },
    closeButton: {
      close: 'Κλείσιμο',
    },
    codeBlock: {
      copy: 'Αντιγραφή κώδικα στο πρόχειρο',
    },
    comboBox: {
      trigger: 'Εμφάνιση επιλογών',
    },
    commandPalette: {
      back: 'Πίσω',
      close: 'Κλείσιμο',
      noData: 'Δεν υπάρχουν δεδομένα',
      placeholder: 'Πληκτρολογήστε μια εντολή ή αναζητήστε…',
      results: 'Αποτελέσματα',
    },
    dashboardSidebar: {
      close: 'Κλείσιμο πλευρικής μπάρας',
    },
    dashboardSidebarCollapse: {
      collapse: 'Σύμπτυξη πλευρικής μπάρας',
      expand: 'Επέκταση πλευρικής μπάρας',
    },
    dashboardSidebarToggle: {
      close: 'Κλείσιμο πλευρικής μπάρας',
      open: 'Άνοιγμα πλευρικής μπάρας',
    },
    drawer: {
      close: 'Κλείσιμο',
    },
    dropZone: {
      removeFile: 'Αφαίρεση {filename}',
    },
    error: {
      clear: 'Επιστροφή στην αρχική',
    },
    header: {
      close: 'Κλείσιμο μενού',
      open: 'Άνοιγμα μενού',
    },
    metric: {
      progress: 'πρόοδος',
    },
    modal: {
      close: 'Κλείσιμο',
    },
    numberField: {
      decrement: 'Μείωση',
      increment: 'Αύξηση',
      roledescription: 'αριθμητικό πεδίο',
    },
    numberStepper: {
      decrement: 'Μείωση',
      increment: 'Αύξηση',
      roledescription: 'αριθμητικό πεδίο',
    },
    pagination: {
      next: 'Επόμενη σελίδα',
      nextLabel: 'Επόμενο',
      prev: 'Προηγούμενη σελίδα',
      prevLabel: 'Προηγούμενο',
    },
    richTable: {
      noData: 'Δεν υπάρχουν δεδομένα',
    },
    sidebar: {
      close: 'Κλείσιμο πλευρικής μπάρας',
      toggle: 'Εναλλαγή',
    },
    spinner: {
      label: 'φόρτωση',
    },
    toast: {
      close: 'Κλείσιμο',
    },
    toc: {
      title: 'Σε αυτή τη σελίδα',
    },
  },
})
