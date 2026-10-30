---
title: AvatarGroup
description: Display a stacked or grid group of avatars with overflow counting
links:
  source: avatar-group/AvatarGroup.vue
  styles: avatar-group/theme.ts
  heroui: avatar-group
---

## Usage

```ts
import { Avatar, AvatarGroup } from '@hareui/vue'
```

<ComponentPreview name="avatar-group/basic" />

## Anatomy

`Avatar` components go in the default slot. HeroUI's `AvatarGroup.Count` part becomes the
`#count` slot.

```vue
<AvatarGroup>
  <Avatar src="…" fallback="JD" />
  <template #count>+3</template> <!-- optional: explicit count (AvatarGroup.Count) -->
</AvatarGroup>
```

`ui` keys: `base`, `count`.

## Examples

### Max

<ComponentPreview name="avatar-group/max" />

### With Count

<ComponentPreview name="avatar-group/count" />

### Sizes

<ComponentPreview name="avatar-group/sizes" />

### Grid

<ComponentPreview name="avatar-group/grid" />

### Overlap

<ComponentPreview name="avatar-group/overlap" />

## Customization

### Tailwind CSS

<ComponentPreview name="avatar-group/custom-styles" />

### Global theme override

Override the `avatarGroup` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      avatarGroup: {
        slots: {
          base: '[--avatar-group-overlap:0.75rem] [--avatar-group-seam:2px]',
          count: 'font-semibold',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot`          | Description                 |
| -------- | -------------------- | --------------------------- |
| `base`   | `avatar-group`       | Base avatar group container |
| `count`  | `avatar-group-count` | Overflow count avatar       |

HeroUI's modifier classes correspond to props (HareUI renders utilities, not BEM classes, so
style through `class`, `ui` or `createHareUI`): `.avatar-group--grid` → `grid`,
`.avatar-group--clip` / `.avatar-group--ring` → `overlap`.

Stacked layout uses negative margin between siblings (`--avatar-group-overlap`, default `0.5rem`).
Clip mode masks overlapped avatars (not the last child / count) and optically nudges fallback
glyphs; ring mode uses a thin box-shadow outline via `--background`.

## API Reference

### Props

<ApiTable component="AvatarGroup" kind="props" />

### Slots

<ApiTable component="AvatarGroup" kind="slots" />

## Theme

<ApiTheme component="AvatarGroup" />

## Note

- `size`, `color` and `variant` are passed to **direct `Avatar` children only**, and only where the Avatar doesn't set them
- `max` truncates visible avatars when set and auto-counts the remaining ones; omit to show all
- For a known total (e.g. from the server), use the `#count` slot. It is not truncated by `max` and replaces the automatic count
- `grid` disables overlap and uses a wrapping grid layout instead
- `overlap` defaults to `"clip"` (crescent seam); use `"ring"` for the solid outline; no effect with `grid`
- No default `role="group"`. When the stack is meaningful (assignees, viewers), pass `role="group"` with `aria-label` or `aria-labelledby`

## Related Components

<RelatedComponents :components="['avatar', 'badge', 'chip']" />
