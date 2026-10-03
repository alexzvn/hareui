import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ColorSwatch from '../src/components/color-swatch/ColorSwatch.vue'
import { ColorPickerContextKey } from '../src/components/color-picker/context'
import { parseColor } from 'reka-ui'

describe('colorSwatch', () => {
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
