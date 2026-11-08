---
title: PromptSuggestion
description: Starter prompts for an empty chat, as pills or cards, that hand the chosen prompt back to you.
links:
  source: prompt-suggestion/PromptSuggestion.vue
  styles: prompt-suggestion/theme.ts
---

## Usage

Pass the suggestions in the `items` prop, as strings or objects. Clicking one emits `select` with the prompt text and the item, so you can send it right away or put it in the input for editing. Here a suggestion fills the `PromptInput` below with its `prompt`, which can be longer than the `label`.

```ts
import { PromptSuggestion } from '@hareui/vue'
```

<ComponentPreview name="prompt-suggestion/basic" />

## Anatomy

```vue
<PromptSuggestion :items="items" @select="(prompt, item) => {}">
  <template #header />                                <!-- optional: replaces the title and description -->
  <template #title />                                 <!-- optional -->
  <template #description />                           <!-- optional -->
  <template #group-header="{ group }" />              <!-- optional -->
  <template #item="{ item, disabled, ui }" />         <!-- optional: replaces a suggestion's content -->
  <template #item-leading="{ item, disabled, ui }" /> <!-- optional -->
  <template #item-label="{ item, disabled, ui }" />   <!-- optional -->
  <template #item-description="{ item, disabled, ui }" />
  <template #item-trailing="{ item, disabled, ui }" /> <!-- pills only -->
  <template #item-footer="{ item, disabled, ui }" />   <!-- cards only -->
</PromptSuggestion>
```

Every suggestion is a native `button`. An item can have:

- a `label`, the text on the button
- a `prompt`, the text `select` hands back (defaults to the `label`)
- a `description` and an `icon`
- on cards, a `meta` text and `tags`
- `disabled` to turn it off

### Variant

Use `variant="card"` for richer starters with a description, clamped to three lines, and a footer. Pills (the default) suit short prompts.

<ComponentPreview name="prompt-suggestion/cards" />

### Groups

Use the `groups` prop to sort suggestions under labelled headings. Each group has a label, a description and its own `items`.

<ComponentPreview name="prompt-suggestion/groups" />

### Icons

Use the `icon` field of an item to show an icon before its label. Set `trailing-icon` to `false` to drop the chevron at the end of pills, or pass another icon.

<ComponentPreview name="prompt-suggestion/icons" />

### Disabled

Use the `disabled` prop to turn every suggestion off, for example while a response is streaming, or the `disabled` field of one item.

<ComponentPreview name="prompt-suggestion/disabled" />

### Follow-ups

Place short pills under an assistant message to offer the next question. Set `trailing-icon` to `false` so they read as plain replies.

<ComponentPreview name="prompt-suggestion/follow-ups" />

## API

### Props

<ApiTable component="PromptSuggestion" kind="props" />

### Slots

<ApiTable component="PromptSuggestion" kind="slots" />

### Emits

<ApiTable component="PromptSuggestion" kind="emits" />

## Theme

<ApiTheme component="PromptSuggestion" />
