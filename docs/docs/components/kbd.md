---
title: Kbd
description: Display keyboard shortcuts and key combinations
links:
  source: kbd/Kbd.vue
  styles: kbd/theme.ts
  heroui: kbd
---

## Usage

```ts
import { Kbd } from '@hareui/vue'
```

<ComponentPreview name="kbd/basic" />

## Anatomy

```vue
<template>
  <!-- keys render as abbr symbols (title = key name); the default slot is the content -->
  <Kbd :keys="['command']"> K </Kbd>
</template>
```

| `ui` key  | Element  | Description                                                                    |
| --------- | -------- | ------------------------------------------------------------------------------ |
| `base`    | `<kbd>`  | The key container                                                              |
| `abbr`    | `<abbr>` | One per entry in `keys`, e.g. `⌘` with `title="Command"` (HeroUI's `Kbd.Abbr`) |
| `content` | `<span>` | Wraps the default slot (HeroUI's `Kbd.Content`)                                |

## Examples

### Variants

<ComponentPreview name="kbd/variants" />

### Navigation Keys

<ComponentPreview name="kbd/navigation-keys" />

### Inline Usage

<ComponentPreview name="kbd/inline-usage" />

### Instructional Text

<ComponentPreview name="kbd/instructional-text" />

### Special Keys

<ComponentPreview name="kbd/special-keys" />

## Customization

### Tailwind CSS

<ComponentPreview name="kbd/custom-styles" />

### Global theme override

Override the `kbd` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      kbd: {
        slots: {
          base: 'bg-gray-100 dark:bg-gray-800',
          abbr: 'font-bold',
          content: 'text-sm',
        },
      },
    },
  }),
)
```

## Styling Reference

HeroUI's Kbd renders no `data-slot` attributes; style it through `class`, `ui` or `createHareUI`.

- `base` – keyboard key styles with background and spacing (`variant="light"` makes the background transparent)
- `abbr` – abbreviation element for modifier keys
- `content` – content wrapper for key text

## API Reference

### Props

<ApiTable component="Kbd" kind="props" />

### Slots

<ApiTable component="Kbd" kind="slots" />

### KbdKey

Available values for `keys`, with the symbol and `title` each renders. `kbdKeysMap` and `kbdKeysLabelMap` are exported.

| Key        | Symbol | Title     |
| ---------- | ------ | --------- |
| `command`  | ⌘      | Command   |
| `shift`    | ⇧      | Shift     |
| `ctrl`     | ⌃      | Control   |
| `option`   | ⌥      | Option    |
| `enter`    | ↵      | Enter     |
| `delete`   | ⌫      | Delete    |
| `escape`   | ⎋      | Escape    |
| `tab`      | ⇥      | Tab       |
| `capslock` | ⇪      | Caps Lock |
| `up`       | ↑      | Up        |
| `right`    | →      | Right     |
| `down`     | ↓      | Down      |
| `left`     | ←      | Left      |
| `pageup`   | ⇞      | Page Up   |
| `pagedown` | ⇟      | Page Down |
| `home`     | ↖      | Home      |
| `end`      | ↘      | End       |
| `help`     | ?      | Help      |
| `space`    | ␣      | Space     |
| `fn`       | Fn     | Fn        |
| `win`      | ⌘      | Win       |
| `alt`      | ⌥      | Alt       |

## Theme

<ApiTheme component="Kbd" />

## Related Components

<RelatedComponents :components="['typography']" />
