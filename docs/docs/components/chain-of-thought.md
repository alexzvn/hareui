---
title: Chain of Thought
description: A collapsible timeline of the assistant's reasoning, with a streaming state and the time it took.
links:
  source: chain-of-thought/ChainOfThought.vue
  styles: chain-of-thought/theme.ts
---

## Usage

Pass the reasoning as `steps`. Each step has a `label` and a `content`. The trigger reads "Thought for 6 seconds" from `duration`. Render it in a `ChatMessage` `#reasoning` slot so it sits above the answer.

```ts
import { ChainOfThought } from '@hareui/vue'
```

<ComponentPreview name="chain-of-thought/basic" />

## Anatomy

```vue
<ChainOfThought :steps="steps">
  <template #label="{ streaming, duration }" />  <!-- optional: the trigger text -->
  <template #step-label="{ step, index }" />     <!-- optional -->
  <template #step-content="{ step, index }" />   <!-- optional -->
</ChainOfThought>
```

The trigger is a button with `aria-expanded`. The steps sit on a rail below it.

### Reasoning text

A reasoning part is one block of text: pass its `text` and it renders as a single step, collapsed above the answer.

<ComponentPreview name="chain-of-thought/text" />

### Streaming

Set `streaming` while the reasoning arrives. The trigger shimmers "Thinking…" and the timeline opens.

When `streaming` turns off, the trigger shows the measured time. The timeline collapses after `auto.closeDelay`, 500 ms by default. If the user toggles it during the stream, it stays as they left it.

Set `auto.open` to `false` to stay collapsed, or `auto.closeDelay` to `0` to stay open.

<ComponentPreview name="chain-of-thought/streaming" />

### Custom steps

Use the `#step-content` slot to render more than text in a step.

<ComponentPreview name="chain-of-thought/step-slot" />

### Agent trace

Give a step an `icon` to replace its dot, and use `#step-content` for file lists or a generated result.

<ComponentPreview name="chain-of-thought/agent-trace" />

### Agent trace streaming

Set a step's `status` while an agent works: `active` shimmers its label, `pending` mutes it, `done` (the default) shows it plainly. Here `auto.closeDelay` is `0`, so the trace stays open when the run ends.

<ComponentPreview name="chain-of-thought/agent-trace-streaming" />

## API

### Props

<ApiTable component="ChainOfThought" kind="props" />

### Slots

<ApiTable component="ChainOfThought" kind="slots" />

### Emits

<ApiTable component="ChainOfThought" kind="emits" />

## Theme

<ApiTheme component="ChainOfThought" />
