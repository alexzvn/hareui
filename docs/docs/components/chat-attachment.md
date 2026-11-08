---
title: Chat Attachment
description: Previews of the files attached to a message or a composer, and a helper that picks, drops and pastes them.
links:
  source: chat-attachment/ChatAttachment.vue
  styles: chat-attachment/theme.ts
---

## Usage

`ChatAttachment` previews one file: a `file` part of a message, or a picked `File`.

- Images and videos with a preview show as thumbnails (the `media` variant).
- Other files show as a card with an icon, the name and the size (the `file` variant).

`ChatAttachmentGroup` lays several attachments out in a wrapping row. Give it a message's `parts`, the composer's `files`, or `items` with the props of each attachment.

```ts
import {
  ChatAttachment,
  ChatAttachmentGroup,
  ChatAttachmentInput,
  useChatAttachmentInput,
} from '@hareui/vue'
```

<ComponentPreview name="chat-attachment/basic" />

## Anatomy

```vue
<ChatAttachment :part="part">
  <template #preview="{ url, type, variant }" /> <!-- thumbnail or icon -->
  <template #info="{ name, description }" />     <!-- name and size -->
</ChatAttachment>
```

Picked files preview through an object URL, released when the file changes or the attachment unmounts. A thumbnail shows its name on hover.

### Grouped

The icon follows the file's format: PDF, document, spreadsheet, archive, code, text, image, video or audio. It comes from the media type, or from the extension when the type is missing. Set `icon` to use your own. Pass `bytes` so each card shows a size, or the card falls back to the extension.

<ComponentPreview name="chat-attachment/grouped" />

### Status and removal

Set `status="uploading"` while a file uploads. A file card shows a spinner in place of its icon and shimmers its name. A thumbnail dims behind a spinner. Set `status="error"` to mark a failed upload, and say what to do in `description`.

`removable` adds a remove button that emits `remove`. In a group, each item can set its own `status` and `removable`, and `remove` passes its index and the item.

<ComponentPreview name="chat-attachment/status" />

### In a message

[ChatMessage](/docs/components/chat-message) renders each file part of a message as a `ChatAttachment` in the bubble. Use its `#file` slot to render them another way.

<ComponentPreview name="chat-attachment/message" />

### Composer

[PromptInput](/docs/components/prompt-input) shows its `v-model:files` as attachments. To show upload progress, render them yourself in its `#files` slot with `items` that carry a `status`.

<ComponentPreview name="chat-attachment/composer" />

### Custom composer

`ChatAttachmentInput` wraps a composer of your own and emits the files the user adds as `select`. It accepts files dropped on it, pasted into it, or chosen in the picker. Call the slot's `open` to show the picker. Only files that match `accept` get through.

The slot's `isDragging` is `true` while files are over the composer. Use it to show where to drop.

To build this into your own component, use `useChatAttachmentInput`. It returns:

- `open`: shows the file picker.
- `isDragging`: whether files are over the drop zone.
- `dropzone`: drop listeners. Bind them with `v-bind="dropzone"`.
- `onPaste`: a paste listener.

<ComponentPreview name="chat-attachment/custom-composer" />

## Accessibility

- Screen readers announce when an attachment starts uploading or fails.
- The remove button is labelled with the file name, such as "Remove roadmap.pdf".
- A thumbnail's image uses the file name as its alt text.

## API

### ChatAttachment props

<ApiTable component="ChatAttachment" kind="props" />

### ChatAttachment slots

<ApiTable component="ChatAttachment" kind="slots" />

### ChatAttachment emits

<ApiTable component="ChatAttachment" kind="emits" />

### ChatAttachmentGroup props

<ApiTable component="ChatAttachmentGroup" kind="props" />

### ChatAttachmentGroup slots

<ApiTable component="ChatAttachmentGroup" kind="slots" />

### ChatAttachmentGroup emits

<ApiTable component="ChatAttachmentGroup" kind="emits" />

### ChatAttachmentInput props

<ApiTable component="ChatAttachmentInput" kind="props" />

### ChatAttachmentInput slots

<ApiTable component="ChatAttachmentInput" kind="slots" />

### ChatAttachmentInput emits

<ApiTable component="ChatAttachmentInput" kind="emits" />

## Theme

<ApiTheme component="ChatAttachment" />
