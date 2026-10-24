import type { ValidationResult } from '../src/composables/useFieldValidation'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Checkbox from '../src/components/checkbox/Checkbox.vue'
import DateField from '../src/components/date-field/DateField.vue'
import RadioButtonGroup from '../src/components/radio-button-group/RadioButtonGroup.vue'
import RadioButtonGroupItem from '../src/components/radio-button-group/RadioButtonGroupItem.vue'
import TagGroup from '../src/components/tag-group/TagGroup.vue'
import TextField from '../src/components/text-field/TextField.vue'
import { useFieldChrome } from '../src/composables/useFieldChrome'

function result(errors: string[] = []): ValidationResult {
  return { isInvalid: errors.length > 0, validationErrors: errors, validationDetails: {} as ValidityState }
}

const Harness = defineComponent({
  inheritAttrs: false,
  props: {
    id: String,
    label: String,
    description: String,
    errorMessage: String,
    invalid: Boolean,
    errors: { type: Array as () => string[], default: () => [] },
    hide: Boolean,
    extra: { type: Array as () => (string | undefined)[], default: () => [] },
    group: Boolean,
    position: String as () => 'beforeDescription' | 'afterDescription',
    errorPart: String as () => 'fieldError' | 'errorMessage',
  },
  setup(props, { slots, attrs }) {
    const chrome = useFieldChrome({
      props,
      slots,
      invalid: () => props.invalid,
      validation: () => result(props.errors),
      disabled: () => true,
      required: () => true,
      hideDescriptionWhenInvalid: props.hide,
      ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
      describedByIds: () => props.extra,
      describedByIdsPosition: props.position,
      errorPart: props.errorPart,
    })
    const { FieldLabel, FieldDescription, FieldError } = chrome
    return () => h('div', [
      props.group ? h(FieldLabel, { id: chrome.labelId.value, as: 'span' }) : h(FieldLabel, { for: chrome.id.value }),
      h('input', { 'id': chrome.id.value, 'aria-describedby': chrome.describedBy.value }),
      h(FieldDescription),
      h(FieldError),
    ])
  },
})

const describedBy = (w: ReturnType<typeof mount>) => w.get('input').attributes('aria-describedby')

describe('useFieldChrome', () => {
  it('orders describedBy: caller aria-describedby, extra ids, description, error', () => {
    const w = mount(Harness, {
      props: { id: 'f', description: 'Help', errorMessage: 'Bad', invalid: true, extra: ['f-value', undefined] },
      attrs: { 'aria-describedby': 'outer' },
    })
    expect(describedBy(w)).toBe('outer f-value f-description f-error')
  })

  it('lists the extra ids after the description with describedByIdsPosition afterDescription', () => {
    const w = mount(Harness, {
      props: { id: 'f', description: 'Help', errorMessage: 'Bad', invalid: true, extra: ['f-extra', undefined, 'group-help'], position: 'afterDescription' },
      attrs: { 'aria-describedby': 'outer' },
    })
    expect(describedBy(w)).toBe('outer f-description f-extra group-help f-error')

    const noDescription = mount(Harness, { props: { id: 'g', extra: ['g-extra'], position: 'afterDescription' } })
    expect(describedBy(noDescription)).toBe('g-extra')
  })

  it('errorPart errorMessage renders an ErrorMessage whenever errorMessage is given, even empty, regardless of invalid', async () => {
    const w = mount(Harness, { props: { id: 'f', errorPart: 'errorMessage', errors: ['v1'] } })
    expect(w.find('#f-error').exists()).toBe(false)
    expect(describedBy(w)).toBeUndefined()

    await w.setProps({ errorMessage: '' })
    const error = w.get('#f-error')
    expect(error.attributes('data-slot')).toBe('error-message')
    expect(error.attributes('role')).toBeUndefined()
    expect(error.text()).toBe('')
    expect(describedBy(w)).toBe('f-error')

    await w.setProps({ errorMessage: 'Required' })
    expect(w.get('#f-error').text()).toBe('Required')
  })

  it('errorPart errorMessage renders the errorMessage slot, not the error slot', () => {
    const w = mount(Harness, {
      props: { id: 'f', errorPart: 'errorMessage' },
      slots: { errorMessage: () => 'From slot', error: () => 'Ignored' },
    })
    expect(w.get('#f-error').text()).toBe('From slot')
    expect(describedBy(w)).toBe('f-error')

    const errorSlotOnly = mount(Harness, { props: { id: 'g', errorPart: 'errorMessage' }, slots: { error: () => 'Ignored' } })
    expect(errorSlotOnly.find('#g-error').exists()).toBe(false)
  })

  it('is undefined when nothing describes the field', () => {
    expect(describedBy(mount(Harness, { props: { id: 'f' } }))).toBeUndefined()
  })

  it('drops the description from DOM and describedBy while invalid when hideDescriptionWhenInvalid is on', async () => {
    const w = mount(Harness, { props: { id: 'f', description: 'Help', errorMessage: 'Bad', hide: true } })
    expect(describedBy(w)).toBe('f-description')
    await w.setProps({ invalid: true })
    expect(w.find('#f-description').exists()).toBe(false)
    expect(describedBy(w)).toBe('f-error')
  })

  it('keeps the description while invalid when the option is off', () => {
    const w = mount(Harness, { props: { id: 'f', description: 'Help', errorMessage: 'Bad', invalid: true } })
    expect(w.get('#f-description').text()).toBe('Help')
    expect(describedBy(w)).toBe('f-description f-error')
  })

  it('renders the error only while invalid with a message, slot or validation errors', async () => {
    const w = mount(Harness, { props: { id: 'f', invalid: true } })
    expect(w.find('#f-error').exists()).toBe(false)
    expect(describedBy(w)).toBeUndefined()

    await w.setProps({ errors: ['Too short', 'No digit'] })
    expect(w.get('#f-error').text()).toBe('Too short No digit')
    expect(describedBy(w)).toBe('f-error')

    await w.setProps({ errorMessage: 'Bad' })
    expect(w.get('#f-error').text()).toBe('Bad')

    await w.setProps({ invalid: false })
    expect(w.find('#f-error').exists()).toBe(false)
    expect(describedBy(w)).toBeUndefined()

    const slotOnly = mount(Harness, { props: { id: 'g', invalid: true }, slots: { error: () => 'Slotted' } })
    expect(slotOnly.get('#g-error').text()).toBe('Slotted')
  })

  it('slots win over props; the error slot receives the validation result', () => {
    const w = mount(Harness, {
      props: { id: 'f', label: 'L', description: 'D', errorMessage: 'E', invalid: true, errors: ['v1'] },
      slots: {
        label: () => 'Slot label',
        description: () => 'Slot description',
        error: (v: ValidationResult) => `errors: ${v.validationErrors.join(',')}`,
      },
    })
    expect(w.get('[data-slot=label]').text()).toBe('Slot label')
    expect(w.get('#f-description').text()).toBe('Slot description')
    expect(w.get('#f-error').text()).toBe('errors: v1')
  })

  it('renders the label with for, or with id for groups, passing disabled/invalid/required', () => {
    const w = mount(Harness, { props: { id: 'f', label: 'Name' } })
    const label = w.getComponent({ name: 'FieldLabel' }).get('label')
    expect(label.attributes('for')).toBe('f')
    expect(label.text()).toBe('Name')

    const group = mount(Harness, { props: { id: 'g', label: 'Name', group: true } })
    const span = group.get('[data-slot=label]')
    expect(span.element.tagName).toBe('SPAN')
    expect(span.attributes('id')).toBe('g-label')
    expect(span.attributes('for')).toBeUndefined()
  })

  it('re-renders a part when its slot goes from absent to present', async () => {
    const show = ref(false)
    const Parent = defineComponent({
      setup: () => () => h(Harness, { id: 'f', description: 'Prop' }, show.value ? { description: () => 'From slot' } : {}),
    })
    const w = mount(Parent)
    expect(w.get('#f-description').text()).toBe('Prop')
    show.value = true
    await nextTick()
    expect(w.get('#f-description').text()).toBe('From slot')

    const labelShow = ref(false)
    const LabelParent = defineComponent({
      setup: () => () => h(Harness, { id: 'g' }, labelShow.value ? { label: () => 'Late label' } : {}),
    })
    const lw = mount(LabelParent)
    expect(lw.find('[data-slot=label]').exists()).toBe(false)
    labelShow.value = true
    await nextTick()
    expect(lw.get('[data-slot=label]').text()).toBe('Late label')
  })

  it('a custom id drives every derived id', () => {
    const w = mount(Harness, { props: { id: 'custom', label: 'L', description: 'D', errorMessage: 'E', invalid: true, group: true } })
    expect(w.find('#custom-label').exists()).toBe(true)
    expect(w.find('#custom-description').exists()).toBe(true)
    expect(w.find('#custom-error').exists()).toBe(true)
    expect(describedBy(w)).toBe('custom-description custom-error')
  })
})

describe('converted fields', () => {
  it('TextField drops the description while invalid', async () => {
    const w = mount(TextField, { props: { id: 't', label: 'L', description: 'D', errorMessage: 'E' }, attrs: { 'aria-describedby': 'x' } })
    expect(w.get('input').attributes('aria-describedby')).toBe('x t-description')
    expect(w.get('label').attributes('for')).toBe('t')
    await w.setProps({ invalid: true })
    expect(w.find('#t-description').exists()).toBe(false)
    expect(w.get('input').attributes('aria-describedby')).toBe('x t-error')
  })

  it('DateField drops the description while invalid and labels the group by id', async () => {
    const w = mount(DateField, { props: { id: 'd', label: 'Date', description: 'D', errorMessage: 'E' } })
    expect(w.find('#d-label').exists()).toBe(true)
    expect(w.find('#d-description').exists()).toBe(true)
    await w.setProps({ invalid: true })
    await nextTick()
    expect(w.find('#d-description').exists()).toBe(false)
    expect(w.get('#d-error').text()).toBe('E')
  })

  it('Checkbox keeps the description while invalid and passes state to the description slot', () => {
    const w = mount(Checkbox, {
      props: { id: 'c', label: 'Agree', errorMessage: 'E', invalid: true },
      slots: { description: ({ state }: { state: string }) => `state: ${state}` },
    })
    expect(w.get('#c-description').text()).toBe('state: unchecked')
    expect(w.get('[role=checkbox]').attributes('aria-describedby')).toBe('c-description c-error')
  })

  it('RadioButtonGroupItem lists its description, then its extra content, then the group ids', () => {
    const w = mount(() => h(RadioButtonGroup, { id: 'g', label: 'Plan', description: 'Pick one' }, () =>
      h(RadioButtonGroupItem, { id: 'r', value: 'pro', label: 'Pro', description: 'For teams' }, { default: () => 'Extra' })))
    const ids = w.get('#r').attributes('aria-describedby')!.split(' ')
    expect(ids.slice(0, 2)).toEqual(['r-description', 'r-extra'])
    expect(ids.slice(2).map(id => w.get(`#${id}`).text())).toContain('Pick one')
  })

  it('TagGroup renders its ErrorMessage for an empty errorMessage and describes the list with it', () => {
    const w = mount(TagGroup, { props: { id: 't', items: [{ id: 'a', label: 'A' }], description: 'D', errorMessage: '' } })
    expect(w.get('#t-error').attributes('data-slot')).toBe('error-message')
    expect(w.get('[role=grid]').attributes('aria-describedby')).toBe('t-description t-error')
  })
})
