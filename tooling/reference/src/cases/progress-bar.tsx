import type { ReactElement } from 'react'
import { Label, ProgressBar } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

function Bar(props: { label?: string, output?: boolean } & Record<string, any>): ReactElement {
  const { label, output = true, ...rest } = props
  return (
    <ProgressBar {...rest}>
      {label && <Label>{label}</Label>}
      {output && <ProgressBar.Output />}
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  )
}

cases['progress-bar-basic'] = () => <Bar aria-label="Loading" className="w-64" label="Loading" value={60} />
for (const color of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`progress-bar-color-${color}`] = () => <Bar className="w-64" color={color} label={color} value={50} />
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`progress-bar-size-${size}`] = () => <Bar className="w-64" label={size} size={size} value={40} />
cases['progress-bar-without-label'] = () => <Bar aria-label="Loading progress" className="w-64" output={false} value={45} />
cases['progress-bar-indeterminate'] = () => <Bar isIndeterminate aria-label="Loading" className="w-64" label="Loading..." output={false} />
cases['progress-bar-custom-value'] = () => (
  <Bar className="w-52" formatOptions={{ currency: 'USD', style: 'currency' }} label="Progress" maxValue={1000} minValue={200} value={750} />
)
cases['progress-bar-clamped'] = () => <Bar className="w-64" label="Over" value={150} />
cases['progress-bar-value-label'] = () => <Bar className="w-64" label="Steps" maxValue={4} value={3} valueLabel="3 of 4" />
cases['progress-bar-custom-styles'] = () => (
  <ProgressBar aria-label="Upload progress" className="w-64" value={45}>
    <Label className="font-medium text-foreground">Uploading resume.pdf</Label>
    <ProgressBar.Output className="text-xs text-muted tabular-nums" />
    <ProgressBar.Track className="rounded-full bg-default">
      <ProgressBar.Fill className="rounded-full bg-accent" />
    </ProgressBar.Track>
  </ProgressBar>
)
