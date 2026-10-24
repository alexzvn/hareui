import type { ReactElement } from 'react'
import { Description, FieldError, Label, Radio, RadioGroup } from '@heroui/react'

type Props = Parameters<typeof RadioGroup>[0]

type Item = { value: string, label: string, description?: string, disabled?: boolean }

const plans: Item[] = [
  { value: 'basic', label: 'Basic Plan' },
  { value: 'premium', label: 'Premium Plan' },
  { value: 'business', label: 'Business Plan' },
]

function group(props: Omit<Props, 'children'>, items: Item[] = plans, head?: { label?: string, description?: string }, error?: string) {
  return (
    <RadioGroup name="plan" {...props}>
      {head?.label ? <Label>{head.label}</Label> : null}
      {head?.description ? <Description>{head.description}</Description> : null}
      {items.map(item => (
        <Radio key={item.value} value={item.value} isDisabled={item.disabled}>
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            {item.label}
          </Radio.Content>
          {item.description ? <Description>{item.description}</Description> : null}
        </Radio>
      ))}
      {error ? <FieldError>{error}</FieldError> : null}
    </RadioGroup>
  )
}

const head = { label: 'Plan selection', description: 'Choose the plan that suits you best' }

export const cases: Record<string, () => ReactElement> = {
  'radio-group-primary': () => group({ 'defaultValue': 'premium', 'aria-label': 'Plan' }),
  'radio-group-secondary': () => group({ 'defaultValue': 'premium', 'variant': 'secondary', 'aria-label': 'Plan' }),
  'radio-group-horizontal': () => group({ 'defaultValue': 'premium', 'orientation': 'horizontal', 'aria-label': 'Plan' }),
  'radio-group-with-label': () => group({ defaultValue: 'premium' }, [
    { value: 'basic', label: 'Basic Plan', description: 'Includes 100 messages per month' },
    { value: 'premium', label: 'Premium Plan', description: 'Includes 200 messages per month' },
    { value: 'business', label: 'Business Plan', description: 'Unlimited messages' },
  ], head),
  'radio-group-required': () => group({ isRequired: true }, plans, head),
  'radio-group-disabled': () => group({ 'defaultValue': 'premium', 'isDisabled': true, 'aria-label': 'Plan' }),
  'radio-group-item-disabled': () => group({ 'defaultValue': 'premium', 'aria-label': 'Plan' }, [
    { value: 'basic', label: 'Basic Plan' },
    { value: 'premium', label: 'Premium Plan' },
    { value: 'business', label: 'Business Plan', disabled: true },
  ]),
  'radio-group-invalid': () => group({ isInvalid: true }, plans, { label: 'Plan selection' }, 'Please select a plan'),
  'radio-group-invalid-selected': () => group({ isInvalid: true, defaultValue: 'premium' }, plans, { label: 'Plan selection' }, 'Please select a plan'),
  'radio-group-readonly': () => group({ 'defaultValue': 'premium', 'isReadOnly': true, 'aria-label': 'Plan' }),
  'radio-group-user-overrides': () => (
    <RadioGroup aria-label="Plan" className="**:data-[slot=radio]:mt-0" defaultValue="premium" name="plan">
      {plans.map(item => (
        <Radio key={item.value} value={item.value}>
          <Radio.Content className="rounded-xl data-[selected=true]:bg-accent/10">
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            {item.label}
          </Radio.Content>
        </Radio>
      ))}
    </RadioGroup>
  ),
}

// Same renders, different interaction targets (see parity/cases/radio-group.json)
cases['radio-group-primary-item'] = cases['radio-group-primary']!
cases['radio-group-primary-selected-item'] = cases['radio-group-primary']!
cases['radio-group-secondary-item'] = cases['radio-group-secondary']!
cases['radio-group-secondary-selected-item'] = cases['radio-group-secondary']!
cases['radio-group-disabled-with-label'] = () => group({ defaultValue: 'premium', isDisabled: true }, plans, head)
