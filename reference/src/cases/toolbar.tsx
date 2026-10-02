import type { ReactElement, ReactNode } from 'react'
import { Button, ButtonGroup, Separator, ToggleButton, ToggleButtonGroup, Toolbar } from '@heroui/react'

const icon = <svg aria-hidden="true" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"><rect height={10} width={10} x={3} y={3} /></svg>
const styles = (separator = true, props: Record<string, unknown> = {}, buttonClass?: string) => (
  <ToggleButtonGroup defaultSelectedKeys={['bold']} selectionMode="multiple" {...props}>
    {['bold', 'italic', 'underline'].map((v, i) => (
      <ToggleButton key={v} isIconOnly aria-label={v} className={buttonClass} id={v}>
        {separator && i > 0 && <ToggleButtonGroup.Separator />}
        {icon}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
)
const actions = (text = false) => (
  <ButtonGroup variant="tertiary">
    {['copy', 'cut'].map((v, i) => (
      <Button key={v} aria-label={text ? undefined : v} isIconOnly={!text}>
        {i > 0 && <ButtonGroup.Separator />}
        {icon}
        {text && v}
      </Button>
    ))}
  </ButtonGroup>
)
const toolbar = (props: Record<string, unknown>, children: ReactNode) => <Toolbar aria-label="Text formatting" {...props}>{children}</Toolbar>

export const cases: Record<string, () => ReactElement> = {
  'toolbar-basic': () => toolbar({}, <>{styles()}<Separator />{actions()}</>),
  'toolbar-vertical': () => toolbar({ orientation: 'vertical' }, <>{styles()}<Separator />{actions()}</>),
  'toolbar-attached': () => toolbar({ isAttached: true }, <>{styles()}<Separator />{actions()}</>),
  'toolbar-attached-vertical': () => toolbar({ isAttached: true, orientation: 'vertical' }, <>{styles()}<Separator />{actions()}</>),
  'toolbar-with-button-group': () => toolbar({}, <>{actions(true)}<Separator />{styles()}<Separator />{actions()}</>),
  'toolbar-custom': () => toolbar({ className: 'gap-1 rounded-xl border border-border/80 bg-surface-secondary p-1.5' },
    styles(false, { className: 'gap-0.5' }, 'rounded-lg data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground')),
}
