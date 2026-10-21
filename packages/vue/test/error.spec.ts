import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Error from '../src/components/error/Error.vue'

// Local stand-in for Promise.withResolvers, so the library's tsconfig `lib` doesn't need ES2024.
function withResolvers<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const error = { statusCode: 404, statusMessage: 'Page not found', message: 'The page you are looking for does not exist.' }

describe('error', () => {
  it('renders the status code, an h1 status message and the message', () => {
    const wrapper = mount(Error, { props: { error } })
    expect(wrapper.get('[data-slot=error-status-code]').text()).toBe('404')
    expect(wrapper.get('h1').text()).toBe('Page not found')
    expect(wrapper.get('[data-slot=error-message]').text()).toBe('The page you are looking for does not exist.')
  })

  it('accepts the H3 field names status / statusText', () => {
    const wrapper = mount(Error, { props: { error: { status: 500, statusText: 'Server error' } } })
    expect(wrapper.get('[data-slot=error-status-code]').text()).toBe('500')
    expect(wrapper.get('h1').text()).toBe('Server error')
  })

  it('hides the message when it equals the status message', () => {
    const wrapper = mount(Error, { props: { error: { statusCode: 404, statusMessage: 'Not found', message: 'Not found' } } })
    expect(wrapper.find('[data-slot=error-message]').exists()).toBe(false)
  })

  it('links the clear button to redirect (default "/") and emits clear before navigating', async () => {
    const wrapper = mount(Error, { props: { error } })
    const link = wrapper.get('[data-slot=error-links] a')
    expect(link.attributes('href')).toBe('/')
    expect(link.text()).toBe('Back to home')

    // Vue ignores events stamped in the same millisecond its listener was attached (`_vts <= attached`); a real click never lands that fast.
    const { promise, resolve } = withResolvers<void>()
    setTimeout(resolve, 2)
    await promise
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.element.addEventListener('click', e => e.preventDefault()) // keep happy-dom from navigating
    link.element.dispatchEvent(event)
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('clear')![0][0]).toBe(event)
  })

  it('a custom redirect sets the href; an empty redirect renders a plain button', () => {
    expect(mount(Error, { props: { error, redirect: '/docs' } }).get('a').attributes('href')).toBe('/docs')
    const wrapper = mount(Error, { props: { error, redirect: '' } })
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('[data-slot=error-links] button').attributes('type')).toBe('button')
  })

  it('clear={false} hides the button; an object sets label and forwards button props', () => {
    expect(mount(Error, { props: { error, clear: false } }).find('[data-slot=error-links]').exists()).toBe(false)
    const custom = mount(Error, { props: { error, clear: { label: 'Go back', class: 'rounded-full' } } })
    expect(custom.get('[data-slot=error-links] a').text()).toBe('Go back')
    expect(custom.get('[data-slot=error-links] a').classes()).toContain('rounded-full')
  })

  it('#leading renders above the status code; #links replaces the button', () => {
    const wrapper = mount(Error, {
      props: { error },
      slots: { leading: () => h('i', { id: 'logo' }), links: () => h('span', { id: 'custom' }) },
    })
    expect(wrapper.find('[data-slot=error-leading] #logo').exists()).toBe(true)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('[data-slot=error-links] #custom').exists()).toBe(true)
  })

  it('as accepts an object per part', () => {
    const wrapper = mount(Error, { props: { error, as: { root: 'div', statusMessage: 'h2' } } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.get('[data-slot=error-status-message]').element.tagName).toBe('H2')
  })
})
