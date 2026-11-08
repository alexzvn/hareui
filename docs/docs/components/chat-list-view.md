---
title: ChatListView
description: Rows of chat threads with a title, a preview and a timestamp, for chat sidebars and conversation pickers.
links:
  source: chat-list-view/ChatListView.vue
  styles: chat-list-view/theme.ts
---

## Usage

Pass the threads in the `items` prop. Each item can have:

- a `label`, the thread's title, and a `description`, its preview (usually the last message)
- a `meta` text at the end of the row, such as when the thread was last updated
- an `icon`, which replaces the list's icon for that row
- `disabled`, to make the row unavailable
- `to` or `href`, to open the thread as a link

Every row shows a chat icon. Set `icon` on the list to change it for all rows, or set it to `false` to show only the items' own icons.

Rows have no background of their own, so the list sits on whatever is behind it.

```ts
import { ChatListView } from '@hareui/vue'
```

<ComponentPreview name="chat-list-view/basic" />

## Anatomy

```vue
<ChatListView v-model="openThread" :items="threads" selectable aria-label="Recent chats">
  <template #item="{ item, index, selected, disabled, ui }" />  <!-- optional: replaces the row content -->
  <template #item-leading="{ item }" />                         <!-- optional -->
  <template #item-label="{ item }" />                           <!-- optional -->
  <template #item-description="{ item }" />                     <!-- optional -->
  <template #item-meta="{ item }" />                            <!-- optional -->
  <template #item-action="{ item }" />                          <!-- optional: controls at the end of the row -->
  <template #empty />                                           <!-- optional -->
</ChatListView>
```

ChatListView is a [ListView](./list-view) laid out for threads, so it has the same keyboard navigation. Give it an `aria-label`.

### Density

Use `density="compact"` to keep only the icon and the title, for narrow sidebars.

<ComponentPreview name="chat-list-view/compact" />

### Variant

Rows sit on the page without a card by default (`secondary`). Use `variant="primary"` to set them on a card.

<ComponentPreview name="chat-list-view/primary" />

### Selection

With `selectable`, `v-model` holds the open thread. A press selects that row alone and tints it. The arrow keys move the selection with the focus, and pressing the open thread again keeps it open.

<ComponentPreview name="chat-list-view/selection" />

Add `multiple` for bulk actions. The rows then show checkboxes, and Ctrl or Cmd+click adds or removes a row. Set `selection-behavior="toggle"` to make every press add or remove a row.

## Examples

### Row actions

Use the `#item-action` slot for a menu to rename, pin or delete a thread. Listen to `action` to open a thread when its row is pressed.

<ComponentPreview name="chat-list-view/actions" />

### Custom content

Use the `#item-leading` and `#item-meta` slots to show an avatar and an unread count. Extra item fields are available in the slot props.

<ComponentPreview name="chat-list-view/custom-slots" />

### Sidebar

A chat sidebar with a new-chat button, a search field and threads grouped by day. Each day is a compact ChatListView. Both bind the same `v-model`, and opening a thread in one group clears the other's selection.

<ComponentPreview name="chat-list-view/sidebar" />

## Accessibility

The list renders `role="grid"`, and each thread is a `row` named by its `label`. Name the list with `aria-label` or `aria-labelledby`.

The list is one Tab stop. ArrowUp and ArrowDown move between threads, Home and End jump to the first and last. Enter runs the row's action or opens its link. The full key list is on the [ListView](./list-view#accessibility) page.

With single selection, Space and Escape don't close the open thread.

## API

### Props

<ApiTable component="ChatListView" kind="props" />

### Slots

<ApiTable component="ChatListView" kind="slots" />

### Emits

<ApiTable component="ChatListView" kind="emits" />

## Theme

<ApiTheme component="ChatListView" />
