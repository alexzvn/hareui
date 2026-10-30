---
title: Error
description: A pre-built error page to display when something goes wrong.
links:
  source: error/Error.vue
  styles: error/theme.ts
---

## Usage

The `Error` component renders a `<main>` element that fills the viewport below the header, like [`Main`](/docs/components/main), and centers the error details.

```ts
import { Error } from '@hareui/vue'
```

::: warning
Importing `Error` shadows the global `Error` constructor in that file. If you also need the constructor, rename the import: `import { Error as ErrorPage } from '@hareui/vue'`.
:::

Use the `error` prop to display an error. It accepts an object with `statusCode`, `statusMessage` and `message` (thrown by `createError`), or `status` and `statusText`, as thrown by H3. The message is hidden when it is the same as the status message.

<ComponentPreview name="error/basic" minHeight="400px" />

## Anatomy

```vue
<Error :error="error" redirect="/" :clear="true">
  <template #leading /> <!-- optional: above the status code, e.g. an icon or a logo -->
  <template #statusCode /> <!-- optional: replaces the status code -->
  <template #statusMessage /> <!-- optional: replaces the status message heading -->
  <template #message /> <!-- optional: replaces the message -->
  <template #links /> <!-- optional: replaces the clear button -->
  <!-- default slot: rendered after the links -->
</Error>
```

The status message renders as an `h1`. Use the `as` prop to change it, e.g. `:as="{ statusMessage: 'h2' }"`.

## Examples

### Leading

Use the `leading` slot to display an icon or a logo above the status code.

<ComponentPreview name="error/leading" minHeight="400px" />

### Clear

Use the `clear` prop to customize or hide the clear button. It accepts any [`Button`](/docs/components/button) prop and a `label`, which defaults to "Back to home". Set it to `false` to hide the button.

<ComponentPreview name="error/clear" minHeight="400px" />

### Redirect

Use the `redirect` prop to set the URL the clear button links to. It defaults to `/`.

<ComponentPreview name="error/redirect" minHeight="400px" />

### Custom handler

Listen to the `clear` event to handle the click yourself. Call `event.preventDefault()` to stop the link and navigate with your router, or set `redirect` to an empty string to render a plain button.

<ComponentPreview name="error/custom-handler" minHeight="400px" />

```vue
<Error
  :error="error"
  @clear="
    (event) => {
      event.preventDefault()
      router.push('/')
    }
  "
/>
```

## Customization

### Global theme override

Override the `error` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      error: {
        slots: { statusCode: 'text-danger', statusMessage: 'text-3xl' },
      },
    },
  }),
)
```

## API

### Error Props

<ApiTable component="Error" kind="props" />

### Error Slots

<ApiTable component="Error" kind="slots" />

### Error Emits

<ApiTable component="Error" kind="emits" />

## Theme

<ApiTheme component="Error" />
