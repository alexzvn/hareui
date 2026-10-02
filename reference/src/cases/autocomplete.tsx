import type { ReactElement } from 'react'
import { Autocomplete, Description, EmptyState, FieldError, Header, Label, ListBox, SearchField, Separator, useFilter } from '@heroui/react'
import { gear } from '../icons'

const states = ['Florida', 'Delaware', 'California', 'Texas']

function Items() {
  return (
    <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
      {states.map(s => (
        <ListBox.Item key={s} id={s.toLowerCase()} textValue={s}>
          {s}
          <ListBox.ItemIndicator />
        </ListBox.Item>
      ))}
    </ListBox>
  )
}

function A({ clear = true, search = true, description, error, indicator, triggerClass, valueClass, children, ...props }: { clear?: boolean, search?: boolean, description?: string, error?: string, indicator?: ReactElement, triggerClass?: string, valueClass?: string, children?: ReactElement } & Record<string, any>) {
  const { contains } = useFilter({ sensitivity: 'base' })
  return (
    <Autocomplete className="w-[256px]" placeholder="Select one" selectionMode="single" {...props}>
      <Label>State</Label>
      <Autocomplete.Trigger className={triggerClass}>
        <Autocomplete.Value className={valueClass} />
        {clear && <Autocomplete.ClearButton />}
        {indicator ? <Autocomplete.Indicator>{indicator}</Autocomplete.Indicator> : <Autocomplete.Indicator />}
      </Autocomplete.Trigger>
      {description && <Description>{description}</Description>}
      {error && <FieldError>{error}</FieldError>}
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          {search
            ? (
                <SearchField autoFocus aria-label="Search states" name="search" variant="secondary">
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search states..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
              )
            : <></>}
          {children ?? <Items />}
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'autocomplete-default': () => <A />,
  'autocomplete-selected': () => <A defaultValue="texas" />,
  'autocomplete-secondary': () => <A variant="secondary" />,
  'autocomplete-disabled': () => <A isDisabled defaultValue="florida" />,
  'autocomplete-invalid': () => <A isInvalid description="Pick a state" error="Please select a state" />,
  'autocomplete-description': () => <A description="Select your state of residence" />,
  'autocomplete-required': () => <A isRequired />,
  'autocomplete-full-width': () => <div className="w-[400px]"><A className={undefined} fullWidth /></div>,
  'autocomplete-custom-indicator': () => <A indicator={gear()} />,
  'autocomplete-multiple': () => <A selectionMode="multiple" defaultValue={['florida', 'texas']} />,
  'autocomplete-open': () => <A defaultOpen defaultValue="delaware" />,
  'autocomplete-open-no-search': () => <A defaultOpen search={false} selectionMode="multiple" defaultValue={['florida', 'texas']} />,
  'autocomplete-open-sections': () => (
    <A defaultOpen>
      <ListBox>
        <ListBox.Section>
          <Header>South</Header>
          <ListBox.Item id="florida" textValue="Florida">Florida<ListBox.ItemIndicator /></ListBox.Item>
          <ListBox.Item id="texas" textValue="Texas">Texas<ListBox.ItemIndicator /></ListBox.Item>
        </ListBox.Section>
        <Separator />
        <ListBox.Section>
          <Header>West</Header>
          <ListBox.Item id="california" textValue="California">California<ListBox.ItemIndicator /></ListBox.Item>
        </ListBox.Section>
      </ListBox>
    </A>
  ),
  'autocomplete-open-empty': () => (
    <A defaultOpen allowsEmptyCollection>
      <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>} />
    </A>
  ),
  'autocomplete-user-overrides': () => <A triggerClass="bg-accent-soft rounded-xl" valueClass="font-semibold" />,
}
