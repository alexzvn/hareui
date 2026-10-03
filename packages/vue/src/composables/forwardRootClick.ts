const INTERACTIVE = 'a[href], button, input, select, textarea, label, [role=button], [role=checkbox], [role=radio], [role=switch], [contenteditable=""], [contenteditable=true]'

/**
 * HeroUI renders checkbox / radio / switch items as a `<label>`, so a click anywhere in the item
 * (including the empty space beside the label text, and the description) toggles it. HareUI's item
 * root is a `<div>` around the Reka control button, so forward clicks that land outside the button.
 * Clicks on the control itself, or on nested interactive content (a link in a description), are left alone.
 */
export function forwardRootClick(event: MouseEvent, contentSelector: string) {
  const root = event.currentTarget as HTMLElement | null
  const target = event.target as Element | null
  if (!root || !target || event.defaultPrevented)
    return
  const content = root.querySelector<HTMLElement>(contentSelector)
  if (!content || content.contains(target))
    return
  const interactive = target.closest(INTERACTIVE)
  if (interactive && root.contains(interactive) && interactive !== root)
    return
  content.click()
}
