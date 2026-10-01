import type { ReactElement } from 'react'
import { Description, FieldError, Label, NumberField } from '@heroui/react'

interface FieldProps {
  variant?: 'primary' | 'secondary'
  isRequired?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isReadOnly?: boolean
  fullWidth?: boolean
  defaultValue?: number
  buttons?: boolean
  ui?: { group?: string, input?: string, incrementButton?: string }
}

function Field({ defaultValue = 1024, buttons = true, ui = {}, ...props }: FieldProps) {
  return (
    <NumberField defaultValue={defaultValue} minValue={0} {...props}>
      <Label>Width</Label>
      <NumberField.Group className={ui.group}>
        {buttons && <NumberField.DecrementButton />}
        <NumberField.Input className={ui.input} />
        {buttons && <NumberField.IncrementButton className={ui.incrementButton} />}
      </NumberField.Group>
      <Description>Enter the width in pixels</Description>
      {props.isInvalid && <FieldError>Width must be at least 0</FieldError>}
    </NumberField>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'number-field-default': () => <Field />,
  'number-field-focus': () => <Field />,
  'number-field-increment': () => <Field />,
  'number-field-at-min': () => <Field defaultValue={0} />,
  'number-field-secondary': () => <Field variant="secondary" />,
  'number-field-secondary-focus': () => <Field variant="secondary" />,
  'number-field-required': () => <Field isRequired />,
  'number-field-disabled': () => <Field isDisabled />,
  'number-field-invalid': () => <Field isInvalid />,
  'number-field-full-width': () => <Field fullWidth />,
  'number-field-readonly': () => <Field isReadOnly />,
  'number-field-percent': () => (
    <NumberField defaultValue={0.5} formatOptions={{ style: 'percent' }} maxValue={1} minValue={0} step={0.1}>
      <Label>Percentage</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  ),
  'number-field-no-buttons': () => <Field buttons={false} />,
  'number-field-user-overrides': () => <Field variant="secondary" ui={{ group: 'rounded-xl bg-default', input: 'text-center', incrementButton: 'text-muted' }} />,
}
