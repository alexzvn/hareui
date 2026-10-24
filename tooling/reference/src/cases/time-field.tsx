import type { ReactElement } from 'react'
import { Description, FieldError, Label, TimeField } from '@heroui/react'
import { Time } from '@internationalized/date'

type FieldProps = {
  variant?: 'primary' | 'secondary'
  isRequired?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isReadOnly?: boolean
  fullWidth?: boolean
  granularity?: 'minute' | 'second'
  hourCycle?: 12 | 24
  ui?: { group?: string, segment?: string }
}

// Inline SVG (no icon package dependency): mirrored verbatim in playground/src/parity/cases/time-field.ts
function Icon() {
  return (
    <svg className="size-4 text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 16 16">
      <circle cx={8} cy={8} r={6.25} />
      <path d="M8 4.75V8l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Field({ ui = {}, defaultValue, ...props }: FieldProps & { defaultValue?: Time }) {
  return (
    <TimeField defaultValue={defaultValue ?? new Time(9, 30)} name="time" {...props}>
      <Label>Time</Label>
      <TimeField.Group className={ui.group} variant={props.variant}>
        <TimeField.Input>
          {segment => <TimeField.Segment className={ui.segment} segment={segment} />}
        </TimeField.Input>
      </TimeField.Group>
      {props.isInvalid
        ? <FieldError>Time must be within business hours</FieldError>
        : <Description>Enter a time</Description>}
    </TimeField>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'time-field-default': () => <Field />,
  'time-field-focus': () => <Field />,
  'time-field-secondary': () => <Field variant="secondary" />,
  'time-field-secondary-focus': () => <Field variant="secondary" />,
  'time-field-required': () => <Field isRequired />,
  'time-field-disabled': () => <Field isDisabled />,
  'time-field-readonly': () => <Field isReadOnly />,
  'time-field-invalid': () => <Field isInvalid />,
  'time-field-full-width': () => <Field fullWidth />,
  'time-field-granularity-second': () => <Field defaultValue={new Time(9, 30, 15)} granularity="second" />,
  'time-field-12-hour': () => <Field hourCycle={12} />,
  'time-field-with-prefix-icon': () => (
    <TimeField defaultValue={new Time(9, 30)} name="time">
      <Label>Time</Label>
      <TimeField.Group>
        <TimeField.Prefix><Icon /></TimeField.Prefix>
        <TimeField.Input>{segment => <TimeField.Segment segment={segment} />}</TimeField.Input>
      </TimeField.Group>
      <Description>Enter a time</Description>
    </TimeField>
  ),
  'time-field-with-suffix-icon': () => (
    <TimeField defaultValue={new Time(9, 30)} name="time">
      <Label>Time</Label>
      <TimeField.Group>
        <TimeField.Input>{segment => <TimeField.Segment segment={segment} />}</TimeField.Input>
        <TimeField.Suffix><Icon /></TimeField.Suffix>
      </TimeField.Group>
      <Description>Enter a time</Description>
    </TimeField>
  ),
  'time-field-with-prefix-and-suffix': () => (
    <TimeField defaultValue={new Time(9, 30)} name="time">
      <Label>Time</Label>
      <TimeField.Group>
        <TimeField.Prefix><Icon /></TimeField.Prefix>
        <TimeField.Input>{segment => <TimeField.Segment segment={segment} />}</TimeField.Input>
        <TimeField.Suffix><Icon /></TimeField.Suffix>
      </TimeField.Group>
      <Description>Enter a time</Description>
    </TimeField>
  ),
  'time-field-user-overrides': () => <Field variant="secondary" ui={{ group: 'rounded-xl bg-default', segment: 'text-foreground' }} />,
}
