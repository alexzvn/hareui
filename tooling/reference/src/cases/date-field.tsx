import type { ReactElement } from 'react'
import { DateField, Description, FieldError, Label } from '@heroui/react'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'

interface FieldProps {
  variant?: 'primary' | 'secondary'
  isRequired?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isReadOnly?: boolean
  fullWidth?: boolean
  granularity?: 'day' | 'second'
  ui?: { group?: string, segment?: string }
}

// Inline SVG (no icon package dependency): mirrored verbatim in playground/src/parity/cases/date-field.ts
function Icon() {
  return (
    <svg className="size-4 text-muted" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4.75 1.5a.75.75 0 0 1 .75.75V3h5V2.25a.75.75 0 0 1 1.5 0V3h.25A2.5 2.5 0 0 1 14.75 5.5v6A2.5 2.5 0 0 1 12.25 14h-8.5A2.5 2.5 0 0 1 1.25 11.5v-6A2.5 2.5 0 0 1 3.75 3H4V2.25a.75.75 0 0 1 .75-.75ZM2.75 6.5v5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-5h-11Z" />
    </svg>
  )
}

function Field({ ui = {}, granularity, ...props }: FieldProps) {
  const defaultValue = granularity === 'second' ? new CalendarDateTime(2024, 3, 15, 10, 30, 15) : new CalendarDate(2024, 3, 15)
  return (
    <DateField defaultValue={defaultValue} granularity={granularity} name="date" {...props}>
      <Label>Date</Label>
      <DateField.Group className={ui.group} variant={props.variant}>
        <DateField.Input>
          {segment => <DateField.Segment className={ui.segment} segment={segment} />}
        </DateField.Input>
      </DateField.Group>
      {props.isInvalid
        ? <FieldError>Date must be in the future</FieldError>
        : <Description>Enter a date</Description>}
    </DateField>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'date-field-default': () => <Field />,
  'date-field-focus': () => <Field />,
  'date-field-secondary': () => <Field variant="secondary" />,
  'date-field-secondary-focus': () => <Field variant="secondary" />,
  'date-field-required': () => <Field isRequired />,
  'date-field-disabled': () => <Field isDisabled />,
  'date-field-readonly': () => <Field isReadOnly />,
  'date-field-invalid': () => <Field isInvalid />,
  'date-field-full-width': () => <Field fullWidth />,
  'date-field-granularity-second': () => <Field granularity="second" />,
  'date-field-with-prefix-icon': () => (
    <DateField defaultValue={new CalendarDate(2024, 3, 15)} name="date">
      <Label>Date</Label>
      <DateField.Group>
        <DateField.Prefix><Icon /></DateField.Prefix>
        <DateField.Input>{segment => <DateField.Segment segment={segment} />}</DateField.Input>
      </DateField.Group>
      <Description>Enter a date</Description>
    </DateField>
  ),
  'date-field-with-suffix-icon': () => (
    <DateField defaultValue={new CalendarDate(2024, 3, 15)} name="date">
      <Label>Date</Label>
      <DateField.Group>
        <DateField.Input>{segment => <DateField.Segment segment={segment} />}</DateField.Input>
        <DateField.Suffix><Icon /></DateField.Suffix>
      </DateField.Group>
      <Description>Enter a date</Description>
    </DateField>
  ),
  'date-field-with-prefix-and-suffix': () => (
    <DateField defaultValue={new CalendarDate(2024, 3, 15)} name="date">
      <Label>Date</Label>
      <DateField.Group>
        <DateField.Prefix><Icon /></DateField.Prefix>
        <DateField.Input>{segment => <DateField.Segment segment={segment} />}</DateField.Input>
        <DateField.Suffix><Icon /></DateField.Suffix>
      </DateField.Group>
      <Description>Enter a date</Description>
    </DateField>
  ),
  'date-field-user-overrides': () => <Field variant="secondary" ui={{ group: 'rounded-xl bg-default', segment: 'text-foreground' }} />,
}
