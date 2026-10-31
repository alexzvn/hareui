import { mount } from '@vue/test-utils'
import { useDirection, useLocale as useRekaLocale } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import type { AppProps } from '@/components/app/App.types'
import App from '@/components/app/App.vue'
import CloseButton from '@/components/close-button/CloseButton.vue'
import Modal from '@/components/modal/Modal.vue'
import NumberField from '@/components/number-field/NumberField.vue'
import Pagination from '@/components/pagination/Pagination.vue'
import { useLocale } from '@/composables/useLocale'
import { defineLocale, en, vi as viCatalog } from '@/locale'

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
})
