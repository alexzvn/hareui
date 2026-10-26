import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import { ComboBox, Description, FieldError, Header, Input, Label, ListBox, Separator } from '@heroui/react'
import { gear } from '../icons'

const animals = ['Aardvark', 'Cat', 'Dog', 'Kangaroo', 'Panda', 'Snake']

function Items() {
  return (
    <ListBox>
      {animals.map(a => (
        <ListBox.Item key={a} id={a.toLowerCase()} textValue={a}>
          {a}
          <ListBox.ItemIndicator />
        </ListBox.Item>
      ))}
    </ListBox>
  )
}

function C({ description, error, label = true, indicator, groupClass, triggerClass, popoverClass, children, ...props }: { description?: string, error?: string, label?: boolean, indicator?: ReactElement, groupClass?: string, triggerClass?: string, popoverClass?: string, children?: ReactElement } & Record<string, any>) {
  return (
    <ComboBox className="w-[256px]" {...props}>
      {label && <Label>Favorite Animal</Label>}
      <ComboBox.InputGroup className={groupClass}>
        <Input placeholder="Search animals..." />
        <ComboBox.Trigger className={triggerClass}>{indicator}</ComboBox.Trigger>
      </ComboBox.InputGroup>
      {description && <Description>{description}</Description>}
      {error && <FieldError>{error}</FieldError>}
      <ComboBox.Popover className={popoverClass}>
        {children ?? <Items />}
      </ComboBox.Popover>
    </ComboBox>
  )
}

// RAC ComboBox has no `defaultOpen`: focus the input after mount (menuTrigger="focus" opens it)
function Open(props: Record<string, any>) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const t = setTimeout(() => ref.current?.querySelector('input')?.focus(), 50)
    return () => clearTimeout(t)
  }, [])
  return <div ref={ref}><C {...props} /></div>
}

const sections = [
  { label: 'North America', items: ['United States', 'Canada'] },
  { label: 'Europe', items: ['France', 'Germany'] },
]

export const cases: Record<string, () => ReactElement> = {
  'combo-box-default': () => <C />,
  'combo-box-selected': () => <C defaultSelectedKey="cat" />,
  'combo-box-secondary': () => <C variant="secondary" />,
  'combo-box-disabled': () => <C isDisabled defaultSelectedKey="cat" />,
  'combo-box-invalid': () => <C isInvalid description="Pick an animal" error="Please select an animal" />,
  'combo-box-description': () => <C description="Search and select your favorite animal" />,
  'combo-box-required': () => <C isRequired />,
  'combo-box-read-only': () => <C isReadOnly defaultSelectedKey="cat" />,
  'combo-box-full-width': () => <div className="w-[400px]"><C className={undefined} fullWidth /></div>,
  'combo-box-custom-indicator': () => <C indicator={gear()} />,
  'combo-box-multiple': () => (
    <ComboBox className="w-[256px]" selectionMode="multiple" defaultValue={['cat', 'dog']}>
      <Label>Favorite Animals</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Search animals..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Value placeholder="No animals selected" />
      <ComboBox.Popover>
        <ListBox selectionMode="multiple">
          {animals.map(a => (
            <ListBox.Item key={a} id={a.toLowerCase()} textValue={a}>
              {a}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  ),
  'combo-box-open': () => <Open defaultSelectedKey="cat" />,
  'combo-box-open-sections': () => (
    <Open label={false} aria-label="Country">
      <ListBox>
        {sections.flatMap((s, i) => [
          ...(i ? [<Separator key={`sep${i}`} />] : []),
          <ListBox.Section key={s.label}>
            <Header>{s.label}</Header>
            {s.items.map(c => (
              <ListBox.Item key={c} id={c} textValue={c}>
                {c}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox.Section>,
        ])}
      </ListBox>
    </Open>
  ),
  'combo-box-user-overrides': () => <C groupClass="rounded-xl bg-accent-soft" triggerClass="text-accent" />,
}
