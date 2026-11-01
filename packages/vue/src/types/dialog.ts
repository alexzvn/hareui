/** Events every dialog overlay (`Modal`, `Drawer`, `AlertDialog`) emits around its open state. */
export type DialogEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
  /** Emitted when the open animation starts. */
  enter: []
  /** Emitted when the open animation finished, right after `enter` when there is none. */
  'after:enter': []
  /** Emitted when the close animation starts. */
  leave: []
  /** Emitted when the close animation finished and the dialog left the DOM. */
  'after:leave': []
  /**
   * Emitted when Escape, an outside press or a swipe (Drawer) tries to close the dialog while `dismissible` /
   * `keyboardDismissible` is `false`.
   */
  'close:prevent': []
}
