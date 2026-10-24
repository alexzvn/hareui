import type { ReactElement } from 'react'
import { Description, FieldError, Label, ListBox, Select } from '@heroui/react'

const states = ['Florida', 'Delaware', 'California', 'Texas']

function S({ clear = false, label = true, description, error, triggerClass, valueClass, ...props }: { clear?: boolean, label?: boolean, description?: string, error?: string, triggerClass?: string, valueClass?: string } & Record<string, any>) {
  return (
    <Select className="w-[256px]" placeholder="Select one" {...props}>
      {label && <Label>State</Label>}
      <Select.Trigger className={triggerClass}>
        <Select.Value className={valueClass} />
        {clear && <Select.ClearButton />}
        <Select.Indicator />
      </Select.Trigger>
      {description && <Description>{description}</Description>}
      {error && <FieldError>{error}</FieldError>}
      <Select.Popover>
        <ListBox>
          {states.map(s => (
            <ListBox.Item key={s} id={s.toLowerCase()} textValue={s}>
              {s}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'select-default': () => <S />,
  'select-selected': () => <S defaultValue="texas" />,
  'select-secondary': () => <S variant="secondary" />,
  'select-disabled': () => <S isDisabled defaultValue="florida" />,
  'select-invalid': () => <S isInvalid description="Pick a state" error="Please select a state" />,
  'select-description': () => <S description="Where you live" />,
  'select-required': () => <S isRequired />,
  'select-full-width': () => <div className="w-[400px]"><S className={undefined} fullWidth /></div>,
  'select-clear-button': () => <S clear defaultValue="delaware" />,
  'select-multiple': () => <S selectionMode="multiple" defaultValue={['florida', 'texas']} />,
  'select-open': () => <S defaultOpen defaultValue="delaware" />,
  'select-open-multiple': () => <S defaultOpen selectionMode="multiple" defaultValue={['florida', 'texas']} />,
  'select-user-overrides': () => <S triggerClass="bg-accent-soft rounded-xl" valueClass="font-semibold" />,
}
