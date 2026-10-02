import type { ReactElement } from 'react'
import { Description, ErrorMessage, Label, Tag, TagGroup } from '@heroui/react'
import { gearPath } from '../../../parity/icons'

// Inline SVG (no icon package dependency): mirrored verbatim in playground/src/parity/cases/tag-group.ts
const icon = <svg aria-hidden="true" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"><path d={gearPath} /></svg>

const categories = ['News', 'Travel', 'Gaming', 'Shopping']

const customTagClass = 'rounded-full border border-neutral-300/80 bg-white/80 px-2.5 py-1 text-sm font-medium text-neutral-700 data-[selected=true]:border-neutral-500 data-[selected=true]:bg-neutral-900 data-[selected=true]:text-neutral-50'

export const cases: Record<string, () => ReactElement> = {
  'tag-group-default': () => (
    <TagGroup aria-label="Tags" selectionMode="single">
      <TagGroup.List>
        {categories.map(c => <Tag key={c} id={c.toLowerCase()}>{icon}{c}</Tag>)}
      </TagGroup.List>
    </TagGroup>
  ),
  'tag-group-selected': () => (
    <TagGroup aria-label="Tags" defaultSelectedKeys={['travel']} selectionMode="single">
      <TagGroup.List>
        {categories.map(c => <Tag key={c} id={c.toLowerCase()}>{icon}{c}</Tag>)}
      </TagGroup.List>
    </TagGroup>
  ),
  'tag-group-sizes': () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <TagGroup key={size} selectionMode="single" size={size}>
          <Label>{size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}</Label>
          <TagGroup.List>
            <Tag>News</Tag>
            <Tag>Travel</Tag>
            <Tag>Gaming</Tag>
          </TagGroup.List>
        </TagGroup>
      ))}
    </div>
  ),
  'tag-group-variants': () => (
    <div className="flex flex-col gap-8">
      {(['default', 'surface'] as const).map(variant => (
        <TagGroup key={variant} selectionMode="single" variant={variant}>
          <Label>{variant === 'default' ? 'Default' : 'Surface'}</Label>
          <TagGroup.List>
            <Tag>News</Tag>
            <Tag>Travel</Tag>
            <Tag>Gaming</Tag>
          </TagGroup.List>
        </TagGroup>
      ))}
    </div>
  ),
  'tag-group-disabled-own': () => (
    <TagGroup selectionMode="single">
      <Label>Disabled Tags</Label>
      <TagGroup.List>
        <Tag isDisabled>News</Tag>
        <Tag>Travel</Tag>
        <Tag isDisabled>Gaming</Tag>
      </TagGroup.List>
      <Description>Some tags are disabled</Description>
    </TagGroup>
  ),
  'tag-group-disabled-keys': () => (
    <TagGroup disabledKeys={['travel']} selectionMode="single">
      <Label>Disabled Keys</Label>
      <TagGroup.List>
        <Tag id="news">News</Tag>
        <Tag id="travel">Travel</Tag>
        <Tag id="gaming">Gaming</Tag>
      </TagGroup.List>
      <Description>Tags disabled via disabledKeys prop</Description>
    </TagGroup>
  ),
  'tag-group-selection-modes': () => (
    <div className="flex flex-col gap-8">
      <TagGroup defaultSelectedKeys={['news']} selectionMode="single">
        <Label>Single Selection</Label>
        <TagGroup.List>
          <Tag id="news">News</Tag>
          <Tag id="travel">Travel</Tag>
          <Tag id="gaming">Gaming</Tag>
          <Tag id="shopping">Shopping</Tag>
        </TagGroup.List>
        <Description>Choose one category</Description>
      </TagGroup>
      <TagGroup defaultSelectedKeys={['news', 'travel']} selectionMode="multiple">
        <Label>Multiple Selection</Label>
        <TagGroup.List>
          <Tag id="news">News</Tag>
          <Tag id="travel">Travel</Tag>
          <Tag id="gaming">Gaming</Tag>
          <Tag id="shopping">Shopping</Tag>
        </TagGroup.List>
        <Description>Choose multiple categories</Description>
      </TagGroup>
    </div>
  ),
  'tag-group-controlled': () => (
    <TagGroup defaultSelectedKeys={['news', 'travel']} selectionMode="multiple">
      <Label>Categories (controlled)</Label>
      <TagGroup.List>
        <Tag id="news">News</Tag>
        <Tag id="travel">Travel</Tag>
        <Tag id="gaming">Gaming</Tag>
        <Tag id="shopping">Shopping</Tag>
      </TagGroup.List>
      <Description>Selected: News, Travel</Description>
    </TagGroup>
  ),
  'tag-group-removable': () => (
    <div className="w-sm">
      <TagGroup selectionMode="single" onRemove={() => {}}>
        <Label>Default Remove Button</Label>
        <TagGroup.List>
          <Tag id="news">News</Tag>
          <Tag id="travel">Travel</Tag>
          <Tag id="gaming">Gaming</Tag>
          <Tag id="shopping">Shopping</Tag>
        </TagGroup.List>
        <Description>Click the X to remove tags</Description>
      </TagGroup>
    </div>
  ),
  'tag-group-with-prefix': () => (
    <TagGroup aria-label="Tags with icons" selectionMode="single">
      <TagGroup.List>
        {categories.map(c => <Tag key={c} id={c.toLowerCase()}>{icon}{c}</Tag>)}
      </TagGroup.List>
    </TagGroup>
  ),
  'tag-group-error-message-invalid': () => (
    <TagGroup selectedKeys={new Set()} selectionMode="multiple">
      <Label>Amenities</Label>
      <TagGroup.List>
        <Tag id="laundry">Laundry</Tag>
        <Tag id="fitness">Fitness center</Tag>
        <Tag id="parking">Parking</Tag>
      </TagGroup.List>
      <Description>Select at least one category</Description>
      <ErrorMessage>Please select at least one category</ErrorMessage>
    </TagGroup>
  ),
  'tag-group-error-message-valid': () => (
    <TagGroup defaultSelectedKeys={['laundry']} selectionMode="multiple">
      <Label>Amenities</Label>
      <TagGroup.List>
        <Tag id="laundry">Laundry</Tag>
        <Tag id="fitness">Fitness center</Tag>
        <Tag id="parking">Parking</Tag>
      </TagGroup.List>
      <Description>Selected: Laundry</Description>
      <ErrorMessage>{''}</ErrorMessage>
    </TagGroup>
  ),
  'tag-group-custom-styles': () => (
    <TagGroup aria-label="Topics" selectionMode="single">
      <TagGroup.List className="gap-2">
        <Tag className={customTagClass} id="news">News</Tag>
        <Tag className={customTagClass} id="travel">Travel</Tag>
        <Tag className={customTagClass} id="gaming">Gaming</Tag>
      </TagGroup.List>
    </TagGroup>
  ),
}
