/**
 * Name of a modifier or special key that `Kbd` can render as a symbol, e.g. `'command'` (⌘)
 * or `'shift'` (⇧). Copied from HeroUI's `kbd.constants.ts`.
 */
export type KbdKey =
  | 'command'
  | 'shift'
  | 'ctrl'
  | 'option'
  | 'enter'
  | 'delete'
  | 'escape'
  | 'tab'
  | 'capslock'
  | 'up'
  | 'right'
  | 'down'
  | 'left'
  | 'pageup'
  | 'pagedown'
  | 'home'
  | 'end'
  | 'help'
  | 'space'
  | 'fn'
  | 'win'
  | 'alt'

/** Symbol rendered for each `KbdKey` (e.g. `command` → `⌘`), matching HeroUI's key glyphs. */
export const kbdKeysMap: Record<KbdKey, string> = {
  command: '⌘',
  shift: '⇧',
  ctrl: '⌃',
  option: '⌥',
  enter: '↵',
  delete: '⌫',
  escape: '⎋',
  tab: '⇥',
  capslock: '⇪',
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘',
  help: '?',
  space: '␣',
  fn: 'Fn',
  win: '⌘',
  alt: '⌥',
}

/** Human-readable name for each `KbdKey`, used as the symbol's `title` (e.g. `ctrl` → `Control`). */
export const kbdKeysLabelMap: Record<KbdKey, string> = {
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
}
