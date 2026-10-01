import { onBeforeUnmount, onMounted } from 'vue'
import gravity from '@iconify-json/gravity-ui/icons.json'

const svg = (name: 'copy' | 'check') =>
  `<svg aria-hidden="true" height="1em" role="img" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg">${gravity.icons[name].body}</svg>`
const COPY_ICON = svg('copy')
const CHECK_ICON = svg('check')

export function flashCopied(button: HTMLElement) {
  button.setAttribute('aria-label', 'Copied Text')
  button.innerHTML = CHECK_ICON
  window.setTimeout(() => {
    button.setAttribute('aria-label', 'Copy Text')
    button.innerHTML = COPY_ICON
  }, 1500)
}

function codeText(figure: Element): string {
  const lines = figure.querySelectorAll('pre code > .line')
  if (lines.length === 0) return figure.querySelector('pre')?.textContent ?? ''
  return Array.from(lines, (line) => line.textContent ?? '').join('\n')
}

function selectTab(trigger: HTMLElement) {
  const tabs = trigger.closest('[data-fd-tabs]')
  if (!tabs) return
  for (const t of tabs.querySelectorAll<HTMLElement>(':scope > [role=tablist] > [role=tab]')) {
    const selected = t === trigger
    t.dataset.state = selected ? 'active' : 'inactive'
    t.setAttribute('aria-selected', String(selected))
    t.tabIndex = selected ? 0 : -1
    const panel = document.getElementById(t.getAttribute('aria-controls') ?? '')
    if (panel) panel.dataset.state = selected ? 'active' : 'inactive'
  }
}

function onClick(event: MouseEvent) {
  const target = event.target as Element | null
  const copy = target?.closest<HTMLElement>('[data-copy-code]')
  if (copy) {
    const figure = copy.closest('figure')
    if (figure) void navigator.clipboard.writeText(codeText(figure)).then(() => flashCopied(copy))
    return
  }
  const anchor = target?.closest<HTMLElement>('[data-copy-anchor]')
  if (anchor) {
    const id = anchor.closest('[id]')?.id
    if (id) void navigator.clipboard.writeText(`${location.origin}${location.pathname}#${id}`)
    return
  }
  const tab = target?.closest<HTMLElement>('[data-fd-tabs] > [role=tablist] > [role=tab]')
  if (tab) selectTab(tab)
}

export function useDocInteractions() {
  onMounted(() => document.addEventListener('click', onClick))
  onBeforeUnmount(() => document.removeEventListener('click', onClick))
}
