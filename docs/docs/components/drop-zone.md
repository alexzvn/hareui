---
title: DropZone
description: Takes files by drop or from the file picker, filters them by type and size, and lists their upload state.
links:
  source: drop-zone/DropZone.vue
  styles: drop-zone/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { DropZone, DropZoneFileItem, DropZoneFileList } from '@hareui/vue'
</script>
```

<ComponentPreview name="drop-zone/basic" />

Bind `v-model` to get the selected files as a `File[]`. DropZone lists them below the area, each with a remove button.

```vue
<script setup lang="ts">
import { DropZone } from '@hareui/vue'
import { ref } from 'vue'

const files = ref<File[]>([])
</script>

<template>
  <DropZone v-model="files" label="Drop your receipts here" multiple />
</template>
```

To show upload progress, listen to `@add` and render your own list in the `#files` slot with `DropZoneFileList` and `DropZoneFileItem`. With `multiple`, DropZone still keeps every added file in its selection: call the slot's `removeFile` when you remove one from your list (or use `v-model`), so removed files aren't submitted with the form.

Set `name` to submit the files with a form; `required` and `validate` join form validation.

## Anatomy

DropZone renders the drop area (icon, label, description and a button that opens the file picker), a hidden file input, and the file list. The area text comes from props; each part can be replaced with a slot.

```vue
<template>
  <DropZone label="…" description="…" trigger-label="…">
    <template #icon />
    <!-- area icon (default: upload cloud) -->
    <template #label />
    <!-- label content -->
    <template #description />
    <!-- description content -->
    <template #trigger="{ open }" />
    <!-- replaces the picker button -->
    <template #error />
    <!-- FieldError content, rendered when invalid -->
    <template #files="{ files, removeFile }">
      <DropZoneFileList>
        <DropZoneFileItem name="…" :size="…" :status="…" :progress="…">
          <template #icon />
          <!-- replaces the file format icon -->
          <template #name />
          <!-- file name -->
          <template #meta />
          <!-- meta line (default: the formatted size) -->
          <!-- default slot: extra content below the meta line -->
          <template #retry />
          <!-- retry button label -->
          <template #remove />
          <!-- remove button icon -->
        </DropZoneFileItem>
      </DropZoneFileList>
    </template>
  </DropZone>
</template>
```

| `ui` key              | `data-slot`                        | Element                                                             |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `base`                | `drop-zone`                        | `<div>` root                                                        |
| `area`                | `drop-zone-area`                   | `<div>` drop target                                                 |
| `focusTarget`         | `drop-zone-focus-target`           | visually hidden `<button>` that makes the area focusable            |
| `icon`                | `drop-zone-icon`                   | `<span>` around the icon                                            |
| `label`               | `drop-zone-label`                  | `<span>` (iff `label` / `#label`)                                   |
| `description`         | `drop-zone-description`            | `<span>` (iff `description` / `#description`)                       |
| `trigger`             | `drop-zone-trigger`                | outline [Button](/docs/components/button) (unless `#trigger`)       |
| `input`               | `drop-zone-input`                  | hidden `<input type="file">`                                        |
| —                     | `field-error`                      | [FieldError](/docs/components/field-error) (while invalid)          |
| `fileList`            | `drop-zone-file-list`              | `<div>` around the file items                                       |
| `fileItem`            | `drop-zone-file-item`              | `<div>` per file                                                    |
| `fileFormatIcon`      | `drop-zone-file-format-icon`       | `<svg>` file shape                                                  |
| `fileFormatIconBadge` | `drop-zone-file-format-icon-badge` | `<div>` extension badge                                             |
| `fileInfo`            | `drop-zone-file-info`              | `<div>` around name, meta and progress                              |
| `fileName`            | `drop-zone-file-name`              | `<span>`                                                            |
| `fileMeta`            | `drop-zone-file-meta`              | `<span>`                                                            |
| `fileProgress`        | `drop-zone-file-progress`          | small [ProgressBar](/docs/components/progress-bar) (iff `progress`) |
| `fileRetryTrigger`    | `drop-zone-file-retry-trigger`     | `<button>` (iff `retryable` and `status="failed"`)                  |
| `fileRemoveTrigger`   | `drop-zone-file-remove-trigger`    | `<button>` (iff `removable`)                                        |

## Examples

### With File List

Keep your own list of uploads and render it in the `#files` slot. Pass `status` and `progress` to each item; a failed item gets a red border. With `retryable`, a failed item shows a retry button that emits `@retry`.

<ComponentPreview name="drop-zone/with-file-list" />

### Compact File List

`DropZoneFileList` and `DropZoneFileItem` also work on their own, without a drop area. Put your own content, such as a button, in the item's default slot. Here `class` turns the list into divided rows.

<ComponentPreview name="drop-zone/compact-file-list" />

### Disabled

`disabled` ignores drops and disables the picker button.

<ComponentPreview name="drop-zone/disabled" />

### Image Only

`accept` takes the same values as the file input: MIME types like `image/*` and extensions like `.pdf`. Files that don't match are rejected, and the area doesn't highlight while they are dragged over it.

<ComponentPreview name="drop-zone/image-only" />

### Max Size Limit

`max-size` sets the largest file size in bytes. `@reject` receives the files that don't fit, each with a `reason`: `type` or `size`.

<ComponentPreview name="drop-zone/max-size-limit" />

### Multiple Files

Without `multiple`, a new file replaces the selection, and when several files are dropped at once only the first is kept. With `multiple`, new files are appended to the `v-model` array.

<ComponentPreview name="drop-zone/multiple-files" />

### Custom Icon

Replace the upload icon with the `#icon` slot.

<ComponentPreview name="drop-zone/custom-icon" />

### Custom Triggers

The `#trigger` slot replaces the picker button. Call `open` from any button or link; `disabled` tells you when the zone is disabled.

<ComponentPreview name="drop-zone/custom-triggers" />

## Customization

### Tailwind CSS

Pass classes per part with the `ui` prop. The file keys of a DropZone's `ui` also style the `DropZoneFileItem`s inside it.

```vue
<template>
  <DropZone
    label="Upload a file"
    :ui="{ area: 'rounded-3xl border-solid bg-surface', fileItem: 'rounded-xl bg-surface' }"
  />
</template>
```

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { dropZone: { slots: { area: 'py-12', fileItem: 'rounded-xl' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="drop-zone"]` – root column (`flex flex-col gap-3`)
- `area` → `[data-slot="drop-zone-area"]` – dashed drop target
- `icon` → `[data-slot="drop-zone-icon"]` – icon wrapper; its default icon size is `size-8`, and a size class on your own icon wins
- `label` / `description` → `[data-slot="drop-zone-label"]` / `[data-slot="drop-zone-description"]`
- `trigger` → `[data-slot="drop-zone-trigger"]` – the outline button
- `fileList` → `[data-slot="drop-zone-file-list"]` – hidden when empty
- `fileItem` → `[data-slot="drop-zone-file-item"]` – bordered row
- `fileFormatIconBadge` → `[data-slot="drop-zone-file-format-icon-badge"]` – colored by `data-color`
- `fileProgress` → `[data-slot="drop-zone-file-progress"]` – the progress bar

The badge color comes from the file extension: PDF is red, images and spreadsheets green, documents blue, video and audio purple, archives orange, everything else gray. Set `color` on `DropZoneFileItem` to pick one yourself.

### Interactive States

- **Drop target**: `[data-drop-target="true"]` on the area while accepted files are dragged over it (accent border and background)
- **Focus visible**: `[data-focus-visible="true"]` on the area while its button has keyboard focus (focus ring)
- **Disabled**: `[data-disabled="true"]` on the root and the area (reduced opacity)
- **Invalid**: `[data-invalid="true"]` on the root
- **File status**: `[data-status="uploading|complete|failed"]` on each file item

Items fade in when added and fade out when removed; the other items slide into place. Both animations are skipped when the user prefers reduced motion.

## API Reference

### Props

<ApiTable component="DropZone" kind="props" />

### Slots

<ApiTable component="DropZone" kind="slots" />

### Emits

<ApiTable component="DropZone" kind="emits" />

### DropZoneFileList Props

<ApiTable component="DropZoneFileList" kind="props" />

### DropZoneFileItem Props

<ApiTable component="DropZoneFileItem" kind="props" />

### DropZoneFileItem Slots

<ApiTable component="DropZoneFileItem" kind="slots" />

### DropZoneFileItem Emits

<ApiTable component="DropZoneFileItem" kind="emits" />

### Theme

<ApiTheme component="DropZone" />

## Accessibility

- The area holds a visually hidden button labelled by the label and described by the description. <kbd>Tab</kbd> focuses it and rings the area; <kbd>Enter</kbd> or <kbd>Space</kbd> opens the file picker.
- Pasting files while the area is focused adds them, like a drop.
- The picker button is a regular button, and the file input stays out of the tab order.
- `invalid` sets `aria-invalid="true"` on the area button and the input; the error is announced via `role="alert"`.
- Each remove button is labelled "Remove" plus the file name, and each progress bar "Upload progress for" plus the file name.

## Related Components

<RelatedComponents :components="['button', 'progress-bar', 'field-error', 'form']" />
