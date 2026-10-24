import type { DateValue } from '@internationalized/date'
import type { CSSProperties, ReactElement } from 'react'
import { DateField, DateRangePicker, Description, FieldError, Label, RangeCalendar } from '@heroui/react'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'

type PickerProps = {
  className?: string
  style?: CSSProperties
  variant?: 'primary' | 'secondary'
  isRequired?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  fullWidth?: boolean
  inputContainer?: boolean
  description?: string
  defaultValue?: { start: DateValue, end: DateValue }
  defaultPlaceholder?: CalendarDate
  minValue?: CalendarDate
  maxValue?: CalendarDate
  defaultOpen?: boolean
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
}

function Picker({ className = 'w-80', variant, fullWidth, inputContainer, description, isInvalid, defaultPlaceholder, ...props }: PickerProps) {
  const inputs = (
    <>
      <DateField.Input slot="start">{segment => <DateField.Segment segment={segment} />}</DateField.Input>
      <DateRangePicker.RangeSeparator />
      <DateField.Input slot="end">{segment => <DateField.Segment segment={segment} />}</DateField.Input>
    </>
  )
  return (
    <DateRangePicker className={className} startName="startDate" endName="endDate" isInvalid={isInvalid} placeholderValue={defaultPlaceholder} {...props}>
      <Label>Trip dates</Label>
      <DateField.Group fullWidth={fullWidth} variant={variant}>
        {inputContainer ? <DateField.InputContainer>{inputs}</DateField.InputContainer> : inputs}
        <DateField.Suffix>
          <DateRangePicker.Trigger>
            <DateRangePicker.TriggerIndicator />
          </DateRangePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      {description ? <Description>{description}</Description> : null}
      {isInvalid ? <FieldError>Select a valid range starting today or later.</FieldError> : null}
      <DateRangePicker.Popover>
        <RangeCalendar aria-label="Trip dates" defaultFocusedValue={defaultPlaceholder}>
          <RangeCalendar.Header>
            <RangeCalendar.YearPickerTrigger>
              <RangeCalendar.YearPickerTriggerHeading />
              <RangeCalendar.YearPickerTriggerIndicator />
            </RangeCalendar.YearPickerTrigger>
            <RangeCalendar.NavButton slot="previous" />
            <RangeCalendar.NavButton slot="next" />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {day => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>{date => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody>
          </RangeCalendar.Grid>
          <RangeCalendar.YearPickerGrid>
            <RangeCalendar.YearPickerGridBody>
              {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
            </RangeCalendar.YearPickerGridBody>
          </RangeCalendar.YearPickerGrid>
        </RangeCalendar>
      </DateRangePicker.Popover>
    </DateRangePicker>
  )
}

const range = { start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) }

export const cases: Record<string, () => ReactElement> = {
  'date-range-picker-default': () => <Picker fullWidth defaultValue={range} />,
  'date-range-picker-empty': () => <Picker fullWidth />,
  'date-range-picker-secondary': () => <Picker fullWidth defaultValue={range} variant="secondary" />,
  'date-range-picker-required': () => <Picker fullWidth defaultValue={range} isRequired />,
  'date-range-picker-disabled': () => <Picker fullWidth defaultValue={range} isDisabled description="This date range picker is disabled." />,
  'date-range-picker-invalid': () => <Picker fullWidth defaultValue={range} isInvalid />,
  'date-range-picker-full-width': () => <Picker fullWidth defaultValue={range} className="w-full" />,
  'date-range-picker-input-container': () => (
    <Picker
      className=""
      style={{ width: '100%', maxWidth: '18rem', minWidth: '20rem' }}
      inputContainer
      granularity="second"
      hourCycle={12}
      defaultValue={{ start: new CalendarDateTime(2026, 2, 3, 8, 45), end: new CalendarDateTime(2026, 2, 10, 18, 45) }}
    />
  ),
  'date-range-picker-open': () => <Picker fullWidth defaultValue={range} defaultOpen />,
  'date-range-picker-open-unavailable': () => (
    <Picker
      fullWidth
      defaultOpen
      defaultPlaceholder={new CalendarDate(2024, 3, 1)}
      minValue={new CalendarDate(2024, 3, 10)}
      maxValue={new CalendarDate(2024, 3, 20)}
    />
  ),
}
