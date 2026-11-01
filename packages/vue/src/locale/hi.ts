import { defineLocale } from './defineLocale'

/** हिन्दी (`hi`). Keys left out fall back to English. */
export const hi = defineLocale({
  name: 'हिन्दी',
  code: 'hi',
  messages: {
    alert: {
      close: 'बंद करें',
    },
    alertDialog: {
      close: 'बंद करें',
    },
    autocomplete: {
      searchPlaceholder: 'खोजें…',
    },
    breadcrumbs: {
      label: 'ब्रेडक्रंब',
    },
    carousel: {
      dots: 'प्रदर्शित करने के लिए स्लाइड चुनें',
      goto: 'स्लाइड {slide} पर जाएं',
      next: 'अगला',
      prev: 'पिछला',
      roledescription: 'कैरोसेल',
      slide: 'स्लाइड',
    },
    closeButton: {
      close: 'बंद करें',
    },
    codeBlock: {
      copy: 'कोड को क्लिपबोर्ड पर कॉपी करें',
    },
    comboBox: {
      trigger: 'विकल्प दिखाएं',
    },
    commandPalette: {
      back: 'वापस',
      close: 'बंद करें',
      noData: 'कोई डेटा नहीं',
      placeholder: 'एक आदेश या खोज टाइप करें…',
      results: 'परिणाम',
    },
    dashboardSidebar: {
      close: 'साइडबार बंद करें',
    },
    dashboardSidebarCollapse: {
      collapse: 'साइडबार संकुचित करें',
      expand: 'साइडबार विस्तारित करें',
    },
    dashboardSidebarToggle: {
      close: 'साइडबार बंद करें',
      open: 'साइडबार खोलें',
    },
    drawer: {
      close: 'बंद करें',
    },
    dropZone: {
      removeFile: '{filename} हटाएं',
    },
    error: {
      clear: 'होम पेज पर वापस जाएं',
    },
    header: {
      close: 'मेनू बंद करें',
      open: 'मेनू खोलें',
    },
    metric: {
      progress: 'प्रगति',
    },
    modal: {
      close: 'बंद करें',
    },
    numberField: {
      decrement: 'घटाना',
      increment: 'बढ़ाना',
      roledescription: 'संख्या फ़ील्ड',
    },
    numberStepper: {
      decrement: 'घटाना',
      increment: 'बढ़ाना',
      roledescription: 'संख्या फ़ील्ड',
    },
    pagination: {
      next: 'अगला पृष्ठ',
      nextLabel: 'अगला',
      prev: 'पिछला पृष्ठ',
      prevLabel: 'पिछला',
    },
    richTable: {
      noData: 'कोई डेटा नहीं',
    },
    sidebar: {
      close: 'साइडबार बंद करें',
      toggle: 'टॉगल करें',
    },
    spinner: {
      label: 'लोड हो रहा है',
    },
    toast: {
      close: 'बंद करें',
    },
    toc: {
      title: 'इस पृष्ठ पर',
    },
  },
})
