import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { mount } from '@vue/test-utils'
import { useDirection, useLocale as useRekaLocale } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import type { AppProps } from '@/components/app/App.types'
import App from '@/components/app/App.vue'
import CloseButton from '@/components/close-button/CloseButton.vue'
import EditorToolbar from '@/components/editor-toolbar/EditorToolbar.vue'
import Editor from '@/components/editor/Editor.vue'
import { kbdKeysLabelMap } from '@/components/kbd/kbdKeys'
import Modal from '@/components/modal/Modal.vue'
import NumberField from '@/components/number-field/NumberField.vue'
import Pagination from '@/components/pagination/Pagination.vue'
import { useLocale } from '@/composables/useLocale'
import { ar, defineLocale, en, vi as viCatalog } from '@/locale'
import type { Locale } from '@/locale'

const vi = defineLocale({
  name: 'Tiếng Việt',
  code: 'vi',
  dir: 'rtl',
  messages: { modal: { close: 'Đóng' } },
})

const IntlProbe = defineComponent({
  setup() {
    const locale = useRekaLocale()
    const dir = useDirection()

    return () => h('span', { 'data-locale': locale.value, 'data-dir': dir.value })
  },
})

const mountInApp = (locale: AppProps['locale'], child: () => unknown) =>
  mount(App, {
    props: { locale, toaster: null },
    slots: { default: child },
    attachTo: document.body,
  })

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

// The editor's reactive state follows a transaction two animation frames later.
const settle = async () => {
  await nextFrame()
  await nextFrame()
  for (let i = 0; i < 4; i++) await nextTick()
}

type CatalogEntry = [name: string, locale: Locale]

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'object' && value !== null && 'messages' in value && 'dir' in value

// Every catalog file in the locale folder, so a new catalog is checked without being listed here.
const catalogs: CatalogEntry[] = Object.entries(
  import.meta.glob<Record<string, unknown>>('@/locale/*.ts', { eager: true }),
)
  .filter(([file]) => !file.endsWith('/index.ts'))
  .flatMap(([, exports]) =>
    Object.entries(exports).filter((entry): entry is CatalogEntry => isLocale(entry[1])),
  )

const toEntries = (messages: object, prefix = ''): [key: string, message: string][] =>
  Object.entries(messages).flatMap(([key, value]): [string, string][] =>
    typeof value === 'string' ? [[`${prefix}${key}`, value]] : toEntries(value, `${prefix}${key}.`),
  )

const getPlaceholders = (message: string) =>
  [...message.matchAll(/\{(\w+)\}/g)]
    .map((match) => match[1])
    .sort()
    .join(',')

const englishPlaceholders = new Map(
  toEntries(en.messages).map(([key, message]) => [key, getPlaceholders(message)]),
)

const getExtraKeys = ([name, locale]: CatalogEntry) =>
  toEntries(locale.messages)
    .filter(([key]) => !englishPlaceholders.has(key))
    .map(([key]) => `${name}: ${key}`)

const getPlaceholderMismatches = ([name, locale]: CatalogEntry) =>
  toEntries(locale.messages)
    .filter(([key, message]) => {
      const expected = englishPlaceholders.get(key)

      return expected !== undefined && getPlaceholders(message) !== expected
    })
    .map(([key]) => `${name}: ${key}`)

describe('locale', () => {
  it('translates a built-in label with a custom locale', async () => {
    const wrapper = mountInApp(vi, () => h(Modal, { open: true, title: 'Title' }))
    await nextTick()
    await nextTick()

    const close = document.querySelector('[data-slot="modal-close-trigger"]')
    expect(close?.getAttribute('aria-label')).toBe('Đóng')
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('falls back to English for a key the locale lacks', () => {
    const wrapper = mountInApp(vi, () => h(CloseButton))

    expect(wrapper.get('button').attributes('aria-label')).toBe(en.messages.closeButton.close)
  })

  it('keeps a per-instance label prop as an override', () => {
    const wrapper = mountInApp(vi, () => h(CloseButton, { ariaLabel: 'Dismiss' }))

    expect(wrapper.get('button').attributes('aria-label')).toBe('Dismiss')
  })

  it('passes the locale code and direction to the primitives', () => {
    const wrapper = mountInApp(vi, () => h(IntlProbe))

    expect(wrapper.get('span').attributes()).toMatchObject({
      'data-locale': 'vi',
      'data-dir': 'rtl',
    })
  })

  it('keeps Intl formatting and English strings for a string locale', () => {
    const wrapper = mountInApp('de', () => [h(IntlProbe), h(CloseButton)])

    expect(wrapper.get('span').attributes('data-locale')).toBe('de')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Close')
  })

  it('lets App dir override the locale direction', () => {
    const wrapper = mount(App, {
      props: { locale: vi, dir: 'ltr', toaster: null },
      slots: { default: () => h(IntlProbe) },
    })

    expect(wrapper.get('span').attributes('data-dir')).toBe('ltr')
  })

  it('translates with a shipped catalog and falls back to English for its missing keys', async () => {
    const Probe = defineComponent({
      setup() {
        const { t } = useLocale()

        return () => h('output', t('searchField.clear'))
      },
    })

    const wrapper = mountInApp(viCatalog, () => [
      h(Modal, { open: true, title: 'Title' }),
      h(Probe),
    ])

    await nextTick()
    await nextTick()

    const close = document.querySelector('[data-slot="modal-close-trigger"]')
    expect(close?.getAttribute('aria-label')).toBe('Đóng')
    expect(wrapper.get('output').text()).toBe(en.messages.searchField.clear)
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('translates the visible pagination labels with a shipped catalog', async () => {
    const wrapper = mountInApp(viCatalog, () => h(Pagination, { total: 3 }))

    await nextTick()

    expect(wrapper.get('[data-slot="pagination-previous"]').text()).toBe('Trước')
    expect(wrapper.get('[data-slot="pagination-next"]').text()).toBe('Sau')
    wrapper.unmount()
  })

  it('translates the number field spin button role description with a shipped catalog', async () => {
    const wrapper = mountInApp(viCatalog, () => h(NumberField, { label: 'Qty' }))

    await nextTick()

    expect(wrapper.get('[role=spinbutton]').attributes('aria-roledescription')).toBe('trường số')
    wrapper.unmount()
  })

  it('lets a nested App without locale keep the parent strings, Intl code and direction', () => {
    const wrapper = mountInApp(ar, () =>
      h(App, { toaster: null }, () => [h(IntlProbe), h(CloseButton)]),
    )

    expect(wrapper.get('span').attributes()).toMatchObject({
      'data-locale': 'ar',
      'data-dir': 'rtl',
    })

    expect(wrapper.get('button').attributes('aria-label')).toBe(ar.messages.closeButton.close)
    wrapper.unmount()
  })

  it('shows an unknown message key as written, and rejects it at type level', () => {
    const Probe = defineComponent({
      setup() {
        const { t } = useLocale()

        // @ts-expect-error: `editorToolbar.bolld` is not a message key
        return () => h('output', t('editorToolbar.bolld'))
      },
    })

    const wrapper = mountInApp(en, () => h(Probe))

    expect(wrapper.get('output').text()).toBe('editorToolbar.bolld')
    wrapper.unmount()
  })

  it('translates the Remove action of the editor link popover', async () => {
    const locale = defineLocale({
      name: 'Tiếng Việt',
      code: 'vi',
      messages: { editorToolbar: { remove: 'Gỡ liên kết' } },
    })

    let editor: TiptapEditor | undefined
    const wrapper = mountInApp(locale, () =>
      h(
        Editor,
        { modelValue: '<p><a href="https://old.test">Hello</a></p>' },
        {
          default: (slot: { editor: TiptapEditor }) => {
            editor = slot.editor

            return [h(EditorToolbar, { editor: slot.editor, items: [{ kind: 'link' }] })]
          },
        },
      ),
    )

    const linkButton = '[data-slot=editor-toolbar] button[aria-label="Link"]'

    await settle()
    editor!.commands.setTextSelection({ from: 3, to: 3 })
    await settle()
    document.querySelector<HTMLButtonElement>(linkButton)!.click()
    await settle()

    const actions = [...document.querySelectorAll('[data-slot=popover] button')].map((button) =>
      button.textContent?.trim(),
    )

    expect(actions).toContain('Gỡ liên kết')
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('keeps the English fallback strings when the exported kbd names are written to', () => {
    Reflect.set(kbdKeysLabelMap, 'ctrl', 'Ctl')

    expect(kbdKeysLabelMap.ctrl).toBe('Control')
    expect(en.messages.kbd.ctrl).toBe('Control')
  })
})

describe('locale catalogs', () => {
  it('defines no key outside the English catalog', () => {
    expect(catalogs.flatMap(getExtraKeys)).toEqual([])
  })

  it('keeps the English placeholders of every key', () => {
    expect(catalogs.flatMap(getPlaceholderMismatches)).toEqual([])
  })

  it('marks exactly the right-to-left languages rtl', () => {
    const rtlNames = catalogs
      .filter(([, locale]) => locale.dir === 'rtl')
      .map(([name]) => name)
      .sort()

    expect(rtlNames).toEqual(['ar', 'ckb', 'fa_ir', 'he', 'ug_cn', 'ur'])
  })
})
