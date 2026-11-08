---
title: Chat Source
description: Citation chips for the pages and documents an answer cites, and a collapsible list of them.
links:
  source: chat-source/ChatSource.vue
  styles: chat-source/theme.ts
---

## Usage

Pass a `source-url` or `source-document` part to `ChatSource`, or describe the source with `href` and `title`. A URL source links to the page in a new tab. Give it a `favicon` to show before the title.

```ts
import { ChatSource, ChatSources } from '@hareui/vue'
```

<ComponentPreview name="chat-source/basic" />

## Anatomy

```vue
<ChatSource :part="part">
  <template #icon />     <!-- optional: the favicon -->
  <template #default />  <!-- optional: the title -->
  <template #preview />  <!-- optional: the hover preview -->
</ChatSource>

<ChatSources :sources="sources">
  <template #label="{ count }" />           <!-- optional: the trigger text -->
  <template #source="{ source, index }" />  <!-- optional: one chip -->
</ChatSources>
```

These props override the part, or describe a source by hand:

- `href`
- `title`
- `description`
- `favicon`
- `type`

## Examples

### Single source

Without a `title`, the chip shows the page's domain. Without a `favicon`, it shows the domain's first letter.

<ComponentPreview name="chat-source/single" />

### Source list

`ChatSources` collects the sources of an answer behind a trigger that counts them. Click it to show the chips.

<ComponentPreview name="chat-source/sources" />

### Stacked favicons

`max-favicons` stacks up to that many favicons in the trigger, and `label` replaces its text.

<ComponentPreview name="chat-source/favicons" />

### Hover preview

With a `description`, hovering or focusing the chip shows a card with the domain, title and description. Set `preview` to turn it on or off yourself.

<ComponentPreview name="chat-source/preview" />

### Custom chip

The `#icon` slot replaces the favicon and `#default` the title, here for numbered citations that still preview their source on hover.

<ComponentPreview name="chat-source/custom" />

### Documents

A document source isn't a link: it shows a file icon and its title, or its file name.

<ComponentPreview name="chat-source/document" />

## API

### ChatSource props

<ApiTable component="ChatSource" kind="props" />

### ChatSource slots

<ApiTable component="ChatSource" kind="slots" />

### ChatSources props

<ApiTable component="ChatSources" kind="props" />

### ChatSources slots

<ApiTable component="ChatSources" kind="slots" />

### ChatSources emits

<ApiTable component="ChatSources" kind="emits" />

## Theme

<ApiTheme component="ChatSource" />
