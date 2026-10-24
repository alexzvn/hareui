import type { ReactElement } from 'react'
import { Checkbox, CheckboxGroup, Description, FieldError, Label } from '@heroui/react'

type Props = Parameters<typeof CheckboxGroup>[0]

interface Item { value: string, label: string, description?: string, disabled?: boolean }

const interests: Item[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
]

function group(props: Omit<Props, 'children'>, items: Item[] = interests, head?: { label?: string, description?: string }, error?: string) {
  return (
    <CheckboxGroup name="interests" {...props}>
      {head?.label ? <Label>{head.label}</Label> : null}
      {head?.description ? <Description>{head.description}</Description> : null}
      {items.map(item => (
        <Checkbox key={item.value} isDisabled={item.disabled} value={item.value}>
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            {item.label}
          </Checkbox.Content>
          {item.description ? <Description>{item.description}</Description> : null}
        </Checkbox>
      ))}
      {error ? <FieldError>{error}</FieldError> : null}
    </CheckboxGroup>
  )
}

const head = { label: 'Select your interests', description: 'Choose all that apply' }

export const cases: Record<string, () => ReactElement> = {
  'checkbox-group-primary': () => group({ 'defaultValue': ['design'], 'aria-label': 'Interests' }),
  'checkbox-group-secondary': () => group({ 'defaultValue': ['design'], 'variant': 'secondary', 'aria-label': 'Interests' }),
  'checkbox-group-with-label': () => group({ defaultValue: ['design'] }, [
    { value: 'coding', label: 'Coding', description: 'Love building software' },
    { value: 'design', label: 'Design', description: 'Enjoy creating beautiful interfaces' },
    { value: 'writing', label: 'Writing', description: 'Passionate about content creation' },
  ], head),
  'checkbox-group-required': () => group({ isRequired: true }, interests, head),
  'checkbox-group-disabled': () => group({ 'defaultValue': ['design'], 'isDisabled': true, 'aria-label': 'Interests' }),
  'checkbox-group-item-disabled': () => group({ 'defaultValue': ['design'], 'aria-label': 'Interests' }, [
    { value: 'coding', label: 'Coding' },
    { value: 'design', label: 'Design' },
    { value: 'writing', label: 'Writing', disabled: true },
  ]),
  'checkbox-group-invalid': () => group({ isInvalid: true }, interests, { label: 'Interests' }, 'Select at least one interest'),
  'checkbox-group-invalid-selected': () => group({ isInvalid: true, defaultValue: ['design'] }, interests, { label: 'Interests' }, 'Select at least one interest'),
  'checkbox-group-readonly': () => group({ 'defaultValue': ['design'], 'isReadOnly': true, 'aria-label': 'Interests' }),
  'checkbox-group-user-overrides': () => (
    <CheckboxGroup aria-label="Interests" className="**:data-[slot=checkbox]:mt-0" defaultValue={['design']} name="interests">
      {interests.map(item => (
        <Checkbox key={item.value} value={item.value}>
          <Checkbox.Content className="rounded-xl data-[selected=true]:bg-accent/10">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            {item.label}
          </Checkbox.Content>
        </Checkbox>
      ))}
    </CheckboxGroup>
  ),
}

// Same renders, different interaction targets (see parity/cases/checkbox-group.json)
cases['checkbox-group-primary-item'] = cases['checkbox-group-primary']!
cases['checkbox-group-primary-selected-item'] = cases['checkbox-group-primary']!
cases['checkbox-group-secondary-item'] = cases['checkbox-group-secondary']!
cases['checkbox-group-secondary-selected-item'] = cases['checkbox-group-secondary']!
cases['checkbox-group-disabled-with-label'] = () => group({ defaultValue: ['design'], isDisabled: true }, interests, head)
