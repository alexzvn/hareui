---
title: Chat Tool
description: A collapsible card for one tool call of an assistant message, with its input, output, error and approval.
links:
  source: chat-tool/ChatTool.vue
  styles: chat-tool/theme.ts
---

## Usage

Pass a tool part of a message to the `part` prop, and render it in the `#tool` slot of a [ChatMessage](/docs/components/chat-message). The card shows the tool's name and its state. Expanding it shows the input and output as JSON.

Short input stays on one line. Output is indented.

The name comes from the part's `type`, which has the form `tool-<name>`, or from its `toolName`.

```ts
import { ChatTool, ChatToolGroup } from '@hareui/vue'
```

<ComponentPreview name="chat-tool/basic" />

## Anatomy

```vue
<ChatTool :part="part">
  <template #icon="{ name, state }" />              <!-- optional: the status icon -->
  <template #label="{ name, state }" />             <!-- optional: the trigger text -->
  <template #input="{ name, state, input }" />      <!-- optional -->
  <template #output="{ name, state, output }" />    <!-- optional -->
  <template #error="{ name, state, errorText }" />  <!-- optional -->
  <template #approval="{ approve, deny }" />        <!-- optional: the approval actions -->
</ChatTool>
```

The trigger is a button with `aria-expanded`. A call with no input, output or error yet renders the trigger alone and doesn't expand.

These props override the part, or replace it for calls that don't come from a message:

- `toolName`
- `state`
- `input`
- `output`
- `errorText`

Set `label` to replace the text before the name, and `suffix` to add muted text after it. On a narrow card the name keeps its room and the suffix truncates first.

### Streaming

Update the part as the call progresses. The card follows it.

While the call is `input-streaming`, pass the partial JSON text as `input`. A string shows as it is, so the arguments appear as the model writes them. Once they are complete, pass the parsed object.

<ComponentPreview name="chat-tool/streaming" />

### Approval

In the `approval-requested` state, the card opens and shows Approve and Deny buttons. They emit `approve` and `deny` with the part's `toolCallId`.

To answer, move the part to `approval-responded` and then `output-available`. To refuse, move it to `output-denied`.

<ComponentPreview name="chat-tool/approval" />

### Error

In the `output-error` state, the card shows the part's `errorText` under the input.

<ComponentPreview name="chat-tool/error" />

### Custom output

Use the `#output` slot to render a result as something other than JSON.

<ComponentPreview name="chat-tool/output-slot" />

### Group

`ChatToolGroup` folds several calls behind one trigger that counts them. Set `label` to show your own text instead of the count. The group renders a `ChatTool` per part and forwards `approve` and `deny` with the part. To render your own cards, pass them in the default slot instead.

The demo below opens the group when a call failed, so the error is in view.

<ComponentPreview name="chat-tool/group" />

### States

The `state` sets the icon and the text before the name. The label shimmers while the call runs: while input streams in, once it is complete, and after an approval answer until the result arrives.

The cards below pass `:default-open="false"`, so the `approval-requested` one stays collapsed.

<ComponentPreview name="chat-tool/states" />

## API

### ChatTool props

<ApiTable component="ChatTool" kind="props" />

### ChatTool slots

<ApiTable component="ChatTool" kind="slots" />

### ChatTool emits

<ApiTable component="ChatTool" kind="emits" />

### ChatToolGroup props

<ApiTable component="ChatToolGroup" kind="props" />

### ChatToolGroup slots

<ApiTable component="ChatToolGroup" kind="slots" />

### ChatToolGroup emits

<ApiTable component="ChatToolGroup" kind="emits" />

## Theme

<ApiTheme component="ChatTool" />
