import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ColorSwatch from '../src/components/color-swatch/ColorSwatch.vue'
import { ColorPickerContextKey } from '../src/components/color-picker/context'
import { parseColor } from 'reka-ui'
import { expectAccessible } from './a11y'

describe('ColorSwatch', () => {
  it('passes axe for a named colour, a custom colorName and a transparent colour', async () => {
    const named = mount(ColorSwatch, { attachTo: document.body, props: { color: '#0485F7' } })
    await expectAccessible(named)
    const custom = mount(ColorSwatch, { attachTo: document.body, props: { color: '#0485F7', colorName: 'Ocean Blue', shape: 'square', size: 'lg' } })
    await expectAccessible(custom)
    const transparent = mount(ColorSwatch, { attachTo: document.body, props: { color: 'rgba(0, 0, 0, 0)' } })
    await expectAccessible(transparent)
    named.unmount()
    custom.unmount()
    transparent.unmount()
  })

  it('describes itself as a colour swatch and names a transparent colour', () => {
    const wrapper = mount(ColorSwatch, { props: { color: 'rgba(0, 0, 0, 0)' } })
    const el = wrapper.get('[data-slot=color-swatch]')
    expect(el.attributes('aria-roledescription')).toBe('color swatch')
    expect(el.attributes('aria-label')).toBe('transparent')
    expect(el.attributes('tabindex')).toBeUndefined()
    wrapper.unmount()
  })

  it('updates its accessible name when the colour changes', async () => {
    const wrapper = mount(ColorSwatch, { props: { color: '#FF0000' } })
    const el = wrapper.get('[data-slot=color-swatch]')
    expect(el.attributes('aria-label')).toMatch(/red/i)
    await wrapper.setProps({ color: '#00FF00' })
    expect(el.attributes('aria-label')).toMatch(/green|lime/i)
    wrapper.unmount()
  })

  it('renders as an accessible img with a derived color name', () => {
    const wrapper = mount(ColorSwatch, { props: { color: '#0485F7' } })
    const el = wrapper.find('[data-slot=color-swatch]')
    expect(el.attributes('role')).toBe('img')
    expect(el.attributes('aria-label')).toBeTruthy()
  })

  it('colorName overrides the automatically derived accessible name', () => {
    const wrapper = mount(ColorSwatch, { props: { color: '#0485F7', colorName: 'Ocean Blue' } })
    expect(wrapper.find('[data-slot=color-swatch]').attributes('aria-label')).toBe('Ocean Blue')
  })

  it('default slot receives the resolved color string and alpha', () => {
    const wrapper = mount(ColorSwatch, {
      props: { color: 'rgba(4, 133, 247, 0.5)' },
      slots: { default: (props: { color: string, alpha: number }) => h('span', { 'data-testid': 'slot' }, `${props.color}:${props.alpha}`) },
    })
    expect(wrapper.find('[data-testid=slot]').exists()).toBe(true)
  })

  it('falls back to the enclosing ColorPicker context color when no color prop is given', () => {
    const color = parseColor('#D946EF')
    const Wrapper = {
      setup() {
        return () => h(ColorSwatch, {})
      },
    }
    const wrapper = mount(Wrapper, {
      global: {
        provide: {
          [ColorPickerContextKey as unknown as string]: {
            color: { value: color },
            setColor: () => {},
          },
        },
      },
    })
    const el = wrapper.find('[data-slot=color-swatch]')
    expect(el.attributes('style')).toContain('--reka-color-swatch-color')
  })

  it('an explicit color prop takes priority over the ColorPicker context', () => {
    const contextColor = parseColor('#D946EF')
    const Wrapper = {
      setup() {
        return () => h(ColorSwatch, { color: '#0485F7' })
      },
    }
    const wrapper = mount(Wrapper, {
      global: {
        provide: {
          [ColorPickerContextKey as unknown as string]: {
            color: { value: contextColor },
            setColor: () => {},
          },
        },
      },
    })
    expect(wrapper.find('[data-slot=color-swatch]').attributes('style')).toContain('#0485F7')
  })
})
