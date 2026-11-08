---
title: Chat Loader
description: An indicator that an assistant reply is on its way, as typing dots, a pulse, a spinner or a message skeleton.
links:
  source: chat-loader/ChatLoader.vue
  styles: chat-loader/theme.ts
---

## Usage

Show `ChatLoader` while a reply hasn't started yet. It is a `status` region, so screen readers announce its label ("Loading response" by default) when it appears.

```ts
import { ChatLoader } from '@hareui/vue'
```

<ComponentPreview name="chat-loader/basic" />

## Anatomy

```vue
<ChatLoader variant="dots" />
```

Screen readers skip the animation and read only a visually hidden label. With reduced motion, the dots and the pulse hold still.

### Variants

- `dots`: three dots that light up in turn.
- `pulse`: one breathing dot.
- `spinner`: the accent [Spinner](/docs/components/spinner).
- `skeleton`: stands in for a whole assistant message, with an avatar circle and three bars. It fills the width of its container. Set `lines` to draw more or fewer bars.

The dots, the pulse and the spinner are one line of text tall, so they line up with the text beside them.

<ComponentPreview name="chat-loader/variants" />

### Sizes

`size` scales the dots, the pulse, the spinner and the skeleton.

<ComponentPreview name="chat-loader/sizes" />

### In a message

Put the loader in the `#content` slot of a [ChatMessage](/docs/components/chat-message) so it sits where the reply will appear. Pair it with a [TextShimmer](/docs/components/text-shimmer) that says what the assistant is doing. Both centre on the first line, level with the avatar.

Use `label` to change what screen readers announce.

<ComponentPreview name="chat-loader/message" />

## API

### ChatLoader props

<ApiTable component="ChatLoader" kind="props" />

## Theme

<ApiTheme component="ChatLoader" />
