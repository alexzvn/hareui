import type { ReactElement } from 'react'
import { Button, Sheet } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

type Placement = 'bottom' | 'top' | 'left' | 'right'
type Variant = 'opaque' | 'blur' | 'transparent'

type CaseProps = {
  placement?: Placement
  variant?: Variant
  close?: boolean
  footer?: boolean
  detached?: boolean
  scroll?: boolean
  snapPoints?: string[]
  className?: string
  title?: string
}

// Mirrors the playground: top and bottom sheets render the handle (after the footer for `top`), side sheets don't.
function Case({ placement = 'bottom', variant, close = false, footer = false, detached = false, scroll = false, snapPoints, className, title = 'Sheet Title' }: CaseProps) {
  const handle = placement === 'bottom' || placement === 'top'
  return (
    <Sheet defaultOpen isDetached={detached} placement={placement} snapPoints={snapPoints}>
      <Sheet.Backdrop variant={variant}>
        <Sheet.Content className={className}>
          <Sheet.Dialog>
            {handle && placement !== 'top' && <Sheet.Handle />}
            {close && <Sheet.CloseTrigger />}
            <Sheet.Header>
              <Sheet.Heading>{title}</Sheet.Heading>
            </Sheet.Header>
            <Sheet.Body>
              {scroll
                ? Array.from({ length: 20 }, (_, i) => (
                    <p key={i} className="mb-3 text-sm text-muted">
                      {`Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis.`}
                    </p>
                  ))
                : <p className="text-sm text-muted">This sheet slides in from the edge of the screen.</p>}
            </Sheet.Body>
            {footer && (
              <Sheet.Footer>
                <Button variant="secondary">Cancel</Button>
                <Button>Done</Button>
              </Sheet.Footer>
            )}
            {handle && placement === 'top' && <Sheet.Handle />}
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  )
}

for (const placement of ['bottom', 'top', 'left', 'right'] as const)
  cases[`sheet-placement-${placement}`] = () => <Case close footer placement={placement} />

for (const variant of ['opaque', 'blur', 'transparent'] as const)
  cases[`sheet-variant-${variant}`] = () => <Case close footer variant={variant} />

for (const placement of ['bottom', 'right'] as const)
  cases[`sheet-detached-${placement}`] = () => <Case detached placement={placement} />

cases['sheet-snap-points'] = () => <Case snapPoints={['148px', '355px']} title="Snap Points" />
cases['sheet-scrollable'] = () => <Case close footer scroll className="mx-auto max-h-[95vh] max-w-[420px]" title="Terms & Conditions" />
