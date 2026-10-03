import type { ReactElement } from 'react'
import { Calendar, DateField, DatePicker, FieldError, Label } from '@heroui/react'
import { CalendarDate } from '@internationalized/date'

interface FieldProps {
  variant?: 'primary' | 'secondary'
  isRequired?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  fullWidth?: boolean
  defaultValue?: CalendarDate
  defaultPlaceholder?: CalendarDate
  minValue?: CalendarDate
  maxValue?: CalendarDate
  defaultOpen?: boolean
}

// HeroUI's DatePicker has no `defaultPlaceholder`; React Aria's `placeholderValue` is the equivalent (it also
// becomes the calendar's `defaultFocusedValue`).
function Field({ variant, isRequired, isDisabled, isInvalid, fullWidth, defaultPlaceholder, ...props }: FieldProps) {
  return (
    <DatePicker className={fullWidth ? 'w-full' : 'w-72'} name="date" isRequired={isRequired} isDisabled={isDisabled} isInvalid={isInvalid} placeholderValue={defaultPlaceholder} {...props}>
      <Label>Date</Label>
      <DateField.Group fullWidth={fullWidth} variant={variant}>
        <DateField.Input>{segment => <DateField.Segment segment={segment} />}</DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      {isInvalid ? <FieldError>Date must be in the future</FieldError> : null}
      <DatePicker.Popover>
        <Calendar aria-label="Event date">
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {day => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>{date => <Calendar.Cell date={date} />}</Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  )
}

const selected = { defaultValue: new CalendarDate(2024, 3, 15) }

export const cases: Record<string, () => ReactElement> = {
  'date-picker-default': () => <Field {...selected} />,
  'date-picker-focus': () => <Field {...selected} />,
  'date-picker-secondary': () => <Field {...selected} variant="secondary" />,
  'date-picker-required': () => <Field {...selected} isRequired />,
  'date-picker-disabled': () => <Field {...selected} isDisabled />,
  'date-picker-invalid': () => <Field {...selected} isInvalid />,
  'date-picker-full-width': () => <Field {...selected} fullWidth />,
  'date-picker-open': () => <Field {...selected} defaultOpen />,
  'date-picker-open-unavailable': () => (
    <Field
      defaultOpen
      defaultPlaceholder={new CalendarDate(2024, 3, 1)}
      minValue={new CalendarDate(2024, 3, 10)}
      maxValue={new CalendarDate(2024, 3, 20)}
    />
  ),
}
