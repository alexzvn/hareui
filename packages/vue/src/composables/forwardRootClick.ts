const INTERACTIVE = 'a[href], button, input, select, textarea, label, [role=button], [role=checkbox], [role=radio], [role=switch], [contenteditable=""], [contenteditable=true]'

// Decision per click, taken in the capture phase while the clicked node is still in the document.
const pending = new WeakMap<Event, boolean>()

function shouldForward(root: HTMLElement, target: Element | null, content: HTMLElement): boolean {
  for (let node = target; node; node = node.parentElement) {
    if (node === content)
      return false
    if (node === root)
      return true
    if (node.matches(INTERACTIVE))
      return false
  }
  return false
}

/**
 * Capture-phase half of {@link forwardRootClick}, bound as `@click.capture` on the same root. The control's own
 * click handler can re-render and detach the clicked node (the indeterminate glyph swapped for the checkmark)
 * before the root's bubbling handler runs; by then `contains(target)` is false and the click would be forwarded
 * a second time. So the decision is taken here, before any handler below the root has run.
 */
export function trackRootClick(event: MouseEvent, contentSelector: string) {
  const root = event.currentTarget as HTMLElement | null
  const content = root?.querySelector<HTMLElement>(contentSelector)
  if (root && content)
    pending.set(event, shouldForward(root, event.target as Element | null, content))
}

/**
 * HeroUI renders checkbox / radio / switch items as a `<label>`, so a click anywhere in the item
 * (including the empty space beside the label text, and the description) toggles it. HareUI's item
 * root is a `<div>` around the Reka control button, so forward clicks that land outside the button.
 * Clicks on the control itself, or on nested interactive content (a link in a description), are left alone.
 * Pair with {@link trackRootClick} on `@click.capture`.
 */
export function forwardRootClick(event: MouseEvent, contentSelector: string) {
  const root = event.currentTarget as HTMLElement | null
  if (!root || event.defaultPrevented)
    return
  const content = root.querySelector<HTMLElement>(contentSelector)
  if (!content)
    return
  const forward = pending.get(event) ?? shouldForward(root, event.target as Element | null, content)
  pending.delete(event)
  if (forward)
    content.click()
}

/**
 * `@mousedown` on a readonly item root: RAC disables press handling on a readonly checkbox / switch / radio, so a
 * click leaves focus where it was. HareUI's control is a native `<button>`, which takes focus on mousedown.
 * Nested interactive content (a link in a description) still takes focus as usual.
 */
export function keepFocusWhenReadonly(event: MouseEvent, readonly: boolean, contentSelector: string) {
  const root = event.currentTarget as HTMLElement | null
  const content = root?.querySelector<HTMLElement>(contentSelector)
  if (!readonly || !root || !content)
    return
  for (let node = event.target as Element | null; node; node = node.parentElement) {
    if (node === content || node === root)
      break
    if (node.matches(INTERACTIVE))
      return
  }
  event.preventDefault()
}

const BLOCKS_IMPLICIT_SUBMISSION = 'input:is([type=text], [type=search], [type=url], [type=tel], [type=email], [type=password], [type=date], [type=month], [type=week], [type=time], [type=datetime-local], [type=number], :not([type]))'

/**
 * `@keydown.capture` on the control: HeroUI's checkbox / radio / switch are native inputs, so Enter performs the
 * form's implicit submission (and never toggles). Reka's button controls prevent Enter (the switch even toggles
 * on it), so this runs ahead of Reka's handler on the same element and submits the way the browser would: through
 * the form's default button, or directly when no other field blocks implicit submission.
 */
export function submitOnEnter(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
    return
  event.preventDefault()
  event.stopImmediatePropagation()
  const control = event.currentTarget as HTMLButtonElement
  const form = control.form ?? control.closest('form')
  if (!form)
    return
  const submitter = [...form.elements].find((el): el is HTMLButtonElement | HTMLInputElement =>
    (el instanceof HTMLButtonElement && el.type === 'submit') || (el instanceof HTMLInputElement && (el.type === 'submit' || el.type === 'image')))
  if (submitter) {
    if (!submitter.disabled)
      submitter.click()
    return
  }
  if ([...form.elements].filter(el => el.matches(BLOCKS_IMPLICIT_SUBMISSION)).length > 1)
    return
  form.requestSubmit()
}
