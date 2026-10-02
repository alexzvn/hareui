import type { ReactElement } from 'react'
import { Label, Meter } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

function M(props: { label?: string, output?: boolean } & Record<string, any>): ReactElement {
  const { label, output = true, ...rest } = props
  return (
    <Meter {...rest}>
      {label && <Label>{label}</Label>}
      {output && <Meter.Output />}
      <Meter.Track>
        <Meter.Fill />
      </Meter.Track>
    </Meter>
  )
}

cases['meter-basic'] = () => <M aria-label="Storage" className="w-64" label="Storage" value={60} />
for (const color of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`meter-color-${color}`] = () => <M className="w-64" color={color} label={color} value={50} />
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`meter-size-${size}`] = () => <M className="w-64" label={size} size={size} value={40} />
cases['meter-without-label'] = () => <M aria-label="Storage usage" className="w-64" output={false} value={45} />
cases['meter-custom-value'] = () => (
  <M className="w-64" formatOptions={{ currency: 'USD', style: 'currency' }} label="Revenue" maxValue={1000} minValue={0} value={750} />
)
cases['meter-clamped'] = () => <M className="w-64" label="Over" value={150} />
cases['meter-value-label'] = () => <M className="w-64" label="Steps" maxValue={4} value={3} valueLabel="3 of 4" />
cases['meter-custom-styles'] = () => (
  <Meter aria-label="Storage used" className="w-64" value={68}>
    <Label className="font-medium text-foreground">Storage used</Label>
    <Meter.Output className="text-muted tabular-nums" />
    <Meter.Track className="rounded-full bg-default">
      <Meter.Fill className="rounded-full bg-warning" />
    </Meter.Track>
  </Meter>
)
