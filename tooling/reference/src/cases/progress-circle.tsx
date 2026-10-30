import type { ReactElement } from 'react'
import { ProgressCircle } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

function P(props: { stroke?: number, trackClassName?: string, fillClassName?: string } & Record<string, any>): ReactElement {
  const { stroke, trackClassName, fillClassName, ...rest } = props
  const svg = stroke === undefined ? {} : { strokeWidth: stroke, viewBox: '0 0 36 36' }
  const circle = stroke === undefined ? {} : { cx: 18, cy: 18, r: 18 - stroke / 2, strokeWidth: stroke }
  return (
    <ProgressCircle {...rest}>
      <ProgressCircle.Track {...svg}>
        <ProgressCircle.TrackCircle className={trackClassName} {...circle} />
        <ProgressCircle.FillCircle className={fillClassName} {...circle} />
      </ProgressCircle.Track>
    </ProgressCircle>
  )
}

cases['progress-circle-basic'] = () => <P aria-label="Loading" value={60} />
for (const color of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`progress-circle-color-${color}`] = () => <P aria-label={color} color={color} value={60} />
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`progress-circle-size-${size}`] = () => <P aria-label="Loading" size={size} value={40} />
cases['progress-circle-indeterminate'] = () => <P isIndeterminate aria-label="Loading" />
cases['progress-circle-zero'] = () => <P aria-label="Loading" value={0} />
cases['progress-circle-full'] = () => <P aria-label="Loading" value={100} />
cases['progress-circle-custom-range'] = () => <P aria-label="Loading" maxValue={150} minValue={50} value={75} />
cases['progress-circle-thin'] = () => <P aria-label="Thin circle" stroke={2} value={60} />
cases['progress-circle-thick'] = () => <P aria-label="Thick circle" stroke={6} value={60} />
cases['progress-circle-custom-styles'] = () => (
  <P
    aria-label="Sync progress"
    className="size-14 text-neutral-700 dark:text-neutral-300"
    fillClassName="stroke-neutral-700 dark:stroke-neutral-300"
    trackClassName="stroke-neutral-200 dark:stroke-neutral-800"
    value={68}
  />
)
