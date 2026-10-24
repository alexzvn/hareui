import type { ReactElement } from 'react'
import { Description, Label, TextArea, TextField } from '@heroui/react'

const placeholder = 'Share a quick project update...'

export const cases: Record<string, () => ReactElement> = {
  'textarea-primary': () => <TextArea placeholder={placeholder} />,
  'textarea-secondary': () => <TextArea placeholder={placeholder} variant="secondary" />,
  'textarea-full-width': () => <TextArea fullWidth placeholder={placeholder} />,
  'textarea-disabled': () => <TextArea disabled placeholder={placeholder} />,
  'textarea-invalid': () => <TextArea aria-invalid placeholder={placeholder} />,
  'textarea-secondary-invalid': () => <TextArea aria-invalid placeholder={placeholder} variant="secondary" />,
  'textarea-value': () => <TextArea defaultValue="Shipped the new onboarding flow." />,
  'textarea-rows': () => <TextArea className="w-96" placeholder={placeholder} rows={6} />,
  'textarea-in-textfield': () => (
    <TextField className="w-full max-w-64" name="message">
      <Label>Message</Label>
      <TextArea placeholder="Write your message here..." rows={4} />
      <Description>Maximum 500 characters</Description>
    </TextField>
  ),
}
