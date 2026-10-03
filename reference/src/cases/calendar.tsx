import type { DateValue } from '@internationalized/date'
import type { ReactElement } from 'react'
import { Calendar } from '@heroui/react'
import { isWeekend, parseDate } from '@internationalized/date'

export const cases: Record<string, () => ReactElement> = {}

// January 2025 never contains "today", so the grid is deterministic.
const focused = parseDate('2025-01-15')

function Cal(props: Partial<React.ComponentProps<typeof Calendar>> & { indicator?: (date: DateValue) => boolean }) {
  const { indicator, ...rest } = props
  return (
    <Calendar aria-label="Event date" defaultFocusedValue={focused} {...rest}>
      <Calendar.Header>
        <Calendar.Heading />
        <Calendar.NavButton slot="previous" />
        <Calendar.NavButton slot="next" />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {day => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {date => (
            <Calendar.Cell date={date}>
              {({ formattedDate }) => (
                <>
                  {formattedDate}
                  {indicator?.(date) && <Calendar.CellIndicator />}
                </>
              )}
            </Calendar.Cell>
          )}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  )
}

cases['calendar-basic'] = () => <Cal />
cases['calendar-selected'] = () => <Cal defaultValue={parseDate('2025-01-15')} />
cases['calendar-disabled'] = () => <Cal isDisabled />
cases['calendar-read-only'] = () => <Cal isReadOnly defaultValue={parseDate('2025-01-15')} />
cases['calendar-unavailable'] = () => <Cal isDateUnavailable={date => isWeekend(date, 'en-US')} />
cases['calendar-indicator'] = () => <Cal defaultValue={parseDate('2025-01-15')} indicator={date => [3, 15, 22].includes(date.day)} />
// March 2024 spans 6 calendar weeks (Fri Mar 1 -> Sun Mar 31).
cases['calendar-six-week-month'] = () => <Cal defaultFocusedValue={undefined} defaultValue={parseDate('2024-03-15')} />
cases['calendar-min-max'] = () => <Cal minValue={parseDate('2025-01-10')} maxValue={parseDate('2025-01-20')} />

// Week view / day view (visibleDuration). Jan 2025 never contains "today".
cases['calendar-week-view'] = () => <Cal visibleDuration={{ weeks: 1 }} defaultValue={parseDate('2025-01-15')} />
cases['calendar-week-view-multiple'] = () => <Cal visibleDuration={{ weeks: 3 }} />
cases['calendar-day-view'] = () => <Cal visibleDuration={{ days: 5 }} defaultValue={parseDate('2025-01-15')} />
cases['calendar-day-view-long'] = () => <Cal visibleDuration={{ days: 10 }} />
