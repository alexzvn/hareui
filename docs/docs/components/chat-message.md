---
title: Chat Message
description: One message of a chat, with an optional avatar, its parts in order and action buttons.
links:
  source: chat-message/ChatMessage.vue
  styles: chat-message/theme.ts
---

## Usage

Pass a message to the `message` prop. Its shape matches the AI SDK's `UIMessage`, with an `id`, a `role` and `parts`. Messages from `useChat` can be passed in as they are.

The `role` picks the layout. User messages sit at the end in a bubble. Assistant and system messages sit at the start as plain text. Without `role` or `message`, the message is an assistant message.

```ts
import { ChatMessage } from '@hareui/vue'
```

<ComponentPreview name="chat-message/basic" />

## Anatomy

```vue
<ChatMessage :message="message">
  <template #leading="{ message, avatar, icon }" />    <!-- optional: the avatar -->
  <template #header="{ message }" />                   <!-- optional: above the parts -->
  <template #content="{ message }" />                  <!-- optional: replaces every part -->
  <template #part="{ part, index, message }" />        <!-- optional: any part -->
  <template #text="{ part, index, message }" />        <!-- optional -->
  <template #reasoning="{ part, index, message }" />   <!-- optional -->
  <template #tool="{ part, index, message }" />        <!-- optional: tool-* and dynamic-tool -->
  <template #file="{ part, index, message }" />        <!-- optional -->
  <template #source="{ part, index, message }" />      <!-- optional: source-url and source-document -->
  <template #actions="{ message, actions }" />         <!-- optional: the action buttons -->
</ChatMessage>
```

The root is an `article`. It carries `data-role`, `data-side` and `data-variant` for styling.

The `role` and `parts` props override the fields of `message`. Use them alone for content that doesn't come from a message list. [ChatConversation](/docs/components/chat-conversation) renders a `ChatMessage` per message.

### Markdown

Text parts show as they are, keeping their line breaks. Assistant replies are usually Markdown, so render them with [Markdown](/docs/components/markdown) in the `#text` slot.

<ComponentPreview name="chat-message/markdown" />

### Attachments

File parts render as a [ChatAttachment](/docs/components/chat-attachment). Images show as a thumbnail, other files as a card with their name.

<ComponentPreview name="chat-message/attachments" />

### Tool calls and sources

Every part type has a default rendering, so a message from `useChat` needs no slots:

- `reasoning`: a [ChainOfThought](/docs/components/chain-of-thought). Its label reads "Thinking…" while the part is streaming.
- `tool-*` and `dynamic-tool`: a [ChatTool](/docs/components/chat-tool).
- `file`: a [ChatAttachment](/docs/components/chat-attachment).
- `source-url` and `source-document`: a [ChatSource](/docs/components/chat-source).

The `#reasoning`, `#tool`, `#file` and `#source` slots replace these defaults.

<ComponentPreview name="chat-message/tools-and-sources" />

The `#part` slot renders any part. For a part it renders nothing, the part falls back to the slot of its type, so it can take over some parts and leave the rest:

```vue
<ChatMessage :message="message">
  <template #part="{ part }">
    <WeatherCard v-if="part.type === 'tool-getWeather'" :part="part" />
  </template>
</ChatMessage>
```

### Pending reply

The `#content` slot replaces the parts altogether. Use it to show a [ChatLoader](/docs/components/chat-loader) while a reply hasn't started. A [TextShimmer](/docs/components/text-shimmer) above it tells the user what the assistant is doing.

<ComponentPreview name="chat-message/pending" />

### Variants

Every variant but `tertiary` is a bubble that fits its text. `tertiary` has no bubble and spans the row. User messages default to `secondary`, the others to `tertiary`.

<ComponentPreview name="chat-message/variants" />

### Color

`color` tints the content: the bubble of `primary` and `soft`, and the text of every variant. With the `default` colour, `primary` is an inverted solid bubble.

<ComponentPreview name="chat-message/colors" />

### Avatar and side

`avatar` takes the props of an [Avatar](/docs/components/avatar). `icon` shows an icon in that avatar, or in an avatar of its own. The `#leading` slot replaces the avatar.

`side` moves a message to the other side. With `end`, the avatar comes after the content and the content aligns to the end. The `#header` slot adds content above the parts, such as the author's name and the time.

<ComponentPreview name="chat-message/group-chat" />

### Actions

`actions` adds a row of [ChatMessageActions](/docs/components/chat-message-actions) buttons under the content. The row sits at half opacity until the message is hovered or a button has focus. `copy` shows a check once the text is on the clipboard. The message forwards the `action` and `copy` events. Use the `#actions` slot for your own buttons.

Bind `v-model:feedback` to keep the rating from the `like` and `dislike` buttons. Pressing the same button again clears it to `null`.

<ComponentPreview name="chat-message/feedback" />

### Compact

`compact` makes the message denser for drawers and narrow panels. The avatar is smaller, the gaps are tighter, and no space is kept free after the content.

<ComponentPreview name="chat-message/compact" />

## API

### ChatMessage props

<ApiTable component="ChatMessage" kind="props" />

### ChatMessage slots

<ApiTable component="ChatMessage" kind="slots" />

### ChatMessage emits

<ApiTable component="ChatMessage" kind="emits" />

## Theme

<ApiTheme component="ChatMessage" />
