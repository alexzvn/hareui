---
title: Unreleased
description: Changes on main that are not yet published to npm.
---

Changes on `main` that will ship in the next `@hareui/vue` release.

## New

### Vite plugin

`@hareui/vue/vite` auto-imports HareUI components in templates through [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) and applies app-wide theme overrides at build time.

```ts [vite.config.ts]
import hareui from '@hareui/vue/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss(), hareui({ prefix: 'H' })],
})
```

- `prefix` lets you write `<HButton>` or `<h-button>`.
- `ui` sets theme overrides below `createHareUI({ ui })`.
- `HareUIResolver({ prefix })` plugs into an existing unplugin-vue-components setup.

See [Frameworks](/docs/getting-started/frameworks#vite-plugin-optional).

### Form schema validation

`Form` validates a reactive `state` with any [Standard Schema](https://standardschema.dev) (Zod, Valibot, ArkType, Yup, Effect Schema, …) or a Superstruct struct, with a form-level `validate` function, or both.

```vue
<Form :schema="schema" :state="state" @submit="onSubmit" @error="onError">
  <TextField v-model="state.email" name="email" label="Email" />
</Form>
```

- Errors appear on the field whose `name` matches, by exact name or by the field's `error-pattern`.
- `@submit` fires once validation passes, with the schema's output as `event.data`. `@error` gets `event.errors`, and each error carries its control's `id` so you can focus it.
- `validate-on`, `validate-on-input-delay` and the field prop `eager-validation` control when a field is validated as the user types and leaves it.
- A `nested` form is validated together with its parent form.
- `loading-auto` disables the fields while an async `@submit` runs.
- The form ref (`FormInstance`) exposes `validate`, `submit`, `clear`, `getErrors`, `setErrors`, and dirty, touched and blurred field tracking.

A form without `state`, `schema` or `validate` still submits natively, as before.

See [Form](/docs/components/form#schema-validation).

## Changes

- `<Form disabled>` disables every form control inside it, including sliders, color pickers and date pickers. A `Fieldset` inside a disabled `Fieldset` or `Form` is disabled too.
