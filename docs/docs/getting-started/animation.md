---
title: Animation
description: Add smooth animations and transitions to HareUI components.
---

HareUI ships [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) and exposes component state through `data-state`/`data-slot` attributes, so entrance/exit transitions are plain Tailwind utilities — no JavaScript animation library required.

## Built-in Animations

Overlay components (Modal, Popover, Tooltip) use Reka UI's `data-state` to drive enter/exit transitions:

```css
/* Popover entrance/exit */
[data-slot='popover'][data-state='open'] {
  @apply animate-in zoom-in-90 fade-in-0 duration-200;
}

[data-slot='popover'][data-state='closed'] {
  @apply animate-out zoom-out-95 fade-out duration-150;
}

/* Button press effect */
[data-slot='button']:active {
  transform: scale(0.97);
}
```

**`data-state` → Tailwind variant mapping:**

| Reka `data-state`           | Tailwind selector                                      | Used by                                                                            |
| --------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `checked` / `indeterminate` | `data-[state=checked]:`, `data-[state=indeterminate]:` | Checkbox, Switch, Radio                                                            |
| `active`                    | `data-[state=active]:`                                 | Tabs trigger                                                                       |
| `open`                      | `data-[state=open]:`                                   | Modal, Popover, Tooltip (`delayed-open`/`instant-open` for Tooltip)                |
| `closed`                    | `data-[state=closed]:`                                 | Modal, Popover, Tooltip — the node stays mounted until the exit animation finishes |

```css
/* Fade + zoom on open, fade out on close */
[data-slot='modal-dialog'] {
  @apply data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95;
  @apply data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95;
}
```

## CSS Animations

**Using Tailwind utilities:**

```vue
<!-- Pulse on hover -->
<Button class="hover:animate-pulse">Hover me</Button>
```

**Custom transitions:**

```css
/* Bouncy button press */
[data-slot='button']:active {
  animation: bounce 0.3s;
}

@keyframes bounce {
  50% {
    transform: scale(0.95);
  }
}
```

## Accessibility: Respecting Motion Preferences

HareUI's built-in transitions use Tailwind's `motion-reduce:` variant, so they are automatically disabled when a user enables "reduce motion" in their system settings:

```css
/* HareUI pattern — uses Tailwind's motion-reduce: */
[data-slot='button'] {
  @apply transition-colors motion-reduce:transition-none;
}
```

This expands to support both the native media query and an explicit opt-out:

```css
@media (prefers-reduced-motion: reduce) {
  [data-slot='button'] {
    transition: none;
  }
}
```

**Disabling animations globally:** add `data-reduce-motion="true"` to `<html>` or `<body>`:

```html
<html data-reduce-motion="true">
  <!-- All HareUI animations are disabled -->
</html>
```

## Performance Tips

**Prefer GPU-accelerated properties** — `transform` and `opacity` instead of layout-triggering properties:

```css
/* Good — GPU accelerated */
.slide-in {
  transform: translateX(-100%);
  transition: transform 0.3s;
}

/* Avoid — triggers layout */
.slide-in {
  left: -100%;
  transition: left 0.3s;
}
```

## Next Steps

- Learn about [Styling](/docs/getting-started/styling) approaches
- Explore the [Theming](/docs/getting-started/theming) system
- Browse [Component](/docs/components/modal) examples
