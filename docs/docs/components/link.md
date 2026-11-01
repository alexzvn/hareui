---
title: Link
description: A styled anchor component for navigation with built-in icon support
links:
  source: link/Link.vue
  styles: link/theme.ts
  heroui: link
---

## Usage

```ts
import { Link } from '@hareui/vue'
```

<ComponentPreview name="link/basic" />

## Anatomy

```vue
<template>
  <!-- `icon` shows the external-link arrow; `#icon` replaces it -->
  <Link href="#" icon> Call to action </Link>
</template>
```

## Examples

### Icon Placement

<ComponentPreview name="link/icon-placement" />

### Link Props

The usual link attributes work, plus a few extras:

- `to` and `href` set the destination. With vue-router installed, an internal `to` navigates client-side.
- `target` and `rel` work as on `<a>`. `target="_blank"` adds `rel="noopener noreferrer"`.
- `download` downloads the file instead of opening it.
- `disabled` removes the `href`, so the link can't be followed or focused.

<ComponentPreview name="link/link-props" />

### Text Decoration with Tailwind CSS

Link is underlined on hover by default. Use Tailwind CSS text-decoration utilities to make the underline always visible, remove it entirely, or customize its color, style, thickness, and offset.

<ComponentPreview name="link/underline-and-offset" />

**Text Decoration Line:**

- `underline` - Always visible underline
- `no-underline` - Remove underline
- default `Link` styles - Underline appears on hover

**Text Decoration Color:**

- `decoration-accent`, `decoration-muted`, etc. - Set underline color using theme colors
- `decoration-muted/50` - Use opacity modifiers for semi-transparent underlines

**Text Decoration Style:**

- `decoration-solid` - Solid line (default)
- `decoration-double` - Double line
- `decoration-dotted` - Dotted line
- `decoration-dashed` - Dashed line
- `decoration-wavy` - Wavy line

**Text Decoration Thickness:**

- `decoration-1`, `decoration-2`, `decoration-4`, etc. - Control underline thickness

**Underline Offset:**

- `underline-offset-1`, `underline-offset-2`, `underline-offset-4`, etc. - Adjust spacing between text and underline

For more details, see the Tailwind CSS documentation:

- [text-decoration-line](https://tailwindcss.com/docs/text-decoration-line)
- [text-decoration-color](https://tailwindcss.com/docs/text-decoration-color)
- [text-decoration-style](https://tailwindcss.com/docs/text-decoration-style)
- [text-decoration-thickness](https://tailwindcss.com/docs/text-decoration-thickness)
- [text-underline-offset](https://tailwindcss.com/docs/text-underline-offset)

### Custom Icon

<ComponentPreview name="link/custom-icon" />

### Custom Element

`as` renders the link as another element or component. Here it is a `<button>` that looks like a link.

<ComponentPreview name="link/custom-element" />

## Customization

### Tailwind CSS

<ComponentPreview name="link/custom-styles" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      link: {
        slots: {
          base: 'font-semibold',
          icon: 'opacity-100',
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="link"]` – Base link styles with hover underline
- `icon` → `[data-slot="link-icon"]` – Link icon wrapper (`data-default-icon="true"` while it shows the built-in arrow)

### Interactive States

- **Focus**: `:focus-visible`
- **Hover**: `:hover`
- **Pressed**: `:active`
- **Disabled**: `[aria-disabled="true"]`
- **Current route**: `[data-active="true"]`

## API Reference

### Props

<ApiTable component="Link" kind="props" />

### Slots

<ApiTable component="Link" kind="slots" />

### Using with Routing Libraries

With vue-router installed, `to` goes through `RouterLink`: navigation is client-side and `[data-active=true]` marks
the current route (`exact` matches only the exact route, `active` overrides the match). Without a router, `to` renders
a plain `<a>`.

```vue
<template>
  <Link to="/about"> About Page </Link>
</template>
```

For another router (or a framework link component), pass it to `as`; it receives `to` and `href`:

```vue
<template>
  <Link :as="NuxtLink" to="/about"> About Page </Link>
</template>
```

## Theme

<ApiTheme component="Link" />

## Related Components

<RelatedComponents :components="['button', 'card']" />
