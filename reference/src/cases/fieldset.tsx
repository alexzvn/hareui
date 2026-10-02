import type { ReactElement } from 'react'
import { Button, Description, Fieldset, Input, Link } from '@heroui/react'

const field = <Input aria-label="Name" placeholder="John Doe" />
const actions = <Fieldset.Actions><Button>Save</Button><Button variant="secondary">Cancel</Button></Fieldset.Actions>

export const cases: Record<string, () => ReactElement> = {
  'fieldset-full': () => (
    <Fieldset className="w-80">
      <Fieldset.Legend>Profile Settings</Fieldset.Legend>
      <Description>Update your profile information.</Description>
      <Fieldset.Group>{field}</Fieldset.Group>
      {actions}
    </Fieldset>
  ),
  'fieldset-legend-only': () => (
    <Fieldset className="w-80">
      <Fieldset.Legend>Profile Settings</Fieldset.Legend>
      <Fieldset.Group>{field}</Fieldset.Group>
    </Fieldset>
  ),
  'fieldset-disabled': () => (
    <Fieldset className="w-80" disabled>
      <Fieldset.Legend>Disabled</Fieldset.Legend>
      <Fieldset.Group>{field}<Link href="#">Help</Link></Fieldset.Group>
      {actions}
    </Fieldset>
  ),
  'fieldset-ui-override': () => (
    <Fieldset className="w-80 gap-3 rounded-xl border p-4">
      <Fieldset.Legend className="text-lg font-semibold">Custom</Fieldset.Legend>
      <Fieldset.Group className="space-y-2">{field}{field}</Fieldset.Group>
      <Fieldset.Actions className="justify-end"><Button>Save</Button><Button variant="secondary">Cancel</Button></Fieldset.Actions>
    </Fieldset>
  ),
}
