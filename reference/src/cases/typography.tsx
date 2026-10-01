import type { ReactElement } from 'react'
import { Typography } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const headings = {
  h1: 'Build better interfaces',
  h2: 'Typography that stays semantic',
  h3: 'Composable by default',
  h4: 'Small heading',
  h5: 'Card titles',
  h6: 'Smaller feature headers',
} as const

for (const [type, text] of Object.entries(headings)) {
  cases[`typography-${type}`] = () => (
    <Typography className="w-[420px]" type={type as keyof typeof headings}>{text}</Typography>
  )
}

cases['typography-body'] = () => (
  <Typography className="w-[420px]">HeroUI Typography uses React Aria Components Text as the primitive, with semantic typography types and render-prop polymorphism.</Typography>
)
cases['typography-body-sm'] = () => (
  <Typography className="w-[420px]" color="muted" type="body-sm">Smaller muted body copy for secondary descriptions.</Typography>
)
cases['typography-body-xs'] = () => (
  <Typography className="w-[420px]" type="body-xs">Captions, badges, helper text, and fine print.</Typography>
)
cases['typography-code'] = () => <Typography type="code">pnpm add @heroui/react</Typography>

cases['typography-align-center'] = () => (
  <Typography align="center" className="w-[420px]">Centered body copy.</Typography>
)
cases['typography-align-end'] = () => (
  <Typography align="end" className="w-[420px]">End-aligned body copy.</Typography>
)
cases['typography-align-justify'] = () => (
  <Typography align="justify" className="w-[420px]">Justified body copy stretches each line so the left and right edges line up evenly across the paragraph.</Typography>
)

cases['typography-color-muted'] = () => (
  <Typography className="w-[420px]" color="muted">Muted secondary text.</Typography>
)

cases['typography-weight-normal'] = () => (
  <Typography className="w-[420px]" type="h2" weight="normal">Normal weight heading</Typography>
)
cases['typography-weight-medium'] = () => (
  <Typography className="w-[420px]" weight="medium">Medium weight body text</Typography>
)
cases['typography-weight-semibold'] = () => (
  <Typography className="w-[420px]" weight="semibold">Semibold weight body text</Typography>
)
cases['typography-weight-bold'] = () => (
  <Typography className="w-[420px]" weight="bold">Bold weight body text</Typography>
)

cases['typography-truncate'] = () => (
  <Typography className="w-48" truncate>This line of text is much longer than the container and must be truncated with an ellipsis.</Typography>
)

cases['typography-as-override'] = () => (
  <Typography
    className="w-[420px]"
    render={({ children, ...domProps }) => <h2 {...domProps}>{children}</h2>}
    type="h1"
  >
    H1 visual style, h2 semantic element
  </Typography>
)

cases['typography-prose'] = () => (
  <Typography.Prose className="w-[420px] flex flex-col gap-3">
    <h1>Prose title</h1>
    <p>Prose is for authored content where the markup is already semantic and HeroUI applies the default typography rhythm.</p>
    <h2>Section title</h2>
    <p>Inline code like <code>render</code> receives the same code treatment as the Typography primitive.</p>
  </Typography.Prose>
)
