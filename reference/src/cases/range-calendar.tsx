import type { DateValue } from '@internationalized/date'
import type { ReactElement } from 'react'
import { RangeCalendar } from '@heroui/react'
import { isWeekend, parseDate } from '@internationalized/date'

export const cases: Record<string, () => ReactElement> = {}

// January 2025 never contains "today", so the grid is deterministic.
const focused = parseDate('2025-01-15')

function Cal(props: Partial<React.ComponentProps<typeof RangeCalendar>> & { indicator?: (date: DateValue) => boolean }) {
  const { indicator, ...rest } = props
  return (
    <RangeCalendar aria-label="Event dates" defaultFocusedValue={focused} {...rest}>
      <RangeCalendar.Header>
        <RangeCalendar.Heading />
        <RangeCalendar.NavButton slot="previous" />
        <RangeCalendar.NavButton slot="next" />
      </RangeCalendar.Header>
      <RangeCalendar.Grid>
        <RangeCalendar.GridHeader>
          {day => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
        </RangeCalendar.GridHeader>
        <RangeCalendar.GridBody>
          {date => (
            <RangeCalendar.Cell date={date}>
              {({ formattedDate }) => (
                <>
                  {formattedDate}
                  {indicator?.(date) && <RangeCalendar.CellIndicator />}
                </>
              )}
            </RangeCalendar.Cell>
          )}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    </RangeCalendar>
  )
}

cases['range-calendar-basic'] = () => <Cal />
cases['range-calendar-selected'] = () => <Cal defaultValue={{ start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }} />
cases['range-calendar-disabled'] = () => <Cal isDisabled />
cases['range-calendar-read-only'] = () => <Cal isReadOnly defaultValue={{ start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }} />
cases['range-calendar-unavailable'] = () => <Cal isDateUnavailable={date => isWeekend(date, 'en-US')} />
cases['range-calendar-min-max'] = () => <Cal minValue={parseDate('2025-01-10')} maxValue={parseDate('2025-01-20')} />
cases['range-calendar-indicator'] = () => <Cal defaultValue={{ start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }} indicator={date => [3, 15, 22].includes(date.day)} />
cases['range-calendar-non-contiguous'] = () => (
  <Cal
    defaultValue={{ start: parseDate('2025-01-10'), end: parseDate('2025-01-18') }}
    isDateUnavailable={date => isWeekend(date, 'en-US')}
    allowsNonContiguousRanges
  />
)
