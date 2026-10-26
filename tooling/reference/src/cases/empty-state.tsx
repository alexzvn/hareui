import type { ReactElement } from 'react'
import { Description, EmptyState, Label, Tag, TagGroup } from '@heroui/react'

const noItems: { id: string, name: string }[] = []

export const cases: Record<string, () => ReactElement> = {
  'empty-state-default': () => <EmptyState />,
  'empty-state-custom': () => <EmptyState className="p-1">No team members</EmptyState>,
  'empty-state-tag-group': () => (
    <div className="w-sm">
      <TagGroup selectionMode="single" onRemove={() => {}}>
        <Label>Team Members</Label>
        <TagGroup.List items={noItems} renderEmptyState={() => <EmptyState className="p-1">No team members</EmptyState>}>
          {item => <Tag id={item.id}>{item.name}</Tag>}
        </TagGroup.List>
        <Description>Select team members for your project</Description>
      </TagGroup>
    </div>
  ),
}
