import { defineLocale } from './defineLocale'

/** The English strings: the default catalog and the per-key fallback of every other locale. */
export const enMessages = {
  actionBar: {
    label: 'Actions',
  },
  autocomplete: {
    clear: 'Clear selection',
    clearSearch: 'Clear search',
    placeholder: 'Select an item',
    search: 'Search options',
    searchPlaceholder: 'Search...',
    suggestions: 'Suggestions',
  },
  breadcrumbs: {
    label: 'Breadcrumbs',
  },
  calendar: {
    next: 'Next',
    prev: 'Previous',
    yearSelector: '{heading}, year selector',
  },
  carousel: {
    dots: 'Slide indicators',
    goto: 'Go to slide {slide}',
    next: 'Next slide',
    prev: 'Previous slide',
    roledescription: 'carousel',
    slide: 'slide',
    thumbnails: 'Slide thumbnails',
  },
  cellColorPicker: {
    area: 'Color area',
    hue: 'Hue',
    presets: 'Color presets',
  },
  closeButton: {
    close: 'Close',
  },
  codeBlock: {
    copied: 'Copied',
    copy: 'Copy code',
  },
  comboBox: {
    suggestions: 'Suggestions',
    trigger: 'Show suggestions',
  },
  commandPalette: {
    back: 'Back',
    close: 'Close',
    noData: 'No data',
    noMatchFor: 'No matching data for "{searchTerm}"',
    placeholder: 'Type a command or search...',
    results: 'Results',
  },
  dashboardPanel: {
    resize: 'Resize panel',
  },
  dashboardSidebar: {
    close: 'Close sidebar',
    resize: 'Resize sidebar',
    title: 'Sidebar',
  },
  dashboardSidebarCollapse: {
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
  },
  dashboardSidebarToggle: {
    close: 'Close sidebar',
    open: 'Open sidebar',
  },
  datePicker: {
    calendar: 'Calendar',
  },
  dateRangePicker: {
    calendar: 'Calendar',
  },
  drawer: {
    close: 'Close',
  },
  dropdown: {
    longPress: 'Long press or press Alt + ArrowDown to open menu',
  },
  dropZone: {
    label: 'Drop zone',
    progress: 'Upload progress for {filename}',
    removeFile: 'Remove {filename}',
    retry: 'Retry',
    trigger: 'Select files',
  },
  editorToolbar: {
    alignCenter: 'Align center',
    alignJustify: 'Justify',
    alignLeft: 'Align left',
    alignRight: 'Align right',
    apply: 'Apply',
    blockquote: 'Quote',
    bold: 'Bold',
    bulletList: 'Bullet list',
    clearFormatting: 'Clear formatting',
    code: 'Inline code',
    codeBlock: 'Code block',
    heading: 'Heading {level}',
    horizontalRule: 'Divider',
    image: 'Image',
    imageUrl: 'Image URL',
    italic: 'Italic',
    link: 'Link',
    linkUrl: 'Link URL',
    orderedList: 'Numbered list',
    paragraph: 'Paragraph',
    redo: 'Redo',
    strike: 'Strikethrough',
    taskList: 'Task list',
    underline: 'Underline',
    undo: 'Undo',
  },
  emptyState: {
    label: 'No results found',
  },
  error: {
    clear: 'Back to home',
  },
  header: {
    close: 'Close menu',
    menu: 'Navigation menu',
    open: 'Open menu',
  },
  alert: {
    close: 'Close',
  },
  alertDialog: {
    close: 'Close',
  },
  kbd: {
    command: 'Command',
    shift: 'Shift',
    ctrl: 'Control',
    option: 'Option',
    enter: 'Enter',
    delete: 'Delete',
    escape: 'Escape',
    tab: 'Tab',
    capslock: 'Caps Lock',
    up: 'Up',
    right: 'Right',
    down: 'Down',
    left: 'Left',
    pageup: 'Page Up',
    pagedown: 'Page Down',
    home: 'Home',
    end: 'End',
    help: 'Help',
    space: 'Space',
    fn: 'Fn',
    win: 'Win',
    alt: 'Alt',
  },
  listView: {
    select: 'Select {label}',
  },
  modal: {
    close: 'Close',
  },
  metric: {
    actions: 'More actions',
    progress: 'Progress',
  },
  navigationMenu: {
    moreActions: 'More actions for {label}',
  },
  numberField: {
    decrement: 'Decrease',
    decrementField: 'Decrease {label}',
    increment: 'Increase',
    incrementField: 'Increase {label}',
    roledescription: 'Number field',
  },
  numberStepper: {
    decrement: 'Decrease',
    decrementField: 'Decrease {label}',
    increment: 'Increase',
    incrementField: 'Increase {label}',
    roledescription: 'Number field',
  },
  pagination: {
    label: 'pagination',
    next: 'Next page',
    nextLabel: 'Next',
    prev: 'Previous page',
    prevLabel: 'Previous',
  },
  rating: {
    item: '{value} out of {length}',
  },
  richTable: {
    noData: 'No data',
  },
  searchField: {
    clear: 'Clear search',
  },
  select: {
    placeholder: 'Select an item',
  },
  sidebar: {
    close: 'Close sidebar',
    title: 'Sidebar',
    toggle: 'Toggle sidebar',
  },
  spinner: {
    label: 'Loading',
  },
  table: {
    resizer: 'Resizer',
    resizerValue: '{width} pixels',
    select: 'Select',
    selectAll: 'Select all',
    selectRow: 'Select row {index}',
  },
  tabs: {
    scrollDown: 'Scroll tabs down',
    scrollLeft: 'Scroll tabs left',
    scrollRight: 'Scroll tabs right',
    scrollUp: 'Scroll tabs up',
  },
  tagGroup: {
    remove: 'Remove tag',
  },
  toast: {
    close: 'Close',
    regionMany: '{count} notifications.',
    regionOne: '{count} notification.',
  },
  toc: {
    title: 'On this page',
  },
  tree: {
    select: 'Select {label}',
  },
  validation: {
    invalid: 'Invalid value.',
    max: 'Value must be {value} or earlier.',
    min: 'Value must be {value} or later.',
    rangeReversed: 'Start date must be before end date.',
    unavailable: 'Selected date unavailable.',
  },
}

/** English, the default locale. */
export const en = defineLocale({ name: 'English', code: 'en', messages: enMessages })
