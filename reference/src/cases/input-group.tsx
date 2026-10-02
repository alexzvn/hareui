import type { ReactElement, ReactNode } from 'react'
import { Button, InputGroup, TextField } from '@heroui/react'
import { gear } from '../icons'

type FieldProps = Omit<Parameters<typeof TextField>[0], 'children'>

function field(fieldProps: FieldProps = {}, parts: { prefix?: ReactNode, suffix?: ReactNode } = {}, suffixClass?: string) {
  return (
    <TextField name="email" {...fieldProps}>
      <InputGroup>
        {parts.prefix !== undefined && <InputGroup.Prefix>{parts.prefix}</InputGroup.Prefix>}
        <InputGroup.Input placeholder="name@email.com" />
        {parts.suffix !== undefined && <InputGroup.Suffix className={suffixClass}>{parts.suffix}</InputGroup.Suffix>}
      </InputGroup>
    </TextField>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'input-group-bare': () => field(),
  'input-group-with-prefix': () => field({}, { prefix: gear() }),
  'input-group-with-suffix': () => field({}, { suffix: gear() }),
  'input-group-with-prefix-and-suffix': () => field({ defaultValue: '10' }, { prefix: '$', suffix: 'USD' }),
  'input-group-secondary': () => field({ variant: 'secondary' }, { prefix: gear() }),
  'input-group-disabled': () => field({ isDisabled: true }, { prefix: gear() }),
  'input-group-invalid': () => field({ isInvalid: true }, { prefix: gear() }),
  'input-group-required': () => field({ isRequired: true }),
  'input-group-full-width': () => <div className="w-80">{field({ fullWidth: true }, { prefix: gear() })}</div>,
  'input-group-readonly': () => field({ isReadOnly: true, defaultValue: 'jane@example.com' }),
  'input-group-button-suffix': () => field({}, {
    suffix: <Button isIconOnly size="sm" variant="ghost" aria-label="Copy">{gear()}</Button>,
  }, 'pe-0'),
  'input-group-textarea': () => (
    <TextField name="email" fullWidth>
      <InputGroup fullWidth>
        <InputGroup.Prefix>{gear()}</InputGroup.Prefix>
        <InputGroup.TextArea className="resize-none" placeholder="name@email.com" rows={3} />
      </InputGroup>
    </TextField>
  ),
}
