---
title: Unreleased
description: Changes merged since the last release.
---

## New

### Component aliases

- The `hareui()` Vite plugin takes `aliases`, a map from a tag name to a HareUI component: `aliases: { Btn: 'Button' }` makes `<Btn>` auto-import `Button`. The prefix doesn't apply to alias names, and an alias pointing at a component that doesn't exist fails when the plugin starts. See [Frameworks](/docs/getting-started/frameworks#aliases).
- `defineAlias(Component, { props, ui, class })` makes a preset: a component that renders `Component` with your default props and classes. What you pass on the instance wins, `ui` merges per slot, and slots, `v-model` and template refs pass through. See [Composition](/docs/getting-started/composition#presets).
- `createHareUI({ components })` registers components globally by name, for presets or for apps that don't use the Vite plugin.

### Unstyled components

- `createHareUI({ unstyled: true })` renders every component without HareUI's classes, and `unstyled: ['button', 'card']` only the listed ones. The `ui` and `class` props, data attributes and behavior stay. Setting `unstyled` on the injected `hareUIConfigKey` config restyles mounted components, inside `<App>` too. See [Theming](/docs/getting-started/theming#unstyled-components).
- A few classes moved from themes into component markup so they survive `unstyled`: the `sr-only` labels of ChatAttachment, ChatLoader, ChatMessageActions, DropZone, NumberStepper and RichTable; the `touch-none` of drag handles and the `select-none` of the Sheet, DashboardResizeHandle and RichTable ones; `relative` on ColorArea and ColorSlider; the hit area of the Table and RichTable column resizers; RichTable's scroll container, pinned columns and sticky header and footer; and the positioning of the Slider fill, Rating stars, PressableFeedback ripple, chart tooltip and overlay, Carousel track and Map's canvas, markers, popups and controls. Styled output is unchanged; a `createHareUI({ ui })` override of those slots no longer removes them.
- Tabs toggles its scroll buttons, and Calendar and RangeCalendar their year picker, with `v-show` instead of theme classes.
- Hidden controls stay out of reach under `unstyled`: the empty SearchField and Select clear buttons, and the Calendar and RangeCalendar nav buttons and day grid while the year picker is open, are `inert`.
- RichTable puts its pinned-column classes on pinned cells only, which shortens every other cell's `class`.

## Changed

### Short component classes

- 29 components render short BEM classes instead of long Tailwind class lists: Button, ToggleButton, Checkbox, CheckboxButtonGroup, RadioGroup, RadioButtonGroup, Switch, Calendar, RangeCalendar, Label, FieldError, Input, TextArea, InputGroup, NumberField, NumberStepper, DateInputGroup, SearchField, Select, ComboBox, ListBox, Dropdown, ContextMenu, Table, RichTable, Tree, TagGroup, Pagination and Tabs. For example, a Button's root went from 1745 characters of classes to a few names like `h-button h-button--primary`. Each component's styles live next to it as `<name>.css` and ship in `@hareui/vue/style.css`. The rendered result is unchanged.
- The classes sit in `@layer components`, below Tailwind utilities, so a utility you pass through `class` or `ui` now wins in every state, including hover and selected. Before, the component's state styles could win over it. Focus and invalid rings are the exception: a plain `ring-1` doesn't remove them, while a state utility like `focus-visible:ring-4` still replaces them. Each component page lists its classes under "CSS classes".
