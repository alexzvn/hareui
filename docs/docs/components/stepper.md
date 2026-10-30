---
title: Stepper
description: A row or column of numbered steps that shows progress through a sequence and lets the user move between steps.
links:
  source: stepper/Stepper.vue
  styles: stepper/theme.ts
---

## Usage

Pass the steps in the `items` prop. Each item can have a `title`, a `description`, an `icon` component and `content` shown while the step is active.

```ts
import { Stepper } from '@hareui/vue'
```

<ComponentPreview name="stepper/basic" />

## Anatomy

```vue
<Stepper :items="items">
  <template #indicator="{ item, index, state, ui }" />   <!-- optional: the circle content -->
  <template #wrapper="{ item, index, state }" />         <!-- optional: replaces title and description -->
  <template #title="{ item, index, state }" />           <!-- optional -->
  <template #description="{ item, index, state }" />     <!-- optional -->
  <template #content="{ item, index, state }" />         <!-- optional: the active step's panel -->
</Stepper>
```

The steps render as an `ol` with one `li` per step. Each step is a button named by its title and described by its description; the arrow keys move focus between steps, and Enter or Space selects the focused one. `state` is `completed` for the steps before the active one, `active` for the active one and `inactive` for the ones after it.

### Description

Use the `description` field of an item to add a line of secondary text under its title.

<ComponentPreview name="stepper/description" />

### Icons

Use the `icon` field of an item to show an icon in the circle instead of its number. The icon stays when the step is completed.

<ComponentPreview name="stepper/icons" />

### Size

Use the `size` prop to change the circle (22, 28 or 36px) and the text size. Defaults to `md`.

<ComponentPreview name="stepper/size" />

### Orientation

Use `orientation="vertical"` to stack the steps, with the title and description beside each circle. Defaults to `horizontal`.

<ComponentPreview name="stepper/orientation" />

The size applies to vertical steppers too, and also sets the space between steps (12, 16 or 24px).

<ComponentPreview name="stepper/vertical-size" />

### Color

Use the `color` prop to change the active circle, the completed circles and the filled lines between them. Defaults to `accent`.

<ComponentPreview name="stepper/color" />

<ComponentPreview name="stepper/color-vertical" />

### CSS Variables

The colors and sizes are CSS variables on the root, so a class can override them for every step: `--stepper-active-color`, `--stepper-complete-color`, `--stepper-complete-fg`, `--stepper-inactive-border`, `--stepper-inactive-fg`, `--stepper-indicator-size`, `--stepper-separator-size` and `--stepper-vertical-gap`.

<ComponentPreview name="stepper/custom-color" />

### Active Step

Use `v-model` to control the active step. The value is matched against each item's `value` (or the key set with `value-key`); a number that no item has is a step index. A value past the last step marks every step completed. Use `default-value` when you don't need to control it.

The component exposes `next()` and `prev()`, which move one step and emit `next` / `prev` with the new step, and `hasNext` / `hasPrev` to disable your buttons at either end. Here Finish sets the value past the last step, which completes them all.

<ComponentPreview name="stepper/model" />

### Content

The active step's `content` shows below a horizontal stepper and beside a vertical one. When less than 16rem would be left beside the steps, as on a phone, it moves below them. Use the `#content` slot to render richer content for every step.

<ComponentPreview name="stepper/content" />

### Linear

By default, only the completed steps, the active one and the one right after it can be selected. Set `:linear="false"` to let the user jump to any step.

<ComponentPreview name="stepper/linear" />

### Disabled

Use the `disabled` prop to show progress without letting the user change steps. Set `disabled` on an item to disable only that step. Disabled steps keep their look; they just can't be selected.

<ComponentPreview name="stepper/disabled" />

## Examples

### Dots Instead of Numbers

Use the `#indicator` slot to replace the content of every circle, here with a dot.

<ComponentPreview name="stepper/bullet" />

### Custom Completed Icon

The `state` slot prop tells the slot which step it is rendering, so the slot can swap only the completed check. The `ui` slot prop styles a custom icon like the built-in ones.

<ComponentPreview name="stepper/completed-icon" />

### Icon per State

The `#indicator` slot gets the step's `state`, so each state can show its own icon: a lock ahead, a key on the active step and an open lock once it's done.

<ComponentPreview name="stepper/dynamic-icon" />

### Check and Dots

The `#indicator` slot can also mix content: a check on completed steps and a small dot on the others.

<ComponentPreview name="stepper/indicator-slot" />

### Per-Item Slots

Set the `slot` field of an item to give it its own slots: `#<slot>-wrapper`, `#<slot>-title`, `#<slot>-description` and `#<slot>` for its content. They take precedence over the shared slots.

<ComponentPreview name="stepper/item-slot" />

### Read-Only Timeline

A disabled vertical stepper with icons reads as a timeline of what happens next.

<ComponentPreview name="stepper/trial-timeline" />

### Setup Checklist

A disabled `lg` stepper with icons and longer descriptions lists the tasks left to finish elsewhere in the app. The `ui` prop raises the descriptions to `text-sm`.

<ComponentPreview name="stepper/checklist" />

### Partial Progress

The `progress` field of an item fills part of the line after it, from `0` to `1`. Here the `#title` slot adds a time on the right of each step.

<ComponentPreview name="stepper/tracking" />

## API

### Props

<ApiTable component="Stepper" kind="props" />

### Slots

<ApiTable component="Stepper" kind="slots" />

### Emits

<ApiTable component="Stepper" kind="emits" />

## Theme

<ApiTheme component="Stepper" />
