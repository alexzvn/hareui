---
title: Timeline
description: An ordered list of events, each with a marker on a rail, for activity feeds, histories and milestones.
links:
  source: timeline/Timeline.vue
  styles: timeline/theme.ts
---

## Usage

Pass the events in the `items` prop. Each item can have a `date`, `title`, `description` and an `icon` component or an `avatar` for its marker.

```ts
import { Timeline } from '@hareui/vue'
```

<ComponentPreview name="timeline/basic" />

## Anatomy

```vue
<Timeline :items="items">
  <template #indicator="{ item, index, state }" />   <!-- optional: the marker content -->
  <template #wrapper="{ item, index, state }" />     <!-- optional: replaces the text -->
  <template #date="{ item, index, state }" />        <!-- optional -->
  <template #title="{ item, index, state }" />       <!-- optional -->
  <template #description="{ item, index, state }" /> <!-- optional -->
</Timeline>
```

The timeline renders an `ol` with one `li` per event. Connectors between events are decorative, and so are markers that only show an icon or an avatar. It records what already happened rather than walking people through a task; for steps they move through themselves, reach for the stepper.

### Size

Use the `size` prop to change the marker (22, 28 or 36px) and the text size. Defaults to `md`.

<ComponentPreview name="timeline/size" />

### Density

Use the `density` prop to set the space between events: `compact` (12px) or `comfortable` (16px, the default).

<ComponentPreview name="timeline/density" />

### Status

Use the `status` field of an item to set the tone of its marker: `default`, `current`, `success`, `warning`, `danger` or `muted`. A `current` event gets `aria-current="true"`.

<ComponentPreview name="timeline/status" />

### Active event

Use `v-model` to mark how far along the timeline you are. The value is matched against each item's `value` (or the key set with `value-key`); a number that no item has is an event index. The active event gets `aria-current="true"`, the events before it are completed, and the connectors between completed events are filled. Use `default-value` when you don't need to control it.

<ComponentPreview name="timeline/model" />

### Color

Use the `color` prop to change the tone of the active and completed markers and of the filled connectors. Defaults to `accent`. An item's own `status` takes precedence.

<ComponentPreview name="timeline/color" />

### Reverse

Use the `reverse` prop when the newest event comes first: the events after the active one are the completed ones, and an index in `v-model` counts from the end.

<ComponentPreview name="timeline/reverse" />

### Orientation

Use the `orientation` prop to run the events across instead of down. Defaults to `vertical`.

<ComponentPreview name="timeline/orientation" />

### Axis

Use `axis="center"` to put the rail in the middle of a vertical timeline. The content takes one side and the date the other, so the `#date` slot can hold richer details.

<ComponentPreview name="timeline/axis" />

### Placement

Use the `placement` prop to choose the side the content takes on a centred axis: `end` (the default), `start`, or `alternate`, which switches sides every event. An item's `side` field overrides it.

<ComponentPreview name="timeline/placement" />

### Avatar

Use the `avatar` field of an item to show an [Avatar](./avatar) in the marker instead of an icon.

<ComponentPreview name="timeline/avatar" />

## Examples

### Custom marker

Use the `#indicator` slot to replace the content of every marker. The `state` slot prop is `active`, `completed` or `undefined`.

<ComponentPreview name="timeline/indicator-slot" />

### Per-item slots

Set the `slot` field of an item to give it its own slots: `#<slot>-indicator`, `#<slot>-wrapper`, `#<slot>-date`, `#<slot>-title` and `#<slot>-description`. Extra item fields are available in the slot props.

<ComponentPreview name="timeline/item-slot" />

### Trailing dates

Use the `ui` prop to rearrange the content, here with the date on the right of each event.

<ComponentPreview name="timeline/trailing-date" />

### Inside a card

A compact timeline fits in a [Card](./card). The `#description` slot adds a byline under every event.

<ComponentPreview name="timeline/in-card" />

### Select an event

The `select` event fires when an event is clicked, with the click and the item.

<ComponentPreview name="timeline/select" />

## API

### Props

<ApiTable component="Timeline" kind="props" />

### Slots

<ApiTable component="Timeline" kind="slots" />

### Emits

<ApiTable component="Timeline" kind="emits" />

## Theme

<ApiTheme component="Timeline" />
