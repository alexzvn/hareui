import type { ReactElement } from 'react'
import { Button, Drawer } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

type Placement = 'bottom' | 'top' | 'left' | 'right'
type Variant = 'opaque' | 'blur' | 'transparent'

function Case({ placement = 'bottom', variant, handle = false, close = true, title = 'Drawer Title', scroll = false }: { placement?: Placement, variant?: Variant, handle?: boolean, close?: boolean, title?: string, scroll?: boolean }) {
  return (
    <Drawer defaultOpen>
      <Drawer.Backdrop variant={variant}>
        <Drawer.Content placement={placement}>
          <Drawer.Dialog>
            {close && <Drawer.CloseTrigger />}
            {handle && placement !== 'top' && <Drawer.Handle />}
            <Drawer.Header>
              <Drawer.Heading>{title}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              {scroll
                ? Array.from({ length: 20 }, (_, i) => (
                    <p key={i} className="mb-3">
                      {`Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis.`}
                    </p>
                  ))
                : <p>This drawer slides in from the edge of the screen.</p>}
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="secondary">Cancel</Button>
              <Button>Done</Button>
            </Drawer.Footer>
            {handle && placement === 'top' && <Drawer.Handle />}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  )
}

for (const placement of ['bottom', 'top', 'left', 'right'] as const)
  cases[`drawer-placement-${placement}`] = () => <Case handle={placement === 'bottom' || placement === 'top'} placement={placement} />

for (const variant of ['opaque', 'blur', 'transparent'] as const)
  cases[`drawer-variant-${variant}`] = () => <Case handle variant={variant} />

cases['drawer-no-close'] = () => <Case close={false} placement="right" />
cases['drawer-scrollable'] = () => <Case handle scroll title="Terms & Conditions" />
