# herouse — Vue 3 port of HeroUI v3 (web), foundation + core components

## Context

Reimplement HeroUI v3 (React, https://github.com/heroui-inc/heroui, branch `v3`, version 3.2.6) as a Vue 3 library named `herouse`, in the empty directory `/Volumes/Workspaces/opensource/herouse`. The API follows Nuxt UI v4 conventions instead of HeroUI's compound components (`Card.Header`): named template slots, a `:ui` prop for per-element class overrides, a `class` prop merged into the root element, and app-level theme overrides. **Rendered output must be visually identical to HeroUI**, proven by an automated computed-style + screenshot diff against a React reference app using `@heroui/react@3.2.6`. **Docs are required**: a VitePress site that looks identical to https://heroui.com/docs/react (layout, typography, preview cards), with Getting Started, Handbook, one page per component, and `llms.txt`. Deliverable: bun workspace, tokens, `tv`/`ui`-prop infrastructure, a Vite playground, tests, React reference + parity diff, docs, and the core components: Button, Spinner, CloseButton, Card, Chip, Avatar, Label, Description, FieldError, Input, TextField, Checkbox, Switch, RadioGroup, Tabs, Modal, Popover, Tooltip. Plain Vue library only (no Nuxt module).

## Reference sources (prerequisite)

Clones must exist; recreate if `/tmp` was wiped:

```sh
git clone --depth 1 -b v3 https://github.com/heroui-inc/heroui /tmp/heroui
git clone --depth 1 -b v4 https://github.com/nuxt/ui /tmp/nuxt-ui
git clone --depth 1 https://github.com/unovue/reka-ui /tmp/reka-ui
```

Per HeroUI component `<c>` (kebab-case):
- `/tmp/heroui/packages/react/src/components/<c>/<c>.tsx` — parts, props, defaults, exact `data-slot` strings, ARIA wiring.
- `/tmp/heroui/packages/styles/src/components/<c>/<c>.styles.ts` — tv slots → BEM class names, variants, defaultVariants.
- `/tmp/heroui/packages/styles/components/<c>.css` — the real styles (Tailwind `@apply` + nested selectors) to translate.
- `/tmp/heroui/packages/react/src/components/icons.tsx` — SVG icons (check, minus, close, chevron).
- Nuxt UI equivalents for structure: `/tmp/nuxt-ui/src/runtime/components/{Button,Card,Checkbox,Switch,RadioGroup,Tabs,Modal,Popover,Tooltip}.vue`.

HeroUI is MIT (Copyright (c) 2020 Next UI Inc.). Copied CSS and SVGs keep attribution: add `/tmp/heroui/LICENSE` contents to `packages/herouse/THIRD_PARTY_LICENSES.md`.

## API conventions (apply to every component)

- **Naming**: HeroUI variant names/values kept verbatim (`variant="primary"`, `size="sm"`, `color="accent"`). State props are Vue-style without `is`: `disabled`, `pending`, `invalid`, `required`, `iconOnly`, `fullWidth`. Two-way state uses `v-model` (`modelValue`) or `v-model:open` (`open`) with a `default*` uncontrolled counterpart (`defaultValue`, `defaultOpen`). Native events (`@click`, `@focus`) fall through via attrs; no `onPress`.
- **Exports**: unprefixed component names (`Button`, `Card`, …) from `herouse`.
- **Compound parts → slots**: HeroUI parts become named template slots on one component (e.g. `Card.Header` → `#header`). Exception noted per component.
- **`ui` prop**: `ui?: Partial<Record<SlotKey, ClassValue>>`; keys = the component theme's slot keys. Every rendered element of a slot calls `ui.<slot>({ class: props.ui?.<slot> })`.
- **`class` prop**: declared as a prop (`class?: any`) and merged (tailwind-merge) into the root slot: `ui.base({ class: [props.ui?.base, props.class] })`. Overlay components (Modal, Popover, Tooltip) apply `class` to their visible surface slot (named per component).
- **Root slot key** is always `base` (HeroUI naming). Single-element components still use `slots: { base }` so `ui` is uniformly an object.
- **`data-slot`** on each element = the exact HeroUI `data-slot` string from the React source (e.g. `card-header`, `checkbox-control`, `modal-dialog`), so cross-component selectors translate 1:1.
- **`as` prop** (Reka `Primitive`) on non-interactive roots where HeroUI allows element override: Button, Card, Chip.
- **Precedence** (lowest → highest): theme file < `createHeroUse({ ui })` app config < variant props < `:ui` slot class < `class` prop (root only). tailwind-merge resolves conflicts, last wins.
- No `SlotClassReplacer`/function-form classes (Nuxt UI feature); plain merge only.

## Approach

### Step 1 — Workspace scaffold

Create (bun workspaces; no git repo exists — run `git init` first):

```
package.json                 { "private": true, "name": "herouse-monorepo", "workspaces": ["packages/*", "playground", "reference", "docs"],
                               "scripts": { "dev": "bun --cwd playground run dev", "build": "bun --cwd packages/herouse run build",
                                            "test": "bun --cwd packages/herouse run test", "typecheck": "bun --cwd packages/herouse run typecheck",
                                            "reference": "bun --cwd reference run dev", "parity": "bun parity/compare.ts",
                                            "docs:dev": "bun --cwd docs run dev", "docs:build": "bun --cwd docs run build" } }
tsconfig.base.json           strict, target ES2022, module ESNext, moduleResolution Bundler, jsx preserve, isolatedModules, skipLibCheck, types: []
.gitignore                   node_modules, dist, *.tsbuildinfo, docs/.vitepress/cache, docs/.vitepress/dist, docs/.vitepress/api, parity/out
packages/herouse/            library (Steps 2–5)
playground/                  Vite app (Step 6)
reference/                   React + @heroui/react app (Step 7)
parity/                      cross-app diff script + case list (Step 7)
docs/                        VitePress docs (Step 9)
```

`packages/herouse/package.json`:
- `"name": "herouse"`, `"type": "module"`, `"sideEffects": ["**/*.css"]`, `"files": ["dist"]`.
- `"exports"`: `".": { "types": "./dist/index.d.ts", "style": "./dist/styles/index.css", "import": "./dist/index.js" }`, `"./style.css": "./dist/styles/index.css"`.
- `dependencies`: `reka-ui@^2.10.5`, `tailwind-variants@^3.3.1`, `tailwind-merge@^3.7.0`, `tw-animate-css@^1.4.0`.
- `peerDependencies`: `vue@^3.5.0`, `tailwindcss@^4.3.0`.
- `devDependencies`: `vue@^3.5.43`, `tailwindcss@^4.3.3`, `vite@^8.3.2`, `@vitejs/plugin-vue@^6.0.9`, `vue-tsc@^3.3.11`, `typescript@~6.0.3`, `vitest@^5.0.3`, `@vue/test-utils@^2.5.1`, `happy-dom@^20.14.5`.
- scripts: `"build": "vite build && vue-tsc -p tsconfig.build.json && cp -R src/styles dist/styles"`, `"test": "vitest run"`, `"typecheck": "vue-tsc --noEmit -p tsconfig.json"`.

`packages/herouse/vite.config.ts`: `@vitejs/plugin-vue`; `build.lib = { entry: 'src/index.ts', formats: ['es'], fileName: 'index' }`; externalize `vue`, `reka-ui`, `tailwind-variants`, `tailwind-merge` (regex `/^(vue|reka-ui|tailwind-variants|tailwind-merge)(\/|$)/`); output `preserveModules: true`, `preserveModulesRoot: 'src'`, `entryFileNames: '[name].js'`. Vite 8 key is `build.rolldownOptions`; if Vite reports it unknown, use `build.rollupOptions`. `build.emptyOutDir: true`, `build.cssCodeSplit: false` (components import no CSS).
`tsconfig.build.json`: extends `./tsconfig.json`, `include: ["src"]`, `declaration`, `emitDeclarationOnly`, `outDir: "dist"`, `rootDir: "src"`.
`vitest.config.ts`: plugin-vue, `test.environment: 'happy-dom'`, `test.include: ['test/**/*.spec.ts']`.

If `vue-tsc` fails against TypeScript 6 (crash or "unsupported TypeScript version"), pin `typescript@5.9.3`.

### Step 2 — Tokens and global CSS (copied from HeroUI)

Copy verbatim from `/tmp/heroui/packages/styles/` into `packages/herouse/src/styles/`:

| Source | Target |
|---|---|
| `themes/shared/theme.css` (`@theme inline` color/radius/shadow/ease/animate tokens incl. `--animate-spin-fast`) | `theme.css` |
| `themes/default/variables.css` (light/dark/`:root` vars, `.dark` / `[data-theme=dark]`) | `variables.css` |
| `base/base.css`, `base/scrollbar.css` | `base.css`, `scrollbar.css` |
| `utilities/index.css` (`@utility focus-ring`, `status-focused`, `status-disabled`, `no-highlight`, `touch-target`, …) | `utilities.css` |
| `variants/index.css` (`@custom-variant motion-reduce/motion-safe/dark`) | `variants.css` |

`src/styles/index.css` (consumer imports it after `@import "tailwindcss";`):

```css
@import "tw-animate-css";
@import "./theme.css";
@import "./variables.css";
@import "./base.css" layer(base);
@import "./scrollbar.css" layer(base);
@import "./utilities.css";
@import "./variants.css";
@source "../";
```

`@source "../"` is relative to the stylesheet: from `src/styles/` it scans `src/` (playground/dev), from `dist/styles/` it scans `dist/` (published). Do NOT `@import "tailwindcss"` here (consumer owns it, as with Nuxt UI). Do not port `themes/default/components/index.css` (empty in HeroUI).

### Step 3 — Theme/`ui` infrastructure

Files in `packages/herouse/src/`:

- `utils/tv.ts`: `export const tv = createTV({})` from `tailwind-variants` (twMerge enabled by default). Re-export `type ClassValue`.
- `types/tv.ts`:
  ```ts
  import type { ClassValue } from 'tailwind-variants'
  export interface ThemeShape { slots: Record<string, ClassValue>; variants?: Record<string, Record<string, any>>; compoundVariants?: any[]; defaultVariants?: Record<string, any> }
  export type ComponentVariants<T extends ThemeShape> = { [K in keyof T['variants']]: keyof T['variants'][K] }
  export type ComponentSlots<T extends ThemeShape> = { [K in keyof T['slots']]?: ClassValue }
  export type ComponentUI<T extends ThemeShape> = { [K in keyof T['slots']]: (props?: { class?: ClassValue }) => string }
  export interface ThemeOverride<T extends ThemeShape> { slots?: ComponentSlots<T>; variants?: { [K in keyof T['variants']]?: Record<string, ClassValue | Record<string, ClassValue>> }; compoundVariants?: any[]; defaultVariants?: { [K in keyof T['variants']]?: keyof T['variants'][K] } }
  ```
  Boolean variants (`true`/`false` keys) are typed as `boolean` props directly in components, not via `ComponentVariants`.
- `theme/index.ts`: `export { default as button } from './button'` … one line per theme (keys camelCase: `button, spinner, closeButton, card, chip, avatar, label, description, fieldError, input, textField, checkbox, switch, radioGroup, tabs, modal, popover, tooltip`). `export type Themes = typeof import('./index')`.
- `config.ts`:
  ```ts
  export interface HeroUseConfig { ui?: { [K in keyof Themes]?: ThemeOverride<Themes[K]> } }
  export const heroUseConfigKey: InjectionKey<HeroUseConfig> = Symbol('herouse-config')
  export function createHeroUse(config: HeroUseConfig = {}): Plugin { return { install(app) { app.provide(heroUseConfigKey, reactive(config)) } } }
  ```
  Plugin is optional; components work without it.
- `composables/useComponentUI.ts`:
  ```ts
  export function useComponentUI<T extends ThemeShape>(name: keyof Themes, theme: T, variantProps: () => Record<string, unknown>): ComputedRef<ComponentUI<T>> {
    const config = inject(heroUseConfigKey, {})
    return computed(() => tv({ extend: theme, ...(config.ui?.[name] ?? {}) } as any)(variantProps()) as ComponentUI<T>)
  }
  ```
  Same pattern as `/tmp/nuxt-ui/src/runtime/components/Card.vue:49` (theme passed as plain object to `extend`). If tailwind-variants rejects a plain object for `extend` at runtime, wrap as `extend: tv(theme)`.
- `index.ts`: export all components, `createHeroUse`, `heroUseConfigKey`, `type HeroUseConfig`, `* as themes` from `./theme`, types from `./types/tv`, each component's `*Props`/`*Slots`/`*Emits` interfaces.

Theme file shape (`src/theme/<name>.ts`): `export default { slots: { base: '…', … }, variants: { … }, compoundVariants: [ … ], defaultVariants: { … } }` — a plain object literal (no `as const` needed; keys drive types). Variant/slot keys and defaultVariants copy HeroUI's `<c>.styles.ts` exactly; class strings come from translating `<c>.css` (Step 4).

### Step 4 — CSS → tailwind-variants translation rules

For each BEM class in `<c>.styles.ts`, take the matching rules in `<c>.css` and emit utility strings into the same slot/variant key. Rules:

1. `@apply x y z` → copy utilities as-is.
2. Plain declarations → Tailwind utilities when an exact one exists, otherwise arbitrary properties: `--button-bg: var(--accent)` → `[--button-bg:var(--accent)]`; `background-color: var(--button-bg)` → `bg-(--button-bg)`; multi-value `transition: transform 250ms var(--ease-smooth), background-color 100ms var(--ease-out)` → `[transition:transform_250ms_var(--ease-smooth),background-color_100ms_var(--ease-out)]`.
3. Nested selectors → arbitrary variants: `& svg:not([data-slot="spinner"] svg)` → `[&_svg:not([data-slot=spinner]_svg)]:size-5`; `&:has(…)` → `has-[…]:`; `@media (hover: hover) { &:hover }` → `hover:` (Tailwind v4 `hover:` already wraps `@media (hover:hover)`).
4. Parent-state selectors (`.checkbox[data-selected] .checkbox__control`) → put `group/<component>` (e.g. `group/checkbox`) in the root slot string and use `group-data-[state=checked]/checkbox:` on the child slot. Always named groups to avoid nesting collisions.
5. Compound modifier selectors (`.chip--primary.chip--accent`) → `compoundVariants: [{ variant: 'primary', color: 'accent', class: '…' }]` (use `{ slotKey: '…' }` form for slotted themes).
6. State mapping (React Aria → Vue/Reka). Drop RAC-only attributes; keep native pseudo-classes:
   | HeroUI selector | Tailwind variant in herouse |
   |---|---|
   | `:hover`, `[data-hovered=true]` | `hover:` |
   | `:active`, `[data-pressed=true]` | `active:` |
   | `:focus-visible`, `[data-focus-visible=true]` | `focus-visible:` (for focus within a Reka-wrapped control use `group-has-focus-visible/<c>:`) |
   | `:disabled`, `[aria-disabled=true]` | `disabled:` and `aria-disabled:` |
   | `[data-disabled=true]` | `data-disabled:` (Reka emits `data-disabled=""`) |
   | `[data-selected=true]` checkbox/switch/radio | `data-[state=checked]:` (Reka CheckboxRoot/SwitchRoot/SwitchThumb/RadioGroupItem) |
   | `[data-indeterminate=true]` | `data-[state=indeterminate]:` |
   | `[data-selected=true]` tab | `data-[state=active]:` (Reka TabsTrigger) |
   | `[data-entering=true]` | `data-[state=open]:` (Dialog/Popover); tooltip: `data-[state=delayed-open]:` and `data-[state=instant-open]:` |
   | `[data-exiting=true]` | `data-[state=closed]:` (Reka Presence keeps the node mounted until `animate-out` ends) |
   | `[data-placement=top]` on floating content | `data-[side=top]:` (Reka popper `data-side`) |
   | `[data-orientation=…]` | unchanged (Reka emits it on tabs) |
   | `[data-pending=true]`, `[data-invalid=true]`, `[data-required=true]` | unchanged; herouse components set these attributes themselves (`"true"` or omitted) |
7. Modal `[data-placement=…]` blocks (not floating) → tv variant `placement` (`auto|top|center|bottom`, default `auto`) on the slots they style.
8. Anything inexpressible as a utility (only expected: new `@keyframes`) → add to `src/styles/theme.css` inside `@theme` as `--animate-*` + `@keyframes`, then use `animate-*`. No per-component CSS files.
9. `::backdrop`, `::before`, `::after` → `backdrop:`, `before:`, `after:` variants (incl. `touch-target` utility which uses `::after`).

Reference translation (verify Button against this before porting others), from `button.css` `.button--primary`:
`primary: 'button--primary'` → `primary: '[--button-bg:var(--accent)] [--button-bg-hover:var(--accent-hover)] [--button-bg-pressed:var(--accent-hover)] [--button-fg:var(--accent-foreground)]'`.

### Step 5 — Components

All in `packages/herouse/src/components/<Name>.vue` with `<script setup lang="ts">`, `defineProps<…>()` with `withDefaults` only where HeroUI has a non-tv default, `defineSlots`, `defineModel` for v-model. Themes in `src/theme/<camelName>.ts`. Build Button first (reference for all others), then the rest in any order respecting deps (Spinner before Button's pending state; Label/Description/FieldError before TextField/Checkbox/Switch/RadioGroup; CloseButton before Modal).

Every prop, slot (in `defineSlots`) and emit gets a one-line JSDoc comment, plus `@defaultValue <value>` when a default exists (tv `defaultVariants` count as defaults). Step 9's API tables are generated from these comments by `vue-component-meta`. Take the wording from the HeroUI mdx API tables (`/tmp/heroui/apps/docs/content/docs/en/react/components/(<group>)/<c>.mdx`, section "API Reference") when the prop exists there.

Build the Step 6 playground parity route and the Step 7 harness right after Spinner + Button exist; from then on, after each component add its parity cases and run `bun run parity --component <name>` until it passes before moving to the next component.

**Spinner** — theme `spinner`: slots `{ base }`, variants `size: sm|md|lg|xl` (default `md`), `color: accent|current|danger|success|warning` (default `accent`). Renders `<span data-slot="spinner" role="status" aria-label="Loading">` + SVG copied from `react/src/components/spinner/spinner.tsx`. Props: `size`, `color`, `class`, `ui`.

**Button** — theme `button`: slots `{ base, spinner }`; variants `variant: primary|secondary|tertiary|ghost|outline|danger|danger-soft` (default `primary`), `size: sm|md|lg` (`md`), `fullWidth: boolean`, `iconOnly: boolean`. Props: `as='button'`, `type='button'` (only applied when `as==='button'`), `variant`, `size`, `fullWidth`, `iconOnly`, `disabled`, `pending`, `class`, `ui`. Renders `Primitive` `data-slot="button"`. `disabled` → native `disabled` attr when `as==='button'`, else `aria-disabled="true"` + `tabindex="-1"`. `pending` → `data-pending="true"`, `aria-busy="true"`, `aria-disabled="true"`, element stays focusable, and consumer `@click` must not fire: bind `@click.capture="onClickCapture"` on the root where `onClickCapture(e)` calls `e.preventDefault(); e.stopImmediatePropagation()` when `pending || (disabled && as !== 'button')`. No `click` emit is declared (native listener falls through via attrs). Slots: `leading` ({ pending }), `default` ({ pending }), `trailing` ({ pending }). When `pending` and no `#leading`, render `<Spinner size="sm" color="current" :class="ui.spinner({ class: props.ui?.spinner })" />` in the leading position. ButtonGroup context is not ported (ButtonGroup is outside the core set).

**CloseButton** — theme `closeButton`: slots `{ base, icon }`, variant `variant: default`. `<button type="button" data-slot="close-button" aria-label="Close">`; default slot replaces the close icon SVG (from `icons.tsx`, `data-slot="close-button-icon"`). Props: `variant`, `disabled`, `ariaLabel='Close'`, `class`, `ui`.

**Card** — theme `card`: slots `{ base, header, title, description, content, footer }`, variant `variant: default|secondary|tertiary|transparent` (default `default`). Props: `as='div'`, `variant`, `title?: string`, `description?: string`, `class`, `ui`. Slots: `header` (replaces title+description), `title`, `description`, `default` (content), `footer`. Header `div[data-slot=card-header]` renders iff `#header` || title/`#title` || description/`#description`; title `h3[data-slot=card-title]`, description `p[data-slot=card-description]`; content `div[data-slot=card-content]` iff default slot; footer `div[data-slot=card-footer]` iff `#footer`. Structure mirrors `/tmp/nuxt-ui/src/runtime/components/Card.vue`. HeroUI's `SurfaceContext` is not ported: grep shows no HeroUI component reads it.

**Chip** — theme `chip`: slots `{ base, label }`, variants `color: accent|danger|default|success|warning` (default `default`), `variant: primary|secondary|soft|tertiary` (default `secondary`), `size: sm|md|lg` (add default `md`; `.chip--md` only sets `text-xs`, same as base). Props: `as='span'`, `label?: string`, `color`, `variant`, `size`, `class`, `ui`. Slots: `leading`, `default` (wrapped in `span[data-slot=chip-label]`; renders when `label` or default slot), `trailing`.

**Avatar** — theme `avatar`: slots `{ base, image, fallback }`, variants `color` (applies to `fallback`), `size: sm|md|lg` (`md`), `variant: default|soft`. Uses Reka `AvatarRoot` (base), `AvatarImage` (image, `:src`, `:alt`), `AvatarFallback` (fallback, `data-slot="avatar-fallback"`, `:delay-ms="delayMs"`). Props: `src?`, `alt?`, `fallback?: string`, `delayMs?: number`, `color`, `size`, `variant`, `class`, `ui`. Slot `fallback` (default content = `fallback` prop text).

**Label** — theme `label`: slots `{ base }`, boolean variants `disabled`, `invalid`, `required` (classes from `.label--disabled/--invalid/--required`). Reka `Label` `data-slot="label"`. Props: `for?`, `disabled`, `invalid`, `required`, `class`, `ui`. Default slot.

**Description** — theme `description`: `{ base }`; `<p data-slot="description">`; props `id?`, `class`, `ui`; default slot.

**FieldError** — theme `fieldError`: `{ base }`; `<p data-slot="field-error" role="alert" data-visible="true">`; props `id?`, `class`, `ui`; default slot.

**Input** — theme `input`: `{ base }`, variants `variant: primary|secondary` (`primary`), `fullWidth: boolean`. `<input data-slot="input">` with `v-model` (`defineModel<string | number>()`), props `type='text'`, `id?`, `name?`, `placeholder?`, `variant`, `fullWidth`, `disabled`, `invalid`, `required`, `class`, `ui`. Injects optional `textFieldContextKey` (`{ id, describedBy, invalid, disabled, required, variant, fullWidth }` as refs); explicit props win over context. Sets `aria-invalid`/`data-invalid="true"` when invalid, `aria-describedby` from context, `required`, `disabled`. Remaining attrs fall through to `<input>`.

**TextField** — theme `textField`: `{ base }`, `fullWidth: boolean`. Wrapper `div[data-slot=textfield]` (check exact string in `textfield.tsx`) that provides `textFieldContextKey` (`src/components/textFieldContext.ts`). Props: v-model (`string | number`), `label?`, `description?`, `errorMessage?`, `id?` (default `useId()` from vue), `name?`, `type='text'`, `placeholder?`, `variant`, `fullWidth`, `disabled`, `invalid`, `required`, `class`, `ui`. Renders `Label` (for=id, mirrors disabled/invalid/required) iff label/`#label`; default slot (slot props `{ id, describedBy, invalid, disabled }`) else `<Input v-model>`; `Description` (`id=${id}-description`) iff description/`#description`; `FieldError` (`id=${id}-error`) iff `invalid` && (errorMessage || `#error`). `describedBy` = ids of rendered description/error joined by space.

**Checkbox** — theme `checkbox`: slots `{ base, control, indicator, content }`, variant `variant: primary|secondary`. Structure: `div[data-slot=checkbox].base` (contains `group/checkbox`; mirrors `data-state`, `data-disabled`, `data-invalid`) → Reka `CheckboxRoot` as `control` (`data-slot="checkbox-control"`, `:id`, `name`, `value`, `required`, `disabled`, v-model) → `CheckboxIndicator` as `indicator` (`data-slot="checkbox-indicator"`) with default check SVG (`data-slot="checkbox-default-indicator--checkmark"`) or minus SVG for indeterminate (`…--indeterminate`); then `div[data-slot=checkbox-content].content` iff label/description/slots, containing `Label for=id` and `Description`. Props: `defineModel<boolean | 'indeterminate'>()`, `defaultValue?`, `label?`, `description?`, `variant`, `disabled`, `invalid`, `required`, `name?`, `value?`, `id?` (default `useId()`), `class`, `ui`. Slots: `label`, `description`, `indicator` ({ state: 'checked' | 'unchecked' | 'indeterminate' }).

**Switch** — theme `switch`: slots `{ base, control, thumb, icon, content }`, variant `size: sm|md|lg` (`md`). `div[data-slot=switch].base` (`group/switch`, mirrors `data-state`/`data-disabled`) → Reka `SwitchRoot` as `control` → `SwitchThumb` as `thumb` → `span.icon` iff `#icon` ({ checked }); `content` with Label/Description like Checkbox. Props: `defineModel<boolean>()`, `defaultValue?`, `label?`, `description?`, `size`, `disabled`, `required`, `name?`, `value?`, `id?`, `class`, `ui`. Use the exact HeroUI switch data-slot strings.

**RadioGroup** (HeroUI `RadioGroup` + `Radio` merged; items-array API like Nuxt UI `RadioGroup.vue`) — theme `radioGroup`: slots `{ base, item, control, indicator, content }` (`base` from `radio-group.css`, others from `radio.css` `.radio`, `.radio__control`, `.radio__indicator`, `.radio__content`), variant `variant: primary|secondary`, plus `orientation: vertical|horizontal` (`vertical`; classes from `radio-group.css` orientation rules or `flex-col`/`flex-row` if absent). Reka `RadioGroupRoot` as base (`v-model`, `name`, `disabled`, `required`, `orientation`); per item: `div.item[data-slot=radio]` (`group/radio`, mirrors `data-state`) → `RadioGroupItem` as `control` (`:id="${id}-${index}"`, `:value`, `:disabled`) → `RadioGroupIndicator` as `indicator`; `content` with `Label` + `Description`. Group-level `Label`, `Description`, `FieldError` rendered above/below items like TextField. Props: `items: Array<{ value: string; label?: string; description?: string; disabled?: boolean }>`, `defineModel<string>()`, `defaultValue?`, `label?`, `description?`, `errorMessage?`, `invalid`, `disabled`, `required`, `name?`, `orientation`, `variant`, `id?`, `class`, `ui`. Slots: `label`, `description`, `error`, `item-label` ({ item, index }), `item-description` ({ item, index }), `indicator` ({ item }). No standalone `Radio` export.

**Tabs** (items-array API like Nuxt UI `Tabs.vue`) — theme `tabs`: slots `{ base, tabListContainer, tabList, tab, tabIndicator, tabPanel, separator }`; variants `variant: primary|secondary` (`primary`), `align: start|center|end` (`center`), plus `orientation: horizontal|vertical` (`horizontal`) for the `[data-orientation]` rules. HeroUI's `scrollPrev/scrollNext/scroller` (ScrollShadow-based overflow arrows) are not ported — ScrollShadow is outside the core set. Reka: `TabsRoot` as base (`v-model`, `default-value`, `orientation`, `activation-mode="automatic"`), `div.tabListContainer` → `TabsList` as tabList → per item `TabsTrigger` as tab (`:value`, `:disabled`) containing label + `span.separator[data-slot=tabs-separator]` (rendered for every tab; CSS hides it on selected/next as in `tabs.css`), and `TabsIndicator` as tabIndicator (inside TabsList) with geometry via Reka vars: horizontal `w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)`, vertical `h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)` plus `.tabs__indicator` visuals. Panels: `TabsContent` as tabPanel per item iff `content` prop true. Props: `items: Array<{ label?: string; value?: string | number; disabled?: boolean; slot?: string; content?: string }>`, `defineModel<string | number>()`, `defaultValue?` (default: `items[0].value ?? '0'`), `orientation`, `variant`, `align`, `content: boolean = true`, `class`, `ui`. Item value = `item.value ?? String(index)`. Slots: `tab` ({ item, index, selected }) replaces label, `content` ({ item, index }) for every panel, and dynamic `[item.slot]` ({ item, index }) taking precedence; fallback panel text = `item.content`.

**Modal** — theme `modal`: slots `{ backdrop, container, dialog, header, icon, heading, body, footer, closeTrigger }`; variants `scroll: inside|outside` (`inside`), `size: xs|sm|md|lg|cover|full` (`md`), `variant: opaque|blur|transparent` (`opaque`) — copy `modal.styles.ts` mapping — plus `placement: auto|top|center|bottom` (`auto`, rule 7). Reka: `DialogRoot` (`v-model:open`, `defaultOpen`, `modal: true`), `DialogTrigger as-child` around default slot ({ open }), `DialogPortal` → `DialogOverlay` as backdrop (`data-slot=modal-backdrop`) → `div.container[data-slot=modal-container]` → `DialogContent` as dialog (`data-slot=modal-dialog`; `class` prop merges here). Inside dialog: `#content` ({ close }) replaces everything below; else header `div[data-slot=modal-header]` iff `#header`/`#icon`/title (contains `div.icon` iff `#icon`, `DialogTitle` as heading with `title`/`#title`), body `div[data-slot=modal-body]` iff `#body` ({ close }), footer iff `#footer` ({ close }), and close trigger iff `closeButton` (default `true`): `DialogClose as-child` → `<CloseButton :class="ui.closeTrigger(...)" data-slot="modal-close-trigger" />`, replaceable via `#close` ({ close }). Always render a `DialogTitle` (wrap in Reka `VisuallyHidden` when no title/`#title`) and pass `:aria-describedby="undefined"` to DialogContent to silence Reka warnings. `dismissible` (default `true`): when false, `@pointer-down-outside`, `@interact-outside` and `@escape-key-down` call `e.preventDefault()`. Props: `open` (model), `defaultOpen`, `title?`, `scroll`, `size`, `variant`, `placement`, `dismissible`, `closeButton`, `portal: boolean | string | HTMLElement = true` (→ `DialogPortal :disabled="portal === false" :to="typeof portal === 'boolean' ? 'body' : portal"`), `class`, `ui`. Emits: `update:open`.

**Popover** — theme `popover`: slots `{ base, dialog, heading, arrow }` (arrow classes from `.popover [data-slot=popover-overlay-arrow]` rules). Reka: `PopoverRoot` (`v-model:open`, `defaultOpen`, `modal: false`), `PopoverTrigger as-child` (default slot, { open }), `PopoverPortal` (same `portal` prop handling as Modal), `PopoverContent` as base (`data-slot=popover`, check exact string; `:side`, `:align`, `:side-offset`, `collision-padding: 8`; `class` merges here) → `div.dialog[data-slot=popover-dialog]` containing `h3.heading` iff `title`/`#title` and `#content` ({ close }); `PopoverArrow` as arrow iff `arrow` (SVG from `popover.tsx` via `as-child`, rotation per `data-side`). `dismissible` as in Modal. Props: `open`, `defaultOpen`, `title?`, `side: 'top'|'right'|'bottom'|'left' = 'bottom'`, `align: 'start'|'center'|'end' = 'center'`, `sideOffset = 8`, `arrow = false`, `dismissible = true`, `portal`, `class`, `ui`.

**Tooltip** — theme `tooltip`: slots `{ base, arrow }`. Wrap each instance in its own `TooltipProvider` (no app-level wrapper needed) → `TooltipRoot` (`v-model:open`, `defaultOpen`, `:delay-duration="delay"`, `disabled`) → `TooltipTrigger as-child` (default slot) → `TooltipPortal` → `TooltipContent` as base (`data-slot` from `tooltip.tsx`; `:side`, `:align`, `:side-offset="sideOffset ?? (arrow ? 7 : 3)"`; `class` merges here) containing `#content` or `text` prop, and `TooltipArrow` as arrow iff `arrow`. Props: `text?`, `open`, `defaultOpen`, `delay = 1500` (HeroUI `--tooltip-delay`), `side = 'top'`, `align = 'center'`, `sideOffset?`, `arrow = false`, `disabled`, `portal`, `class`, `ui`. Reka has no close delay; `--tooltip-close-delay` is not ported.

### Step 6 — Playground

`playground/`: Vite + `@vitejs/plugin-vue` + `@tailwindcss/vite`, `vue-router@^5.3.1` (`createWebHistory`). `vite.config.ts`: alias `herouse` → `../packages/herouse/src/index.ts`, `server.port: 5173`, `server.strictPort: true`. `src/main.css`:
```css
@import "tailwindcss";
@import "../../packages/herouse/src/styles/index.css";
```
`src/main.ts`: `createApp(App).use(router).use(createHeroUse({ ui: { button: { slots: { base: 'tracking-wide' } } } })).mount('#app')` (the config override proves Step 3 wiring visibly). `App.vue`: sidebar of links + dark-mode toggle that toggles `.dark` on `<html>`. One page per component at `src/pages/<Name>.vue` showing every variant × size, disabled/pending/invalid states, slot usage, and one `:ui` override; Modal/Popover/Tooltip pages include open/close triggers and a nesting check (Popover inside Modal).

Parity route `/parity/:id` (Step 7): `App.vue` renders only `<RouterView />` (no sidebar/toggle) when `route.path.startsWith('/parity/')`. In `main.ts` install `createHeroUse(location.pathname.startsWith('/parity/') ? {} : { ui: { button: { slots: { base: 'tracking-wide' } } } })` so parity renders the pure theme. `ParityCase.vue` looks up `cases[route.params.id]` in `playground/src/parity/cases.ts` and renders it inside `<div id="case" class="inline-block p-8">`; `?theme=dark` adds `.dark` to `<html>`. Unknown id → `<p id="case-missing">`.

### Step 7 — React reference app and parity diff

Goal: prove herouse renders identically to `@heroui/react@3.2.6` (the version of the `/tmp/heroui` clone).

**`reference/`** (bun workspace member, private): `package.json` deps `react@19.3.0`, `react-dom@19.3.0`, `@heroui/react@3.2.6`, `@heroui/styles@3.2.6`, `tailwindcss@^4.3.3`, `@tailwindcss/vite@^4.3.3`, `vite@^8.3.2`, `@vitejs/plugin-react@^6.1.1`, `typescript`. `vite.config.ts`: react + tailwind plugins, `server.port: 5174`, `strictPort: true`. `src/main.css`: `@import "tailwindcss"; @import "@heroui/styles";` (HeroUI quick-start order). `src/main.tsx`: reads `location.pathname` `/parity/<id>` (no router library), renders `cases[id]` from `reference/src/cases.tsx` inside `<div id="case" className="inline-block p-8">`, `?theme=dark` adds `.dark` to `<html>`, unknown id → `<p id="case-missing">`.

**Case list `parity/cases.json`** — single source of case ids and interactions:
```json
[{ "id": "button-primary-md", "component": "button", "actions": ["hover", "focus", "press"], "ignoreSlots": [] }]
```
- `actions` ⊆ `hover | focus | press | open`; each runs on a fresh page load in addition to the idle state. Target element = first `[data-slot]` inside `#case` unless the case has `"target": "<css selector>"`.
- `ignoreSlots`: data-slot values present in React but intentionally absent in herouse (allowed only for parts this plan explicitly drops, e.g. Tabs scroll buttons). Default empty.
- Both `playground/src/parity/cases.ts` (Vue: `Record<string, () => VNode>` using `h()` or small SFCs) and `reference/src/cases.tsx` (`Record<string, () => JSX.Element>`) must implement exactly the ids in `cases.json`; compare script fails on missing ids (`#case-missing`).
- Minimum cases per component: every value of every variant prop rendered once at default size; every size once at default variant; each boolean/state prop (disabled, pending, invalid, required, iconOnly, fullWidth, checked, indeterminate, selected tab, each modal size/backdrop, popover/tooltip each side with arrow). Each React case uses the HeroUI compound API producing the same content as the Vue case (same text, same icons from `/tmp/heroui/packages/react/src/components/icons.tsx` re-exported by `@heroui/react` if exported, else the same inline SVG in both).
- Overlay cases render `defaultOpen` (Modal/Popover/Tooltip) so no action is needed; their target is `document` (compare all `[data-slot]` in the page, not only `#case`).

**`parity/compare.ts`** (run with bun; root devDeps `puppeteer@^25.12.0`, `pixelmatch@^7.2.0`, `pngjs@^7.0.0`):
1. Requires both dev servers running (`bun run dev`, `bun run reference`); if `fetch('http://localhost:5173')` or `:5174` fails, exit 1 with `start playground (bun run dev) and reference (bun run reference) first`.
2. CLI flags: `--component <name>` filters cases; `--update` not supported (no snapshots; always live compare).
3. For each case × state (`idle` + each action) × theme (`light`, `dark`): open both URLs in viewport 1280×800, `deviceScaleFactor: 1`, wait for `document.fonts.ready` + 300 ms (animations settle; tw-animate durations ≤250 ms). Actions: `hover` → `page.hover(target)`; `focus` → `page.keyboard.press('Tab')` until `document.activeElement` is inside target (max 10); `press` → `page.mouse.move` to target center + `page.mouse.down()` (no up) + 200 ms.
4. Collect `[...root.querySelectorAll('[data-slot]')]` in document order → per element `{ slot, tag, styles }` where `styles` = `getComputedStyle` values of: `display, position, box-sizing, width, height, padding-top/right/bottom/left, margin-top/right/bottom/left, gap, color, background-color, background-image, border-top/right/bottom/left-width, border-top/right/bottom/left-style, border-top/right/bottom/left-color, border-top-left/top-right/bottom-right/bottom-left-radius, box-shadow, outline-width, outline-style, outline-color, outline-offset, opacity, transform, font-family, font-size, font-weight, line-height, letter-spacing, text-align, text-transform, cursor, transition-duration, transition-property` plus pseudo `::before` and `::after` `content, width, height, background-color` (via `getComputedStyle(el, '::before')`). Group by slot name in occurrence order; React elements whose slot is in `ignoreSlots` are dropped.
5. Diff: slot sequence mismatch → failure listing missing/extra slots; any style value differing → failure line `case/state/theme slot[i].prop: react=<v> vue=<v>`. Colors compared after normalizing via a canvas `fillStyle` round-trip in the page (both browsers same engine; exact string match after normalization).
6. Screenshot: `#case` element (overlays: full viewport) for both → pixelmatch `threshold: 0.1`; fail if differing pixels > 0.1 % of area; write `parity/out/<case>-<state>-<theme>-{react,vue,diff}.png` for failures only.
7. Exit code 1 if any failure; print summary `N/M cases passed`.

Fixing failures: change only herouse theme strings / markup (never the reference). If a difference is caused by Reka vs React Aria behavior that cannot be matched (e.g. tooltip position rounding), add the specific prop to a per-case `"ignoreProps": ["transform"]` array in `cases.json` with a `"reason"` string; no other escape hatch.

### Step 8 — Tests (`packages/herouse/test/`)

Vitest + `@vue/test-utils` (`mount`, `attachTo: document.body` for portals). Consumer-visible behavior only:
- `ui.spec.ts`: precedence — Button with app config `slots.base: 'px-1'`, `:ui="{ base: 'px-2' }"`, `class="px-3"` → root has `px-3` and none of `px-1`/`px-2`/HeroUI default `px-4`; without plugin the default theme applies.
- `button.spec.ts`: `pending` renders Spinner, sets `aria-busy`, suppresses `@click`; `disabled` sets native `disabled`; `as="a"` renders `<a>` with `aria-disabled` when disabled.
- `card.spec.ts`: header omitted when no title/description/`#header`; `#footer` renders footer element.
- `checkbox.spec.ts` / `switch.spec.ts`: click toggles `v-model`; `'indeterminate'` renders indeterminate indicator; label click toggles (Label `for` wiring).
- `radio-group.spec.ts`: selecting item updates model; disabled item not selectable.
- `text-field.spec.ts`: `aria-describedby` lists description+error ids only when rendered; `invalid` sets `aria-invalid` and shows `errorMessage`.
- `tabs.spec.ts`: clicking a tab switches visible panel and model; `[item.slot]` slot overrides `#content`.
- `modal.spec.ts`: trigger opens, Escape closes, `dismissible=false` keeps it open on Escape; `v-model:open` sync.

### Step 9 — Documentation site (`docs/`)

**Stack**: VitePress `1.6.4` with a **fully custom theme** (do not extend `vitepress/theme`), replicating heroui.com/docs/react (Next.js + `fumadocs-ui@16.9.3` + HeroUI overrides). `docs/package.json` deps: `vitepress@1.6.4`, `vue`, `herouse` (`workspace:*`), `tailwindcss@^4.3.3`, `@tailwindcss/vite@^4.3.3`, `@fontsource-variable/inter@^5.3.0`, `@iconify/vue@^5.0.3`, `@iconify-json/gravity-ui@^1.2.14`, `shiki@^4.5.0`, `vue-component-meta@^3.3.11`. Scripts: `"api": "bun scripts/gen-api.ts"`, `"dev": "bun run api && vitepress dev"`, `"build": "bun run api && vitepress build && bun scripts/gen-llms.ts"`.
If `@tailwindcss/vite` refuses VitePress 1.6.4's bundled Vite 5 (peer error or plugin crash), switch to `vitepress@2.0.0-alpha.20` (Vite 8) — same config/theme APIs used here.

**Config `docs/.vitepress/config.ts`**: `title: 'HeroUse'`, `description: 'Beautiful, fast and modern Vue UI library — a Vue port of HeroUI v3'`, `cleanUrls: true`, `appearance: true` (toggles `.dark` on `<html>`, matching herouse variables), `markdown.theme: { light: 'github-light', dark: 'github-dark' }` (HeroUI docs shiki themes), `vite.plugins: [tailwindcss()]`, `vite.resolve.alias: { herouse: fileURLToPath(new URL('../../packages/herouse/src/index.ts', import.meta.url)) }`, `themeConfig.sidebar` (custom shape, consumed only by our theme) mirroring HeroUI `meta.json` ordering restricted to existing pages:
- Getting Started: Introduction (`/docs/`), Quick Start, Design Principles, Frameworks; separator "Handbook": Colors, Theming, Dark Mode, Styling, Animation, Composition; separator "UI for Agents": LLMs.txt.
- Components (collapsible groups in this order, HeroUI category names): Navigation (Tabs), Feedback (Spinner), Buttons (Button, CloseButton), Layout (Card), Forms (TextField, Input, Label, RadioGroup, Checkbox, Description, FieldError), Media (Avatar), Data Display (Chip), Overlays (Modal, Popover, Tooltip), Controls (Switch).
URL scheme: `docs/docs/getting-started/<page>.md` → `/docs/getting-started/<page>`, `docs/docs/components/<kebab>.md` → `/docs/components/<kebab>`; `docs/index.md` redirects to `/docs/getting-started` via `<script setup>` `useRouter().go(...)` on mount.

**Theme `docs/.vitepress/theme/`**:
- `index.ts`: `export default { Layout, enhanceApp({ app }) { app.component('ComponentPreview', ComponentPreview); app.component('ApiTable', ApiTable); app.component('Icon', Icon); addCollection(gravityIcons) } }` where `gravityIcons` = `@iconify-json/gravity-ui/icons.json` (offline icons; HeroUI demos use `@gravity-ui/icons`; Vue demos use `<Icon icon="gravity-ui:envelope" />` with the same glyph names in kebab-case).
- `style.css`: `@import "tailwindcss"; @import "./fumadocs/black.css"; @import "./fumadocs/preset.css"; @import "../../../packages/herouse/src/styles/index.css"; @import "./global.css"; @source "../..";` then `@import "@fontsource-variable/inter";` and `--font-inter: "Inter Variable"` in `:root`.
  - `fumadocs/black.css`, `fumadocs/preset.css`: copy from `npm pack fumadocs-ui@16.9.3 --pack-destination /tmp/fd && tar -xzf /tmp/fd/fumadocs-ui-16.9.3.tgz -C /tmp/fd` → `/tmp/fd/package/css/{black,preset}.css`; delete any `@source`/`@import` lines in them that point at fumadocs `dist` (our theme has no fumadocs JS). Add the fumadocs-ui MIT license to `docs/THIRD_PARTY_LICENSES.md`.
  - `global.css`: copy `/tmp/heroui/apps/docs/src/app/global.css` (893 lines) minus its 5 `@import` lines (lines 5–9: tailwindcss, fumadocs black.css, fumadocs preset.css, `@heroui/styles`, theme-presets) — those are replaced above. Theme presets selector is not ported.
- `Layout.vue` + `components/`: port the DOM of the fumadocs **notebook** layout with HeroUI overrides — sources: `/tmp/heroui/apps/docs/src/components/fumadocs/layouts/notebook/{index.tsx,client.tsx,sidebar.tsx,page/index.tsx,page/client.tsx,page/toc-items.tsx}`, `/tmp/heroui/apps/docs/src/components/fumadocs/ui/{search-toggle,theme-toggle,link-item,icons}.tsx`, `/tmp/heroui/apps/docs/src/app/[lang]/docs/layout.tsx`, `/tmp/heroui/apps/docs/src/app/[lang]/docs/[[...slug]]/page.tsx`, and for fumadocs-internal parts the compiled `/tmp/fd/package/dist/**` JSX. Keep **every element id, class string, and data attribute verbatim** (`#nd-docs-layout`, `#nd-nav`, `#nd-subnav`, `#nd-sidebar`, `#nd-page`, `#nd-toc`, `[data-header-body]`, `[data-active]`, `data-state` on collapsibles, etc.) so the copied `global.css` + fumadocs CSS apply unchanged. Translate React → Vue mechanically: `className` → `class`, conditional classes → arrays, `next/link` → VitePress `<a :href>` (VitePress router intercepts), Radix collapsibles → herouse-free plain `<button>` + `v-show` with the same `data-state`.
  - Regions: header (wordmark text "HeroUse" in place of the HeroUI logo SVG — same container classes as HeroUI's logo slot, `font-semibold text-lg`; HeroUI's logo artwork is not reused because it is HeroUI's brand; right side: search toggle, theme toggle, GitHub link to the herouse repo — read the URL from `git remote get-url origin` at implementation time; if no remote, omit the GitHub link), framework sub-nav tabs: render a single "Vue" tab (HeroUI's React/Native tabs → one tab), sidebar from `themeConfig.sidebar` with active link = `useRoute().path`, page column, TOC. The "agent" trigger and theme-preset selector from HeroUI's header are not ported.
  - Page header (from `page.tsx`): `h1` title + description from frontmatter, link badges from frontmatter `links` (`reka`: `https://reka-ui.com/docs/components/<value>`, `source`: herouse GitHub `packages/herouse/src/components/<value>`, `styles`: herouse GitHub `packages/herouse/src/theme/<value>`, `heroui`: `https://heroui.com/docs/react/components/<value>`), styled with HeroUI's `docsButtonVariants` classes (copy from the docs source).
  - TOC: on route change (`watch(() => route.path)` + `nextTick`), query `.vp-doc h2, .vp-doc h3` inside `<Content class="vp-doc prose">`; active item via `IntersectionObserver`. Same markup/classes as `toc-items.tsx`.
  - Search: VitePress local search (`themeConfig.search.provider: 'local'`) opened by the HeroUI-styled search toggle; render `VPLocalSearchBox` imported from `vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue` (`unverified — confirm the path exists in vitepress@1.6.4`; if absent, the toggle is omitted).
- `ComponentPreview.vue` (props `name: string` like `button/basic`, `align?: 'center'|'start'|'end' = 'center'`, `minHeight?: string`): demo component from `import.meta.glob('../../demos/**/*.vue')`, raw source from `import.meta.glob('../../demos/**/*.vue', { query: '?raw', import: 'default', eager: true })`, highlighted with `shiki` `codeToHtml(src, { lang: 'vue', themes: { light: 'github-light', dark: 'github-dark' } })` (lazy, cached per name). Markup/classes copied from `/tmp/heroui/apps/docs/src/components/component-preview*.tsx` (preview card `preview not-prose relative min-h-[350px] … rounded-t-xl border-s border-e border-t border-separator p-4 sm:p-10`, code section `code-section relative rounded-b-xl border border-separator`, collapsed `max-h-[150px]` + `mask-to-bottom` with "Expand code"/"Collapse code" button, copy button labelled "Copy Text"/"Copied Text"). Missing demo name → render `<p class="text-danger">Demo not found: {name}</p>` (visible during authoring).
- `ApiTable.vue` (props `component: string`, `kind: 'props'|'slots'|'emits'`): reads `docs/.vitepress/api/<Component>.json`; columns Prop/Type/Default/Description (slots: Slot/Props/Description; emits: Event/Payload/Description), markup copied from the HeroUI mdx table output (`.prose table` styles from `global.css` apply). Missing file → throw at build (fails `docs:build`, intended).
- `scripts/gen-api.ts`: `createChecker(tsconfigPath)` from `vue-component-meta` on `packages/herouse/tsconfig.json`; for each `packages/herouse/src/components/*.vue` (skip `*Context.ts`), `getComponentMeta` → write `{ props: [{ name, type, default, description, required }], slots: [{ name, type, description }], events: [{ name, type, description }] }` to `docs/.vitepress/api/<Name>.json`. Filter out props without `description` coming from `node_modules` (inherited HTML attrs). Default value source: `prop.default` or the `@defaultValue` JSDoc tag.
- `scripts/gen-llms.ts` (runs after build; output into `docs/.vitepress/dist/`): for each page in sidebar order, read the `.md`, build a header in HeroUI's format (`# <title>`, `**Category**: vue`, `**URL**: <site>/docs/...`, `> <description>`), replace `<ComponentPreview name="x/y" .../>` with a ```` ```vue ```` fence of `docs/demos/x/y.vue`, replace `<ApiTable component="C" kind="k" />` with a GitHub-markdown table from the JSON, strip other Vue tags; wrap as `<page url="...">…</page>`. Write `llms.txt` (title, one-paragraph description, `- [Title](url): description` list grouped Getting Started / Components) and `llms-full.txt` (all pages joined by blank lines). Site URL constant `https://herouse.dev` (`unverified — replace with the real deployment URL when known`).

**Content** (`docs/docs/**`, markdown with frontmatter `title`, `description`, `links`). Port the HeroUI mdx pages section-by-section, rewriting React usage to herouse's Vue API; text may be copied (MIT) with "HeroUI" → "HeroUse" where it refers to this library and kept where it refers to upstream.
- Getting started: `index.md` (Introduction), `quick-start.md` (Requirements: Vue 3.5+, Tailwind 4; install `bun add herouse` with npm/pnpm/yarn/bun code groups; CSS `@import "tailwindcss"; @import "herouse";`; `app.use(createHeroUse())` optional; first Button), `design-principles.md` (HeroUI's 10 principles from `/tmp/heroui/apps/docs/content/docs/en/react/getting-started/(overview)/design-principles.mdx`, adapted: #2 Accessibility → "Reka UI foundation"; #5 Composition → "Slots over compound components" with a `Card.Header` (React) vs `#header` (Vue) side-by-side; #7 Semantic styling → BEM is replaced by tv slots + `:ui`; #9 Framework agnostic → note tokens/CSS vars are HeroUI's own; plus a new "Differences from HeroUI React" table: compound parts → slots, `isX` → `x`, `onPress` → `@click`, `onChange`/`isSelected` → `v-model`, `className` → `class` / `:ui`), `frameworks.md` (Vite + Vue, Nuxt as a plain Vue plugin via `defineNuxtPlugin(app => app.vueApp.use(createHeroUse()))` + CSS in `nuxt.config.ts` `css`).
- Handbook: `colors.md` (token tables from HeroUI colors.mdx, values from `variables.css`), `theming.md` (CSS variables overrides + `createHeroUse({ ui })` slot/variant/defaultVariants overrides with precedence list from "API conventions"), `dark-mode.md` (`.dark` / `data-theme="dark"` on `<html>`), `styling.md` (`class`, `:ui`, tailwind-merge conflict resolution, data-slot/state attribute selectors), `animation.md` (tw-animate-css, `data-[state=open]` / `data-[state=closed]` mapping, `motion-reduce`), `composition.md` (slots, scoped slot props, `as` prop), `llms-txt.md` (URLs of `/llms.txt`, `/llms-full.txt`).
- Component pages (18): sections in HeroUI order — Usage, Anatomy (list of slots + `ui` keys instead of compound parts), Examples, Customization (Tailwind via `class`/`:ui`; global via `createHeroUse`; CSS variables), Styling Reference (`ui` slot keys → `data-slot` values → state data attributes), API Reference (`<ApiTable kind="props|slots|emits">`), Accessibility (where HeroUI has it), Related Components. Examples: port every HeroUI demo listed in `/tmp/heroui/apps/docs/src/demos/en/<c>/` to `docs/demos/<c>/<same-name>.vue` **except** demos for dropped features: `render-function`, `render-props`, `ripple-effect`, `custom-image-component`, tabs `overflow`, input/textfield/radio-group `on-surface` (Surface not ported), switch `group`/`group-horizontal` (SwitchGroup not ported), checkbox `form` / switch `form` / modal `with-form` keep only if they use solely core components (else drop). Each kept demo uses the same texts/icons as its HeroUI source.

### Step 10 — Optional parallel execution via mecca peers

Idle omp sessions in this directory are listed at `mecca://sessions` (read `mecca://guide` first). After Steps 1–4, the Step 6 parity route, the Step 7 harness, and Button/Spinner (incl. parity passing) are done, other work may be farmed out by direct message (`mecca://mailbox/<sessionId>`) in disjoint batches: (A) CloseButton, Card, Chip, Avatar; (B) Label, Description, FieldError, Input, TextField; (C) Checkbox, Switch, RadioGroup; (D) Tabs, Modal, Popover, Tooltip; (E) docs theme/layout + Getting Started/Handbook pages. Component batches own `src/components/<X>.vue`, `src/theme/<x>.ts`, `test/<x>.spec.ts`, `playground/src/pages/<X>.vue`, `docs/demos/<x>/`, `docs/docs/components/<x>.md`. Each message must include this plan's path, the batch, and: "do not edit shared files (`src/index.ts`, `src/theme/index.ts`, playground router, `parity/cases.json`, `playground/src/parity/cases.ts`, `reference/src/cases.tsx`, docs sidebar config); put your parity case entries (JSON + Vue + React snippets) and export lines in your reply". The integrating session alone edits shared files, then runs parity and the final checks.

## Critical files & anchors

- `/tmp/heroui/packages/styles/components/<c>.css` — source of truth for every class string; translate per Step 4.
- `/tmp/heroui/packages/react/src/components/<c>/<c>.tsx` — exact `data-slot` values, ARIA attributes, SVGs.
- `/tmp/reka-ui/packages/core/src/{Checkbox/CheckboxRoot.vue:248,Switch/SwitchRoot.vue:110,Tabs/TabsTrigger.vue:50,Tabs/TabsIndicator.vue:73,Tooltip/TooltipContentImpl.vue:110}` — emitted `data-state` values / indicator CSS vars used in Step 4 mapping.
- `/tmp/heroui/apps/docs/src/app/global.css` + `/tmp/heroui/apps/docs/src/components/fumadocs/layouts/notebook/**` — docs chrome; DOM ids/classes must match so CSS applies verbatim.
- `packages/herouse/src/composables/useComponentUI.ts` — single point where theme + app config merge.

## Verification

Run from repo root after `bun install`:
1. `bun run typecheck` → 0 errors.
2. `bun run test` → all Step 8 specs pass.
3. `bun run build` → `packages/herouse/dist/index.js`, `dist/index.d.ts`, per-module component files under `dist/components/`, `dist/theme/button.js`, `dist/styles/index.css` exist.
4. **Parity (primary proof of identical style)**: terminal 1 `bun run dev`, terminal 2 `bun run reference`, terminal 3 `bun run parity` → prints `N/N cases passed`, exit 0, no files in `parity/out/`. Sanity-check the harness once: temporarily change Button primary to `[--button-bg:var(--danger)]`, rerun `bun run parity --component button` → must fail with a `background-color` diff on `button` and write diff PNGs; revert.
5. Consumer smoke (proves published CSS scanning): in a temp dir `bun create vite herouse-smoke --template vue-ts`, add `"herouse": "file:/Volumes/Workspaces/opensource/herouse/packages/herouse"`, `tailwindcss`, `@tailwindcss/vite`; CSS `@import "tailwindcss"; @import "herouse";`; render `<Button variant="danger">Delete</Button>` and `<Card title="T">body</Card>`. `bun run build` then inspect the built CSS: it must contain the `--button-bg` arbitrary-property rules and `.bg-surface` (proves `@source "../"` scanned `dist/`). Delete the temp dir afterwards.
6. Docs: `bun run docs:build` exits 0 (fails if any `ApiTable` JSON or demo is missing); `docs/.vitepress/dist/llms.txt` lists all 11 getting-started/handbook/agents pages and 18 component pages; `llms-full.txt` contains a ```` ```vue ```` block with the content of `docs/demos/button/basic.vue`. `bun run docs:dev`, open `/docs/components/button` in a browser next to https://heroui.com/docs/react/components/button at 1440×900, light and dark: header height, sidebar width (220 px) and active-item pill, TOC column, page-title/description/link badges, preview card border/radius/padding, code block colors (github-light/dark), API table styling, Inter font must match; screenshot both. Repeat for `/docs/getting-started/quick-start` vs https://heroui.com/docs/react/getting-started/quick-start. Check mobile width 390 px: sidebar becomes a drawer, TOC hidden.
7. Visual playground pass (`bun run dev`): Modal open with fade/zoom-in and closes with fade-out (exit animation visible), Tabs indicator slides between tabs, Tooltip/Popover arrows point at triggers for each side.

## Assumptions

- Web only; a Vue Lynx package is deferred. Research result for later: vue-lynx 0.5.1 is pre-alpha, no DOM (Reka unusable; Vy UI is the Lynx headless option), Tailwind v3 only, no `::before/::after`, no oklch/modern color syntax — only the API contract (props/slots/ui keys) and hex-converted tokens can be shared. Keep the bun workspace (`packages/*`) so `packages/lynx` can be added later; build no shared abstraction now.
- Prop naming is Vue/Nuxt-UI style (`disabled`, `pending`, `v-model`), HeroUI variant names/values unchanged.
- Styles are hand-translated into tv themes (Nuxt UI style), not imported from `@heroui/styles`; identity is enforced by the Step 7 parity diff.
- RadioGroup and Tabs use an `items` array (Nuxt UI style) rather than child components; if child-component composition is wanted later, add `Radio`/`Tab` components without changing these APIs.
- Parity target is `@heroui/react@3.2.6` / the `/tmp/heroui` `v3` clone (also 3.2.6); later upstream style changes are not tracked.
- Docs keep a separate playground (dev scratchpad + parity host); docs demos live in `docs/demos/`.
