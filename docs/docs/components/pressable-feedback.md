---
title: PressableFeedback
description: Adds ripple, highlight, hold-to-confirm and progress feedback to any pressable element
links:
  source: pressable-feedback/PressableFeedback.vue
  styles: pressable-feedback/theme.ts
---

## Usage

```ts
import { PressableFeedback } from '@hareui/vue'
```

`ripple` grows a circle from the point you press. `highlight` tints the whole element instead. Press both to compare.

<ComponentPreview name="pressable-feedback/basic" />

### With Button

Pass `Button` to `as` to keep its look. Button props such as `variant`, `size` and `icon-only` pass straight through.
They are not in the Props table below, so check them on the [Button](/docs/components/button) page. The feedback
layers render inside Button's default slot, over your content.

## Anatomy

```vue
<PressableFeedback :as="Button" ripple>Publish</PressableFeedback>
```

`PressableFeedback` renders the element you pass to `as` and lays its feedback over the content. Turn an effect on
with `true`, or pass an object to change its options. Effects can be combined.

## Effects

### Ripple

`ripple` grows a circle from the point you press, or from the centre when you press with the keyboard. The circle
stays until you release, then fades out. While the pointer hovers, the element gets a light tint of its text colour.

<ComponentPreview name="pressable-feedback/ripple" />

The circle takes the element's text colour. Set the `ripple` slot's colour through `ui` to change it, and pass
`duration`, `hoverOpacity` or `pressedOpacity` to change how it moves.

<ComponentPreview name="pressable-feedback/ripple-options" />

### Highlight

`highlight` tints the element with its text colour: lightly on hover, a little more while pressed.

<ComponentPreview name="pressable-feedback/highlight" />

### Hold to confirm

`hold` asks for a held press before a destructive action. An overlay sweeps across the element while you hold it,
with the pointer, Space or Enter, and `@confirm` fires once it has been held for the full `duration` (2 seconds by
default). Releasing earlier, or moving the pointer off the element, cancels the hold and the overlay snaps back.

<ComponentPreview name="pressable-feedback/hold" />

The overlay is accent by default. Restyle it through `ui.hold` with an opaque colour (see the tip under
[Overlay content](#overlay-content)).

### Hold duration

Pass `duration` in ms to ask for a shorter or longer hold. Keep it long enough that a press can't confirm by
accident.

<ComponentPreview name="pressable-feedback/hold-duration" />

### Sweep direction

`sweep` sets the edge the overlay sweeps toward. It takes `right` (default), `left`, `down` or `up`. It works for both
the hold and progress effects.

<ComponentPreview name="pressable-feedback/sweep" />

### Progress

`progress` runs the sweep after a click, with no holding: the overlay fills over `duration` and `@complete` fires.
It resets on its own `resetDelay` ms later. Set `autoReset: false` to keep it until you call `reset()`.

<ComponentPreview name="pressable-feedback/progress" />

### Keep the result

With `autoReset: false`, the finished overlay stays until you call `reset()` through a template ref. Use it when the
result is something people act on next, such as a file to download.

<ComponentPreview name="pressable-feedback/progress-manual-reset" />

## Examples

### Overlay content

The hold and progress overlays repeat the default slot unless you fill the `#hold` or `#progress` slot. Every slot
receives the hold state and controls: `holding`, `progressing`, `complete` and `reset`.

With `resetOnComplete: false`, a confirmed hold stays covered until you call `reset()`. Call it from the slot or
through a template ref.

<ComponentPreview name="pressable-feedback/hold-slot" />

::: tip
While the overlay sweeps, keep its label the same as the button label and change it once `complete` is true. A
different label lines up badly with the one underneath at the sweep edge.

Give the overlay an opaque colour, such as `bg-success`. A soft, translucent colour lets the label underneath show
through.
:::

### Combined effects

<ComponentPreview name="pressable-feedback/combined" />

### Custom element

Any element can be pressable. A plain element other than a `button` gets `role="button"`, joins the tab order and
clicks on Enter and Space, like a native button.

<ComponentPreview name="pressable-feedback/custom-element" />

### Pressable cards

Cards, playlists and list rows can take the same feedback. A large white surface reads better with a softer
`hoverOpacity` and `pressedOpacity` than the button defaults.

<ComponentPreview name="pressable-feedback/pressable-cards" />

### Disabled

A disabled element shows no feedback and emits nothing.

<ComponentPreview name="pressable-feedback/disabled" />

## Accessibility

- With the default `as="button"`, the element is a native `<button type="button">`.
- Another plain element gets `role="button"` and `tabindex="0"`, plus `aria-disabled` when disabled.
- A component passed to `as`, such as `Button`, receives `disabled` and keeps its own semantics.
- Space and Enter press the element like the pointer does: holding either key fills the hold overlay, and releasing
  it early cancels the hold.
- Feedback layers are `aria-hidden`. A hold is only visible, so tell people what it does in the label ("Hold to
  delete") and announce the result, for example in a `role="status"` region.
- Under `prefers-reduced-motion: reduce`, the ripple appears at full size without growing and the hold and progress
  overlays fade in instead of sweeping. The hold still takes the full `duration`.

## API

### Props

<ApiTable component="PressableFeedback" kind="props" />

### Slots

<ApiTable component="PressableFeedback" kind="slots" />

### Emits

<ApiTable component="PressableFeedback" kind="emits" />

### Expose

A template ref exposes `reset()`, which hides a completed hold or progress overlay.

## Theme

<ApiTheme component="PressableFeedback" />

## Related Components

<RelatedComponents :components="['button', 'toggle-button', 'card']" />
