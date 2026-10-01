---
title: Avatar
description: Display user profile images with customizable fallback content
links:
  reka: avatar
  source: Avatar.vue
  styles: avatar.ts
  heroui: avatar
---

## Usage

```ts
import { Avatar } from 'herouse'
```

<ComponentPreview name="avatar/basic" />

## Anatomy

Built on Reka UI's `AvatarRoot` / `AvatarImage` / `AvatarFallback`. The fallback shows
until the image loads, or if it fails.

```vue
<Avatar src="…" alt="…" fallback="JD">
  <template #fallback>JD</template>
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

### Tailwind CSS

<ComponentPreview name="avatar/custom-styles" />

### Global theme override

```ts
app.use(createHeroUse({
  ui: {
    avatar: {
      slots: { base: 'size-16' },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | — | The root container (Reka `AvatarRoot`) |
| `image` | — | The `<img>` element, rendered when `src` is set |
| `fallback` | `avatar-fallback` | The fallback container (text or `#fallback` slot) |

`color` only affects the `fallback` slot (it has no effect once an image has loaded).

## API Reference

### Props

<ApiTable component="Avatar" kind="props" />

### Slots

<ApiTable component="Avatar" kind="slots" />

## Related Components

- [Card](/docs/components/card)
- [Chip](/docs/components/chip)
