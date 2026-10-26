/** Id of the hidden long-press hint every long-press trigger points `aria-describedby` at. */
export const LONG_PRESS_DESCRIPTION_ID = 'hareui-dropdown-long-press-description'

/**
 * React Aria's `useLongPress` accessibility description, shared by every long-press trigger: one
 * hidden element in `document.body`, created by the first trigger that needs it.
 */
export const ensureLongPressDescription = () => {
  if (document.getElementById(LONG_PRESS_DESCRIPTION_ID)) return

  const description = document.createElement('div')
  description.id = LONG_PRESS_DESCRIPTION_ID
  description.style.display = 'none'
  description.textContent = 'Long press or press Alt + ArrowDown to open menu'

  document.body.appendChild(description)
}
