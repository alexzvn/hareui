---
title: ChatConversation
description: A scrolling message log that follows a streaming reply to the bottom until the user scrolls up.
links:
  source: chat-conversation/ChatConversation.vue
  styles: chat-conversation/theme.ts
---

## Usage

Pass the chat's `messages` and `status`. Each message renders as a [ChatMessage](./chat-message). The log sticks to the bottom while content grows, stops following as soon as the user scrolls up, and shows a button to jump back down.

```ts
import { ChatConversation } from '@hareui/vue'
```

Press a suggestion under the thread to stream a new reply. The log follows it to the bottom.

<ComponentPreview name="chat-conversation/basic" />

## Anatomy

```vue
<ChatConversation :messages="messages" :status="status">
  <template #content="{ message, streaming }" />           <!-- optional: any ChatMessage slot, per message -->
  <template #part="{ part, index, message, streaming }" /> <!-- optional -->
  <template #indicator />                                  <!-- optional: the typing indicator -->
  <template #footer="{ status }" />                        <!-- optional: sticks to the bottom -->
  <template #scroll-button="{ visible, scrollToBottom }" /> <!-- optional -->
</ChatConversation>
```

The root is the scroll viewport, with `role="log"`. Give its parent a height, or make it a flex column, so the log can scroll.

Every ChatMessage slot you fill is forwarded to each message. The slot also gets a `streaming` prop, `true` for the message being streamed. Use the `#text` slot to render text parts with [Markdown](./markdown).

### Status

`submitted` shows a typing indicator after the last message and brings it into view, even when the user had scrolled up. `streaming` marks the last message as streaming. Both set `aria-busy` on the log.

Chat SDKs often add the reply as an empty assistant message before its first token. While `streaming`, that empty message shows the typing indicator itself, so the log never shows two assistant rows. The indicator takes the assistant's look but none of its `actions`.

### Footer

Put a [PromptInput](./prompt-input) in the `#footer` slot. It sticks to the bottom of the log, and the last message and the scroll button stay clear of it.

This trip planner wires the prompt's send and stop buttons to `status`. Its replies think with a [ChainOfThought](./chain-of-thought), look places up with a [ChatTool](./chat-tool), and answer in Markdown.

<ComponentPreview name="chat-conversation/full-chat" />

### Empty state

Fill the default slot while `messages` is empty, for example with [PromptSuggestion](./prompt-suggestion) starters. The default slot replaces the message list, so render it only until the first message arrives.

<ComponentPreview name="chat-conversation/empty" />

### Roles

Use the `user` and `assistant` props to pass ChatMessage props to every message of that role. They accept `avatar`, `icon`, `variant`, `color`, `compact`, `side`, `actions` and `ui`.

Here user messages are soft accent bubbles, and assistant messages get an avatar and actions.

<ComponentPreview name="chat-conversation/roles" />

### Scrolling

- `should-auto-scroll` (default `true`) follows growing content while the log is at the bottom.
- `should-scroll-to-bottom` (default `true`) starts the log at the bottom.
- `scroll-button` shows the scroll-to-bottom button. Set it to `false` to hide it, or pass Button props. Its `icon` field changes the icon.

This log starts at the top, so the arrow button shows right away.

<ComponentPreview name="chat-conversation/scroll-button" />

Use the `#scroll-button` slot for your own button. A template ref gives you `scrollToBottom()`, `scrollToMessage(id)` and `isAtBottom`. `scrollToMessage` brings a message to the top of the log and stops following new content.

This button counts the updates that arrived while you were away. Pressing it jumps to the first unread message.

<ComponentPreview name="chat-conversation/scroll-button-unread" />

## API

### Props

<ApiTable component="ChatConversation" kind="props" />

### Slots

<ApiTable component="ChatConversation" kind="slots" />

## Theme

<ApiTheme component="ChatConversation" />
