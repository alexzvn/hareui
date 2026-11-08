---
title: PromptInput
description: The message composer of a chat, with a textarea that grows with its text, attachments, a send button that follows the request status, and a queue of prompts.
links:
  source: prompt-input/PromptInput.vue
  styles: prompt-input/theme.ts
---

## Usage

Bind the text with `v-model` and listen to `submit`, which hands you the text and the attached files. Enter sends the prompt and Shift+Enter starts a new line. Enter that confirms an IME composition (Japanese, Chinese, Korean input) never sends. Clear `v-model` yourself once the message is on its way.

```ts
import { PromptInput } from '@hareui/vue'
```

<ComponentPreview name="prompt-input/basic" />

## Anatomy

```vue
<PromptInput
  v-model="text"
  v-model:files="files"
  v-model:queue="queue"
  @submit="(text, files) => {}"
>
  <template #queue="{ queue, send, edit, remove }" />     <!-- optional: replaces the queued prompts -->
  <template #header />                                     <!-- optional -->
  <template #files="{ files, remove }" />                  <!-- optional: replaces the attachments -->
  <template #body="{ submit, placeholder, disabled, inputAttrs }" /> <!-- optional: replaces the textarea -->
  <template #leading="{ open }" />                         <!-- optional: start of the toolbar -->
  <template #trailing />                                   <!-- optional: end of the toolbar -->
  <template #submit="{ status, disabled, submit, stop }" /> <!-- optional: replaces the send button -->
  <template #footer />                                     <!-- optional: text under the composer -->
</PromptInput>
```

Attributes such as `aria-label` or `maxlength` go to the textarea. Set `submit-on-enter` to `false` to make Enter add a line and Ctrl/Cmd+Enter send instead.

When you replace the textarea with the `body` slot, bind `inputAttrs` to your own input so those attributes still reach it:

```vue
<PromptInput v-model="text" aria-label="Message">
  <template #body="{ submit, placeholder, disabled, inputAttrs }">
    <MyInput v-model="text" v-bind="inputAttrs" :placeholder :disabled @enter="submit" />
  </template>
</PromptInput>
```

### Status

Pass the status of the chat request, as the AI SDK's `useChat().status`. The send button changes with it:

- `submitted`: a spinner. Pressing it emits `stop`.
- `streaming`: a stop icon. Pressing it emits `stop`.
- `error`: a retry icon. Pressing it sends the prompt again.

The demo shows the status as a chip in the `header` slot.

<ComponentPreview name="prompt-input/status" />

### Attachments

Bind `v-model:files` to attach files: the toolbar gets an attach button, and files can also be dropped onto the composer or pasted. Limit them with `accept` and `multiple`. Without `v-model:files` there is no attach button.

<ComponentPreview name="prompt-input/attachments" />

### Queue

Bind `v-model:queue` to let users write the next prompt while a response runs. Sending while the status is `submitted` or `streaming` adds the prompt to the queue above the composer instead of stopping the response. Each queued prompt can be sent now, moved back into the input to edit, or removed. Sending one now moves it to the front and emits `send`. Send the next queued prompt yourself once the status is `ready` again.

The row actions show on hover. Set `queue-actions` to `always` to keep them visible, for example on touch screens.

<ComponentPreview name="prompt-input/queue" />

### Toolbar

Use the `leading` and `trailing` slots for actions next to the send button, such as an attach button, a model picker or a search toggle. The `leading` slot gets `open`, which opens the file picker.

<ComponentPreview name="prompt-input/toolbar" />

### Layouts

`stacked` (the default) puts the input above the toolbar. `compact` starts as a single row and turns stacked once the text wraps or files are attached. `inline` keeps the toolbar on the same row and grows the input in place.

<ComponentPreview name="prompt-input/layouts" />

### Variants

Use `primary` on page backgrounds and `secondary` when the composer sits on a surface such as a card.

<ComponentPreview name="prompt-input/variants" />

### Sizes

<ComponentPreview name="prompt-input/sizes" />

### With Suggestions

A landing composer: a large composer with a shadow, above a grid of [PromptSuggestion](/docs/components/prompt-suggestion) prompts. Picking a suggestion fills the input so it can be edited before sending.

<ComponentPreview name="prompt-input/landing" />

### Follow-up

A `compact` composer for follow-ups on finished work. The `header` slot holds actions on the result. A row under the composer shows the branch, the environment and how much of the context is used.

<ComponentPreview name="prompt-input/follow-up" />

### Tokens

Use `PromptInputEditor` to put inline tokens in the prompt, such as `@` mentions or `/` commands. It takes every prop, model, event and slot of `PromptInput`, and replaces the textarea with a plain-text [Editor](/docs/components/editor). Each entry of `triggers` opens an [EditorMentionMenu](/docs/components/editor-mention-menu) when its character is typed. The picked entry becomes a token. While a menu is open, Enter picks the highlighted entry instead of sending.

- `v-model` is plain text, where a token reads as its character and label (`@mira`). Text you set turns back into tokens where a whole word matches an entry's label, so drafts and restored prompts keep their tokens.
- `submit` gets a third argument, `tokens`: the picked entries in document order, each as `{ char, id, label }`. Use the `id` to find the person or command.
- Give entries an `avatar` or an `icon` to show it in the menu.
- To search a server, set `ignoreFilter` on the trigger, load results in its `onSearch` and show `loading` meanwhile.
- The `item` slot replaces the content of each menu entry. Its `char` prop tells which trigger opened the menu.

`PromptInputEditor` comes from the editor entry, which needs the optional tiptap peer dependencies. See [Editor](/docs/components/editor).

```ts
import { PromptInputEditor } from '@hareui/vue/editor'
```

<ComponentPreview name="prompt-input/tokens" />

## API

### Props

<ApiTable component="PromptInput" kind="props" />

### Slots

<ApiTable component="PromptInput" kind="slots" />

### Emits

<ApiTable component="PromptInput" kind="emits" />

### PromptInputEditor Props

<ApiTable component="PromptInputEditor" kind="props" />

### PromptInputEditor Slots

<ApiTable component="PromptInputEditor" kind="slots" />

### PromptInputEditor Emits

<ApiTable component="PromptInputEditor" kind="emits" />

## Theme

<ApiTheme component="PromptInput" />
