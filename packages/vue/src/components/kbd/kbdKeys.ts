import { enMessages } from '@/locale/en'

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

/** English name for each `KbdKey` (e.g. `ctrl` → `Control`); `Kbd` renders the active locale's `kbd` names as the symbol's `title`. */
export const kbdKeysLabelMap: Record<KbdKey, string> = enMessages.kbd
