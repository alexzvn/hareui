import type { ReactElement } from 'react'
import { Checkbox, Description, FieldError } from '@heroui/react'

type Props = Parameters<typeof Checkbox>[0]

function box(props: Omit<Props, 'children'>, label: string | null = 'Accept terms and conditions', extra?: ReactElement) {
  return (
    <Checkbox name="terms" {...props}>
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        {label}
      </Checkbox.Content>
      {extra}
    </Checkbox>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'checkbox-primary': () => box({}),
  'checkbox-secondary': () => box({ variant: 'secondary' }),
  'checkbox-checked': () => box({ defaultSelected: true }),
  'checkbox-secondary-checked': () => box({ variant: 'secondary', defaultSelected: true }),
  'checkbox-indeterminate': () => box({ isIndeterminate: true }),
  'checkbox-secondary-indeterminate': () => box({ variant: 'secondary', isIndeterminate: true }),
  'checkbox-disabled': () => box({ isDisabled: true }),
  'checkbox-disabled-checked': () => box({ isDisabled: true, defaultSelected: true }),
  'checkbox-required': () => box({ isRequired: true }),
  'checkbox-invalid': () => box({ isInvalid: true }, 'I agree to the terms', <FieldError>You must accept the terms to continue</FieldError>),
  'checkbox-invalid-checked': () => box({ isInvalid: true, defaultSelected: true }, 'I agree to the terms', <FieldError>You must accept the terms to continue</FieldError>),
  'checkbox-invalid-indeterminate': () => box({ isInvalid: true, isIndeterminate: true }, 'I agree to the terms'),
  'checkbox-with-description': () => box({}, 'Email notifications', <Description>Get notified when someone mentions you in a comment</Description>),
  'checkbox-no-label': () => box({ 'aria-label': 'Accept terms' }, null),
  'checkbox-readonly': () => box({ isReadOnly: true, defaultSelected: true }),
  'checkbox-readonly-unchecked': () => box({ isReadOnly: true }),
}
