import type { ReactElement } from 'react'
import { AlertDialog, Button } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

type Status = 'default' | 'accent' | 'success' | 'warning' | 'danger'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'cover'
type Variant = 'opaque' | 'blur' | 'transparent'
type Placement = 'auto' | 'top' | 'center' | 'bottom'

function Case({ status, size, variant, placement, close = true }: { status?: Status, size?: Size, variant?: Variant, placement?: Placement, close?: boolean }) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialog.Backdrop variant={variant}>
        <AlertDialog.Container placement={placement} size={size}>
          <AlertDialog.Dialog>
            {close && <AlertDialog.CloseTrigger />}
            <AlertDialog.Header>
              <AlertDialog.Icon status={status} />
              <AlertDialog.Heading>Delete project permanently?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>This will permanently delete the project and all of its data. This action cannot be undone.</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="tertiary">Cancel</Button>
              <Button variant="danger">Delete Project</Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  )
}

for (const status of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`alert-dialog-status-${status}`] = () => <Case status={status} />

for (const size of ['xs', 'sm', 'md', 'lg', 'cover'] as const)
  cases[`alert-dialog-size-${size}`] = () => <Case size={size} />

for (const variant of ['opaque', 'blur', 'transparent'] as const)
  cases[`alert-dialog-variant-${variant}`] = () => <Case variant={variant} />

for (const placement of ['auto', 'top', 'center', 'bottom'] as const)
  cases[`alert-dialog-placement-${placement}`] = () => <Case placement={placement} />

cases['alert-dialog-no-close'] = () => <Case close={false} status="accent" />
