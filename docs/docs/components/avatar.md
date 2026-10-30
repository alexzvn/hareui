---
title: Avatar
description: Display user profile images with customizable fallback content
links:
  reka: avatar
  source: avatar/Avatar.vue
  styles: avatar/theme.ts
  heroui: avatar
---

## Usage

```ts
import { Avatar } from '@hareui/vue'
```

<ComponentPreview name="avatar/basic" />

## Anatomy

Avatar is a single component: the image and the fallback are set through props and slots. The fallback
shows until the image loads, or if it fails.

```vue
<Avatar src="…" alt="…" fallback="JD">
  <template #image /> <!-- optional: custom image component (Avatar.Image asChild) -->
  <template #fallback /> <!-- optional: replaces the fallback text (Avatar.Fallback children) -->
</Avatar>
```

`ui` keys: `base`, `image`, `fallback`.

## Examples

### Sizes

<ComponentPreview name="avatar/sizes" />

### Colors

<ComponentPreview name="avatar/colors" />

### Variants

<ComponentPreview name="avatar/variants" />

### Fallback Content

<ComponentPreview name="avatar/fallback" />

## Customization

### Custom Image Component

Use the `#image` slot to compose with a custom image component, such as a framework's
optimized image component. Pass `src` on `Avatar` so it can track the
loading state and show the fallback until the image is ready; the slotted element receives
`src`, the `image` classes and the loading-state visibility.

<ComponentPreview name="avatar/custom-image-component" />

### Tailwind CSS

Use the `class` prop for the root and `:ui="{ fallback: '…' }"` for the fallback:

<ComponentPreview name="avatar/custom-styles" />

### Global theme override

Override the `avatar` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      avatar: {
        slots: {
          base: 'size-16 border-2 border-accent',
          fallback: 'bg-linear-to-br from-purple-500 to-pink-500',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key   | `data-slot`       | Description                                                         |
| ---------- | ----------------- | ------------------------------------------------------------------- |
| `base`     | —                 | Base container with default size (`size-10`)                        |
| `image`    | —                 | Image element with aspect-square sizing, rendered when `src` is set |
| `fallback` | `avatar-fallback` | Fallback container with centered content (text or `#fallback` slot) |

Appearance is controlled by the `size`, `variant` and `color` props (HareUI renders utility
classes, so style through `class`, `ui` or `createHareUI`). `color` only
affects the fallback (it has no effect once an image has loaded).

## API Reference

### Props

<ApiTable component="Avatar" kind="props" />

### Slots

<ApiTable component="Avatar" kind="slots" />

### Emits

<ApiTable component="Avatar" kind="emits" />

## Theme

<ApiTheme component="Avatar" />

## Related Components

<RelatedComponents :components="['card', 'chip']" />
