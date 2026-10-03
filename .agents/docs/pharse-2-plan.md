# Rename herouse → HareUI (`@hareui/vue`), prefix plugin + auto-import resolver, then `@hareui/scaffold` (Nuxt UI layout + dashboard ports)

## Context

Rename the library from `herouse` / "HeroUse" to **HareUI**, published as **`@hareui/vue`**. Add two ways to use components without importing them by hand, both with a configurable name prefix (default `H`, so `Alert` becomes `<HAlert>` / `<h-alert>`):
1. `HareUI`, a Vue plugin: `app.use(HareUI, { prefix })` registers every component globally. Types come from a `PrefixedComponents<'H'>` augmentation.
2. `HareUIResolver`, a resolver for `unplugin-vue-components` (`@hareui/vue/resolver`). It imports components on demand, so unused ones are tree-shaken.

Named exports stay unprefixed (`import { Alert } from '@hareui/vue'`). Docs demos keep their explicit imports. Only the installation docs gain sections on the plugin and the resolver.

**Phase 2 (after Phase 1 lands):** new package **`@hareui/scaffold`** in `packages/scaffold`. It ports the Nuxt UI v4 **Layout** components (App, Container, Main, Header, Footer, Error, Sidebar) and **Dashboard** components (DashboardGroup, DashboardSidebar, DashboardSidebarToggle, DashboardSidebarCollapse, DashboardPanel, DashboardNavbar, DashboardToolbar, DashboardResizeHandle, DashboardSearchButton). HeroUI has no equivalent for any of these.
- DOM, props, slots, data-slots and behavior follow Nuxt UI. Classes are translated to HareUI tokens.
- Names stay as Nuxt UI has them (`Error` and `App` included).
- Same `prefix` plugin and resolver story as Phase 1.
- Docs go in a new "Scaffold" docs section.
- DashboardSearch and CommandPalette are **not** part of this work.

Repo: `/Volumes/Workspaces/opensource/herouse` (bun workspace). The repo directory itself is **not** renamed, because renaming it would break live sessions.

## Approach

### Step −1: Save this plan to `agents/` (commit `docs(agents): add HareUI rename + scaffold plan`)
- Copy this plan file verbatim to `agents/hareui-rename-scaffold-plan.md`.
- In `agents/README.md`, add a row to the file table: `hareui-rename-scaffold-plan.md` | "Execution plan: herouse → @hareui/vue rename, HareUI prefix plugin + resolver, @hareui/scaffold (Nuxt UI layout + dashboard ports)".
- Commit only those two paths, with explicit pathspecs. This is safe on a dirty tree because it touches no peer files, so it runs before the Step 0 freeze.
- After each later step lands, tick it off by appending `✅ <commit sha>` to that step's heading in `agents/hareui-rename-scaffold-plan.md`. Step 1's codemod and its `rg` gate **skip this file**: it quotes the old names on purpose, and rewriting it would garble the rule table.

### Step 0: Freeze peers and start from a clean tree
Peers (other omp sessions) have uncommitted work in progress: date/time components, toast, and the components page. The rename moves ~1000 files, so it must run on a clean tree.
- Read `mecca://guide`, then `mecca://sessions`. Send every live peer a message: "Rename herouse → @hareui/vue (packages/herouse → packages/vue) starts once the tree is clean. Finish your current unit, send me your file list + commit message, then stop editing until I announce it landed." Then end the turn and stay idle. Mecca wakes the session when a reply arrives; never call `wait` or poll for this.
- Commit each delivery per `agents/README.md` "Git" rules (one session commits; explicit pathspecs; conventional message).
- Proceed only when `git status --short` prints nothing.

### Step 1: Mechanical rename (commit `refactor!: rename herouse to HareUI (@hareui/vue)`)
1. `git mv packages/herouse packages/vue`.
2. Write a throwaway codemod at `/tmp/hareui-rename.ts` (bun). Run it over every file from `git ls-files`, skipping `bun.lock`, `agents/hareui-rename-scaffold-plan.md`, and binaries (skip a file if it contains a NUL byte). Apply these rules **in order**, case-sensitive, as global regex replaces:

| # | Find | Replace | Purpose |
|---|---|---|---|
| 1 | `/tmp/herouse` | placeholder `\u0000TMP\u0000` | keep historical scratch paths |
| 2 | `opensource/herouse` | placeholder `\u0000ROOT\u0000` | keep the real repo dir path |
| 3 | `packages/herouse` | `packages/vue` | paths (alias targets, CSS imports, gen-api, docs links, agent notes) |
| 4 | `createHeroUse` | `createHareUI` | config plugin factory |
| 5 | `HeroUseConfig` | `HareUIConfig` | config type |
| 6 | `heroUseConfigKey` | `hareUIConfigKey` | injection key |
| 7 | `herouse-monorepo` | `hareui-monorepo` | root package name |
| 8 | `herouse-smoke` | `hareui-smoke` | plan.md smoke dir |
| 9 | `herouse\.dev` | `hareui.dev` | llms site URL |
| 10 | `\bherouse: fileURLToPath` | `'@hareui/vue': fileURLToPath` | Vite alias keys (docs config, playground) |
| 11 | `(['"])herouse\1` | `$1@hareui/vue$1` | import specifiers, `"name"`, workspace deps, tsconfig `paths` key, CSS `@import "herouse"` |
| 12 | `\b(npm i\|pnpm add\|yarn add\|bun add) herouse\b` | `$1 @hareui/vue` | install commands in docs |
| 13 | `plugins/herouse\.ts` | `plugins/hareui.ts` | Nuxt docs filename |
| 14 | `(['"])herouse([-.])` | `$1hareui$2` | `Symbol('herouse-…')`, `Symbol('herouse.ColorPicker')`, `useId(…, 'herouse-…')`, `'herouse-dropdown-long-press-description'`, `id="herouse-overview"` |
| 15 | `HeroUse` | `HareUI` | display name / prose |
| 16 | `herouse` | `HareUI` | remaining prose (`herouse's`, `herouse-only`, `[herouse ColorSlider]`, playground `<title>`/wordmark) |
| 17 | placeholders | restore `/tmp/herouse`, `opensource/herouse` | |

   Rule 14 also rewrites `aria-labelledby="herouse-overview"` in `docs/.vitepress/theme/Home.vue`, so the id pair stays consistent.
3. Run `bun install` to regenerate `bun.lock` workspace entries for `@hareui/vue` (consumed via `workspace:*` by `playground/package.json` and `docs/package.json`).
4. Gate: `rg -i 'hero-?use' -g '!**/node_modules/**' -g '!**/dist/**' -g '!docs/.vitepress/cache/**' -g '!agents/hareui-rename-scaffold-plan.md' .` returns only lines containing `/tmp/herouse` or `opensource/herouse`. Any other hit: fix it by hand with `edit`.
5. Spot-check these results by reading them:
   - `packages/vue/package.json` `"name": "@hareui/vue"`
   - `docs/.vitepress/config.ts` alias `'@hareui/vue': fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url))`
   - `playground/tsconfig.json` `paths` `"@hareui/vue": ["../packages/vue/src/index.ts"]`
   - `packages/vue/src/config.ts` exports `HareUIConfig`, `hareUIConfigKey = Symbol('hareui-config')`, `createHareUI`.
6. Run the Step 1 verification (below). Commit with explicit pathspecs. After committing, message peers through mecca: rename landed; restart the dev servers (playground :5173, reference :5174, docs), because the old alias paths are gone; paths are now `packages/vue/...`; import from `'@hareui/vue'`; `createHeroUse` → `createHareUI`.

### Step 2: Single component registry (no behavior change)
- Create `packages/vue/src/allComponents.ts`. **Move** into it every `export { default as X } from './components/X.vue'` line from `src/index.ts`, keeping their order (70 lines today; take whatever exists at execution time).
- In `src/index.ts`, delete those lines and add `export * from './allComponents'` directly after `export { tv } from './utils/tv'`. Every `export type …` line and non-component export (`ToastQueue`, `toast`, `useToast`, `textFieldContextKey`, `kbdKeysMap`, reka-ui color re-exports, etc.) stays where it is.
- Create `packages/vue/src/componentNames.ts`. It must have **no imports**, because the Node-side resolver loads it:
  ```ts
  /** Public component export names. Kept in sync with allComponents.ts by a compile-time check in plugin.ts. */
  export const componentNames = ['Button', 'Spinner', /* …same order as allComponents.ts… */] as const
  export type ComponentName = (typeof componentNames)[number]
  ```
- `docs/scripts/gen-api.ts`: it currently filters public components by reading `join(componentsDir, '../index.ts')`. Change that path to `'../allComponents.ts'`. Without this, no ApiTable data is generated.

### Step 3: `HareUI` global-registration plugin (commit `feat: add HareUI plugin with component prefix`)
Create `packages/vue/src/plugin.ts`:
```ts
import type { App } from 'vue'
import type { ComponentName } from './componentNames'
import type { HareUIConfig } from './config'
import * as components from './allComponents'
import { createHareUI } from './config'

export type HareUIComponents = typeof components

/** `GlobalComponents` shape for a registration prefix: `PrefixedComponents<'H'>` has `HButton`, `HAlert`, … */
export type PrefixedComponents<Prefix extends string = 'H'> = {
  [K in keyof HareUIComponents as `${Prefix}${K & string}`]: HareUIComponents[K]
}

export interface HareUIOptions extends HareUIConfig {
  /** Prepended to every globally registered name: `'H'` registers `<HButton>` / `<h-button>`. `''` registers bare names. @default 'H' */
  prefix?: string
}

// componentNames.ts (used by the Node-side resolver) must list exactly the exports of allComponents.ts.
type OutOfSync = Exclude<keyof HareUIComponents, ComponentName> | Exclude<ComponentName, keyof HareUIComponents>
const namesInSync: [OutOfSync] extends [never] ? true : OutOfSync = true
void namesInSync

/** Registers every HareUI component globally under `prefix` + name. Also provides app config when `ui` is set. */
export const HareUI = {
  install(app: App, options: HareUIOptions = {}): void {
    const { prefix = 'H', ui } = options
    if (ui) app.use(createHareUI({ ui }))
    for (const [name, component] of Object.entries(components)) app.component(`${prefix}${name}`, component)
  },
}
```
- Config is provided **only when `ui` is set**. If the plugin always provided it, an empty config would override an earlier `app.use(createHareUI({ ui }))`.
- Keep `createHareUI` config-only and separate from `HareUI`. Resolver users call `createHareUI({ ui })`; if it imported every component, the resolver's tree-shaking would be lost.
- `src/index.ts`: add after the config exports:
  ```ts
  export { HareUI } from './plugin'
  export type { HareUIComponents, HareUIOptions, PrefixedComponents } from './plugin'
  ```
- Kebab-case tags (`<h-alert>`) need no extra registration. Vue's `resolveComponent` camelizes and capitalizes the tag (`h-alert` → `HAlert`).
- Composables (`toast`, `useToast`) are not auto-imported. That's out of scope; keep explicit imports.

### Step 4: `HareUIResolver` (commit `feat: add HareUIResolver for unplugin-vue-components`)
Create `packages/vue/src/resolver.ts`. It imports only `./componentNames` and has no `.vue` or `vue` import, so it runs in Node inside `vite.config.ts`:
```ts
import { componentNames } from './componentNames'

export interface HareUIResolverOptions {
  /** Must match the tag prefix used in templates. @default 'H' */
  prefix?: string
}

/** Structurally a `ComponentResolver` from `unplugin-vue-components` (no dependency on it). */
export interface HareUIComponentResolver {
  type: 'component'
  resolve: (name: string) => { name: string, from: string } | undefined
}

/** Resolves `<prefix><Name>` to `{ name: Name, from }` when `Name` is in `names`. Shared with `@hareui/scaffold/resolver`. */
export function createPrefixResolver(names: readonly string[], from: string, prefix: string): HareUIComponentResolver {
  const known = new Set<string>(names)
  return {
    type: 'component',
    resolve(name) {
      if (!name.startsWith(prefix)) return undefined
      const base = name.slice(prefix.length)
      return known.has(base) ? { name: base, from } : undefined
    },
  }
}

export function HareUIResolver(options: HareUIResolverOptions = {}): HareUIComponentResolver {
  return createPrefixResolver(componentNames, '@hareui/vue', options.prefix ?? 'H')
}
```
- The name check matters. Without it, any `H…` component in the user's app (for example docs' own `HomeNav`) would resolve to HareUI.
- `packages/vue/vite.config.ts`: replace `lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' }` with `lib: { entry: { index: 'src/index.ts', resolver: 'src/resolver.ts' }, formats: ['es'] }`. Keep `preserveModules`, `entryFileNames: '[name].js'` and `external` unchanged. The output is then `dist/index.js`, `dist/resolver.js` and `dist/componentNames.js`. `vue-tsc -p tsconfig.build.json` already emits `.d.ts` for all of `src`.
- `packages/vue/package.json` `exports`: add after `"."`:
  ```json
  "./resolver": { "types": "./dist/resolver.d.ts", "import": "./dist/resolver.js" },
  ```
  Do **not** add `unplugin-vue-components` as a dependency or peer; the resolver type is structural.

### Step 5: Tests (with Steps 3 and 4)
- `packages/vue/test/plugin.spec.ts` (vitest + `@vue/test-utils`, same style as `test/ui.spec.ts`):
  - **Default prefix:** `createApp({}).use(HareUI)`. Then `app.component('HButton')` is `Button` and `app.component('HAlert')` is `Alert`. For every name `n` in `componentNames`, `app.component('H' + n)` is `components[n]`. `app.component('Button')` is `undefined`.
  - **Custom prefix:** `{ prefix: 'Ui' }` registers `UiButton`; `HButton` is `undefined`.
  - **Empty prefix:** `{ prefix: '' }` registers `Button`.
  - **Kebab tag:** mount a component whose render function calls `h(resolveComponent('h-button'), null, () => 'Go')` with `global: { plugins: [HareUI] }`. Expect `wrapper.find('[data-slot="button"]').text()` to be `'Go'`.
  - **`ui` option:** `mount(Button, { global: { plugins: [[HareUI, { ui: { button: { slots: { base: 'px-1' } } } }]] } })` has class `px-1` and not `px-4`.
  - **No `ui` keeps earlier config:** `plugins: [createHareUI({ ui: { button: { slots: { base: 'px-1' } } } }), HareUI]` still renders `px-1`.
- `packages/vue/test/resolver.spec.ts`:
  - `HareUIResolver().resolve('HButton')` → `{ name: 'Button', from: '@hareui/vue' }`
  - `resolve('HomeNav')` → `undefined`
  - `resolve('Button')` → `undefined`
  - With `{ prefix: 'Ui' }`: `resolve('UiDatePicker')` → `{ name: 'DatePicker', from: '@hareui/vue' }` and `resolve('HButton')` → `undefined`
  - With `{ prefix: '' }`: `resolve('Alert')` → `{ name: 'Alert', from: '@hareui/vue' }`

### Step 6: Docs and agent notes (commit `docs: document HareUI plugin, prefix and auto import`)
- `docs/docs/getting-started/quick-start.md`: replace the section `## Register Plugin (Optional)` with these three sections, in this order. Keep `## Use Components` (explicit import) after them, unchanged.
  1. `## Register Components Globally (Optional)`
     - Code: `main.ts` with `createApp(App).use(HareUI).mount('#app')`, then a template using `<HButton>My Button</HButton>` with no import.
     - Sentence: `prefix` defaults to `H`. Use `app.use(HareUI, { prefix: 'Hare' })` for `<HareButton>`, or `''` for bare names. `ui` is accepted too (same as `createHareUI`).
     - TypeScript snippet `src/hareui.d.ts`:
       ```ts
       import type { PrefixedComponents } from '@hareui/vue'
       declare module 'vue' {
         interface GlobalComponents extends PrefixedComponents<'H'> {}
       }
       export {}
       ```
     - One-line note: this registers every component, so the bundle includes all of them; use auto import for tree-shaking.
  2. `## Auto Import (Optional)`
     - Install command code-group (npm/pnpm/yarn/bun) for `-D unplugin-vue-components`.
     - `vite.config.ts` snippet:
       ```ts
       import Components from 'unplugin-vue-components/vite'
       import { HareUIResolver } from '@hareui/vue/resolver'
       export default defineConfig({ plugins: [vue(), tailwindcss(), Components({ dts: true, resolvers: [HareUIResolver()] })] })
       ```
     - Note: `HareUIResolver({ prefix })` must match the tags you write. `dts: true` generates `components.d.ts` for editor types.
  3. `## Theme Overrides (Optional)`: the previous `createHareUI()` `main.ts` snippet and sentence ("install only if you want to override themes globally"), linking `/docs/getting-started/theming`.
- `docs/docs/getting-started/frameworks.md`: after the Vite step 5 code block, add a `::: tip` block: "Prefer `<HButton>` without imports? See [global registration](/docs/getting-started/quick-start#register-components-globally-optional) or [auto import](/docs/getting-started/quick-start#auto-import-optional)." The anchors are VitePress slugs of the new headings; confirm them against the built page.
- `frameworks.md`, Nuxt section: in its `plugins/hareui.ts` snippet, use `nuxtApp.vueApp.use(HareUI, { prefix: 'H' })` (it was `createHareUI()`), and add one sentence: "On Nuxt, use the `HareUI` plugin for prefixed components; `HareUIResolver` is for Vite apps, because Nuxt has its own component auto-import." The resolver is not documented for Nuxt.
- `agents/decisions.md`: add a top section `## 2026-10-02 (evening)` with these bullets: renamed to HareUI, package `@hareui/vue`, directory `packages/vue`, `createHareUI`/`HareUIConfig`/`hareUIConfigKey`; `HareUI` plugin (global registration, default prefix `H`, configurable, `''` allowed); `HareUIResolver` at `@hareui/vue/resolver` for unplugin-vue-components; named exports stay unprefixed; docs demos keep explicit imports.
- `agents/decisions.md`, Platform section: change "Plain Vue library only: no Nuxt module, no Vite plugin." to "Plain Vue library: no Nuxt module, no Vite plugin. Prefixed global registration is the `HareUI` Vue plugin; auto import is an unplugin-vue-components resolver (`@hareui/vue/resolver`)."
- `agents/batch-brief.md` step 3: replace the `src/index.ts` bullet's value-export instruction. Component value export goes to `packages/vue/src/allComponents.ts` (`export { default as <Name> } from './components/<Name>.vue'`), plus `'<Name>'` appended to `componentNames` in `packages/vue/src/componentNames.ts` (typecheck fails if they differ). Type exports stay in `packages/vue/src/index.ts`. Apply the same wording fix to `agents/next.md` line 10.

### Phase 2: `@hareui/scaffold`
Start only after Steps 1–6 are committed. Every path below uses the post-rename layout (`packages/vue`).

Reference sources (re-clone if `/tmp` was wiped: `git clone --depth 1 https://github.com/nuxt/ui /tmp/nuxt-ui`):
- Components: `/tmp/nuxt-ui/src/runtime/components/<Name>.vue`
- Themes: `/tmp/nuxt-ui/src/theme/<kebab>.ts`
- Docs: `/tmp/nuxt-ui/docs/content/docs/2.components/<kebab>.md`
- Resize logic: `/tmp/nuxt-ui/src/runtime/composables/useResizable.ts`
- Dashboard context: `/tmp/nuxt-ui/src/runtime/utils/dashboard.ts`

### Step 7: Theme registry other packages can extend (commit `feat(vue): extensible theme registry for createHareUI`)
In `packages/vue/src/config.ts`, change the config type so other packages can add `ui` keys through module augmentation:
```ts
/** Themes accepted by `createHareUI({ ui })`. Sibling packages (`@hareui/scaffold`) add theirs via `declare module '@hareui/vue' { interface HareUIThemes … }`. */
export interface HareUIThemes extends Themes {}

export interface HareUIConfig {
  /** Per-component theme overrides merged on top of the default themes. */
  ui?: { [K in keyof HareUIThemes]?: ThemeOverride<HareUIThemes[K]> }
}
```
- `src/index.ts`: change `export type { HareUIConfig } from './config'` to `export type { HareUIConfig, HareUIThemes } from './config'`.
- `useComponentUI` keeps `name: keyof Themes`. Do not export `useComponentUI`.
- Augmenting a re-exported interface works: it is the same mechanism as `declare module 'vue' { interface GlobalComponents }`, and `vue` re-exports that interface from `@vue/runtime-core`.

### Step 8: Package skeleton, registry, plugin and resolver (commit `feat(scaffold): package skeleton, HareUIScaffold plugin and resolver`)
Create `packages/scaffold/` by copying the `packages/vue` conventions:
- **`package.json`:**
  ```json
  {
    "name": "@hareui/scaffold",
    "version": "0.1.0",
    "type": "module",
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "style": "./dist/styles/index.css",
    "exports": {
      ".": { "types": "./dist/index.d.ts", "style": "./dist/styles/index.css", "import": "./dist/index.js" },
      "./resolver": { "types": "./dist/resolver.d.ts", "import": "./dist/resolver.js" },
      "./style.css": "./dist/styles/index.css"
    },
    "files": ["dist", "THIRD_PARTY_LICENSES.md"],
    "sideEffects": ["**/*.css"],
    "scripts": {
      "build": "vite build && vue-tsc -p tsconfig.build.json && cp -R src/styles dist/styles",
      "test": "vitest run",
      "typecheck": "vue-tsc --noEmit -p tsconfig.json"
    },
    "dependencies": { "@vueuse/core": "^14.1.0", "reka-ui": "^2.10.5" },
    "peerDependencies": { "@hareui/vue": "^0.1.0", "tailwindcss": "^4.3.0", "vue": "^3.5.0" },
    "devDependencies": { "@hareui/vue": "workspace:*", "vue-router": "^5.3.1", "…": "every devDependency of packages/vue/package.json, same versions" }
  }
  ```
  `@hareui/vue` **must** be a peer dependency. Scaffold injects `hareUIConfigKey`, and that symbol only matches when the app has a single `@hareui/vue` instance. `@vueuse/core ^14.1.0` is the version reka-ui already pulls in (`reka-ui@2.10.5` dependencies).
- **`THIRD_PARTY_LICENSES.md`:**
  - Nuxt UI MIT notice, copied verbatim from `/tmp/nuxt-ui/LICENSE.md` ("Copyright (c) 2023 Nuxt").
  - Gravity UI icons MIT notice for the inline SVG paths.
  - One intro line: "Component structure, behavior and themes are ported from Nuxt UI v4 (https://github.com/nuxt/ui)."
- **`tsconfig.json`:** like `packages/vue/tsconfig.json`, plus `compilerOptions.paths`:
  `{ "@hareui/vue": ["../vue/src/index.ts"], "@hareui/vue/resolver": ["../vue/src/resolver.ts"] }`
- **`tsconfig.build.json`:** copy `packages/vue/tsconfig.build.json` and add `"paths": {}`. The build must resolve `@hareui/vue` through the workspace link to `packages/vue/dist/*.d.ts` (otherwise you get rootDir errors). This means `packages/vue` builds first.
- **`vitest.config.ts`:** copy the vue config and add `resolve.alias` as an **array with exact regexes**:
  - `{ find: /^@hareui\/vue\/resolver$/, replacement: fileURLToPath(new URL('../vue/src/resolver.ts', import.meta.url)) }`
  - `{ find: /^@hareui\/vue$/, replacement: fileURLToPath(new URL('../vue/src/index.ts', import.meta.url)) }`
- **`vite.config.ts`:** copy `packages/vue/vite.config.ts` as it stands after Step 4. Then:
  - `lib.entry` = `{ index: 'src/index.ts', resolver: 'src/resolver.ts' }`
  - `external` = `/^(vue|reka-ui|tailwind-variants|tailwind-merge|@vueuse\/core|@hareui\/vue)(\/|$)/`
- **`src/styles/index.css`:**
  ```css
  /* @hareui/scaffold styles — import after `@import "@hareui/vue";` */
  @layer base {
    :root {
      --ui-header-height: 4rem;
      --ui-container: 80rem;
    }
  }

  /* Scan component sources/build output for classes */
  @source "../";
  ```
- **`src/composables/useScaffoldUI.ts`:** a copy of `packages/vue/src/composables/useComponentUI.ts` with these differences:
  - imports `hareUIConfigKey`, `tv` and the types `ComponentUI` / `ThemeShape` from `'@hareui/vue'`
  - `name: keyof ScaffoldThemes`
  - reads `config.ui?.[name]`
- **`src/theme/index.ts`:** one `export { default as <camelName> } from './<camelName>'` per themed component, using these keys:
  `container`, `main`, `header`, `footer`, `error`, `sidebar`, `dashboardGroup`, `dashboardSidebar`, `dashboardSidebarToggle`, `dashboardSidebarCollapse`, `dashboardPanel`, `dashboardNavbar`, `dashboardToolbar`, `dashboardResizeHandle`, `dashboardSearchButton`.
  - `App` has no theme.
  - Add `export type ScaffoldThemes = typeof import('./index')`. No key collides with a `@hareui/vue` theme key; this was checked against `packages/vue/src/theme/index.ts`.
  - Every theme follows `ThemeShape`, so `slots` is required. Single-class Nuxt themes (`{ base: '…' }`) become `{ slots: { base: '…' } }`.
- **`src/allComponents.ts`, `src/componentNames.ts`, `src/plugin.ts`:** same pattern as Steps 2–3. Names:
  - plugin export `HareUIScaffold` with `install(app, { prefix = 'H' }: HareUIScaffoldOptions = {})`, which registers `${prefix}${name}`. There is no `ui` option; theming goes through `createHareUI`.
  - types `ScaffoldComponents`, `PrefixedScaffoldComponents<Prefix extends string = 'H'>`
  - the same `namesInSync` compile-time check
- **`src/resolver.ts`:**
  ```ts
  import { createPrefixResolver, type HareUIComponentResolver } from '@hareui/vue/resolver'
  import { componentNames } from './componentNames'
  export function HareUIScaffoldResolver(options: { prefix?: string } = {}): HareUIComponentResolver {
    return createPrefixResolver(componentNames, '@hareui/scaffold', options.prefix ?? 'H')
  }
  ```
- **`src/index.ts`:**
  ```ts
  import type { ScaffoldThemes } from './theme'
  export * as scaffoldThemes from './theme'
  export type { ScaffoldThemes } from './theme'
  export { HareUIScaffold } from './plugin'
  export type { HareUIScaffoldOptions, PrefixedScaffoldComponents, ScaffoldComponents } from './plugin'
  export * from './allComponents'
  // + `export type { <Name>Props, <Name>Slots, <Name>Emits }` per component as each is added
  declare module '@hareui/vue' {
    interface HareUIThemes extends ScaffoldThemes {}
  }
  ```
  The resolver is **not** exported from `index.ts`, so it stays Node-only.
- **Shared internals** (not exported from `index.ts`):
  - `src/utils/icons.ts`: functional components `MenuIcon`, `CloseIcon`, `SearchIcon`, `ChevronsLeftIcon`, `ChevronsRightIcon`.
    - Each renders `h('svg', { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': 'true' }, [h('path', …)])`, the way `packages/vue/src/components/Link.vue` draws its icon.
    - Path attributes are copied verbatim from `node_modules/.bun/@iconify-json+gravity-ui@1.2.14/node_modules/@iconify-json/gravity-ui/icons.json` entries `bars`, `xmark`, `magnifier`, `chevrons-left`, `chevrons-right`.
    - Gravity UI is HeroUI's icon set. Nuxt's `i-lucide-*` icons are not used.
  - `src/utils/router.ts`: lets scaffold use vue-router when the app has it, without depending on it:
    ```ts
    import type { Component } from 'vue'
    import { getCurrentInstance } from 'vue'
    /** vue-router integration without a dependency: reads what `app.use(router)` installed, if anything. */
    export function useRouterBridge() {
      const vm = getCurrentInstance()
      const globals = vm?.appContext.config.globalProperties as Record<string, any> | undefined
      return {
        /** `RouterLink` when vue-router is installed, else `null` (render `<a href>`). */
        linkComponent: (vm?.appContext.components.RouterLink ?? null) as Component | null,
        /** Reactive inside watchers: vue-router's `$route` getter reads `currentRoute.value`. */
        fullPath: (): string | undefined => globals?.$route?.fullPath,
        push: (to: string): void => { globals?.$router ? globals.$router.push(to) : window.location.assign(to) },
      }
    }
    ```
- **Workspace wiring:**
  - `docs/package.json` and `playground/package.json` dependencies: add `"@hareui/scaffold": "workspace:*"`.
  - `docs/.vitepress/config.ts` alias: add `'@hareui/scaffold': fileURLToPath(new URL('../../packages/scaffold/src/index.ts', import.meta.url))`.
  - `playground/vite.config.ts` alias: add the same.
  - `playground/tsconfig.json` `paths`: add `"@hareui/scaffold": ["../packages/scaffold/src/index.ts"]`.
  - `playground/src/main.css`: after the `packages/vue` styles import, add `@import "../../packages/scaffold/src/styles/index.css";`.
  - `docs/.vitepress/theme/style.css`: after the `packages/vue` styles import (line 4), add `@import "../../../packages/scaffold/src/styles/index.css";`. After the theme `@source` line, add `@source "../../../packages/scaffold/src/theme";`.
  - Root `package.json` scripts:
    - `build`: `bun run --cwd packages/vue build && bun run --cwd packages/scaffold build`
    - `test`: `bun run --cwd packages/vue test && bun run --cwd packages/scaffold test`
    - `typecheck`: `bun run --cwd packages/vue typecheck && bun run --cwd packages/scaffold typecheck`
  - Run `bun install`.
- **`docs/scripts/gen-api.ts`:** wrap the generation loop in `for (const pkg of ['packages/vue', 'packages/scaffold'])`.
  - Per package: `componentsDir = join(root, pkg, 'src/components')`, a checker created from `join(root, pkg, 'tsconfig.json')`, and the registry `join(root, pkg, 'src/allComponents.ts')`.
  - Keep the single `rm`/`mkdir` of `outDir` before the loop.
- **Commit gate:** the skeleton must typecheck with an empty registry. Add the first component (Container, Step 9) in the same commit, so `componentNames` is never `[]` (an empty tuple breaks the `ComponentName` type).

### Step 9: Port the components (one commit per bullet group: `feat(scaffold): layout components`, `feat(scaffold): dashboard components`)
**Universal rules for every component:**
- Port props, defaults, models, slots (with slot props), data-slot attributes, DOM structure and behavior from the Nuxt UI source, in Nuxt's order.
- Follow the HareUI component pattern from `packages/vue/src/components/Card.vue`:
  - `withDefaults(defineProps<XProps>())`, with `as` typed as `PrimitiveProps['as']`
  - `const ui = useScaffoldUI('<key>', theme, () => ({ …variant props }))`
  - root class `ui.<slot>({ class: [props.ui?.<slot>, props.class] })`, other slots `ui.<slot>({ class: props.ui?.<slot> })`
  - JSDoc on every prop, with `@defaultValue`
  - `Props` / `Slots` / `Emits` interfaces exported from the SFC and re-exported as types from `src/index.ts`
- **Drop** `useComponentProps`, `useAppConfig`, `#imports`, `useLocale` and `appConfig.ui.icons`.
- **Strings:** use the English strings from `/tmp/nuxt-ui/src/runtime/locale/en.ts` as literals. Callers override them with `aria-label` attributes, which fall through to the root.
- **Icons:** `icon` props become `icon?: Component`, rendered as `<component :is="icon" … />`. Fixed icons come from `src/utils/icons.ts`.
- **Nuxt `UButton` →** HareUI `Button`, mapped as:
  - `color` → no equivalent; drop it
  - `variant: 'ghost'` → `'ghost'`, `'outline'` → `'outline'`, `'solid'` → `'primary'`
  - `square` → `iconOnly`
  - `label` → default slot text
  - icon-only buttons default to `size="sm"`
  - Nuxt `ButtonProps` objects (`toggle`, `clear`) are typed `boolean | Partial<ButtonProps>` and spread with `v-bind`
  - never override `data-slot` on a HareUI component instance; only elements scaffold owns get `data-slot`
- **Mobile menu `mode`** (Header, Sidebar, DashboardSidebar):
  - `'modal'` → HareUI `Modal` with `size="full"`
  - `'slideover'` → HareUI `Drawer` with `placement` = Header `'right'`, Sidebar/DashboardSidebar `props.side`
  - `'drawer'` → HareUI `Drawer` with `placement="bottom"`
  - `menu?: Partial<ModalProps> | Partial<DrawerProps>`, applied as `v-bind="menu"` after the defaults. Non-generic: drop Nuxt's mode-generic typing.
  - Menu content goes through the overlay's own slots: `title` prop = component `title` (or `'Menu'`), `#body` = the component's menu body, `#footer` = footer slot. The user's `content` slot is forwarded to the overlay `#content`.
  - Do not re-apply scaffold header/body classes inside overlays; drop Nuxt's `menu: true` variant. The overlay keeps HareUI's own header, close button and padding.
- **Route auto-close:** `autoClose` (default `true`) → `watch(() => router.fullPath(), () => { open.value = false })`, where `router = useRouterBridge()`.
- **Token translation**, applied to every theme class string copied from Nuxt (keep all other utilities verbatim):

| Nuxt UI | HareUI |
|---|---|
| `bg-default` (incl. `/75`) | `bg-background` (same opacity) |
| `text-highlighted` | `text-foreground` |
| `text-muted`, `text-dimmed`, `text-toned` | `text-muted` |
| `text-primary` | `text-accent` |
| `border-default`, `divide-default`, `ring-default` | `border-separator`, `divide-separator`, `ring-separator` |
| `bg-(--ui-border-accented)` | `bg-border` |
| `rounded-lg ring ring-default shadow-lg` (sidebar floating `inner`) | `rounded-2xl bg-surface shadow-surface` |
| `'options.theme.transitions && …'` conditional entries | include unconditionally |

**Per-component deltas** (everything else follows the Nuxt source):
1. **Container**: theme `{ slots: { base: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8' } }`.
2. **Main**: theme `{ slots: { base: 'min-h-[calc(100vh-var(--ui-header-height))]' } }`, `as` default `'main'`.
3. **Footer**: Nuxt theme slots `root/top/bottom/container/left/center/right` verbatim, wraps `Container`.
4. **App**:
   - Root is reka-ui `ConfigProvider` with props `dir?: 'ltr' | 'rtl'`, `locale?: string` and `scrollBody?: ConfigProviderProps['scrollBody']`.
   - Renders the default slot, then `<ToastProvider v-if="toaster !== null" v-bind="toaster" />`. `toaster?: Partial<ToastProviderProps> | null`, default `() => ({})`, `ToastProvider` from `@hareui/vue`.
   - Drop Nuxt's `tooltip` prop (HareUI `Tooltip` owns its `TooltipProvider`) and `portal` prop (HareUI overlays take `portal` per component).
   - No theme.
5. **Error**:
   - `error?: { statusCode?: number, status?: number, statusMessage?: string, statusText?: string, message?: string }`, `redirect = '/'`, `clear: boolean | Partial<ButtonProps> = true`, `icon?: Component`.
   - Clear button: HareUI `Button` with `size="lg"` and text `Back to home`.
   - On click it runs `emit('clear')`, then `router.push(props.redirect)`; emits `clear: []`. This replaces Nuxt `clearError`.
6. **Header**:
   - `title` default `'HareUI'` (Nuxt defaults to its own brand) and `to` default `'/'`.
   - The title link renders `<component :is="linkComponent ?? 'a'" v-bind="linkComponent ? { to } : { href: to }">`, both from `useRouterBridge`.
   - Toggle is HareUI `Button variant="ghost" size="sm" iconOnly` with `MenuIcon` / `CloseIcon` and aria-label `Open menu` / `Close menu`.
   - Default `mode = 'modal'`.
7. **Sidebar**:
   - Nuxt `close: boolean | ButtonProps` + `closeIcon` become `close?: boolean`, rendered as HareUI `CloseButton` with aria-label `Close`, plus a `#close` slot. Drop `closeIcon`.
   - Rail aria-label is `Toggle`.
   - `useMediaQuery('(max-width: 1023px)')` from `@vueuse/core`.
   - Desktop/mobile `open` sync is ported 1:1.
8. **useResizable** (`src/composables/useResizable.ts`): port 1:1 with these changes:
   - **Storage:** `'local'` → `useStorage(key, defaults, localStorage, { mergeDefaults: true, ...storageOptions })`. `'cookie'` → `useStorage(key, defaults, cookieStorage(storageOptions), { mergeDefaults: true })`.
   - **`cookieStorage(opts: { path?: string, maxAge?: number, domain?: string, sameSite?: 'lax' | 'strict' | 'none', secure?: boolean } = {})`:** a `StorageLike` over `document.cookie`.
     - `getItem` parses `name=value` pairs and returns `decodeURIComponent(value)` or `null`.
     - `setItem` writes `${key}=${encodeURIComponent(v)}; path=${path ?? '/'}; max-age=${maxAge ?? 31536000}; samesite=${sameSite ?? 'lax'}`, plus `; domain=…` / `; secure` when set.
     - `removeItem` writes `max-age=0`.
   - **RTL:** read at drag start as `getComputedStyle(el.value).direction === 'rtl'`. This replaces `useLocale().dir`.
9. **Dashboard context** (`src/components/dashboardContext.ts`):
   ```ts
   export interface DashboardContext {
     storage?: 'local' | 'cookie'; storageKey?: string; storageOptions?: Record<string, any>; persistent?: boolean; unit?: '%' | 'rem' | 'px'
     sidebarOpen?: Ref<boolean>; sidebarCollapsed?: Ref<boolean>
     toggleSidebar?: () => void; collapseSidebar?: (collapsed: boolean) => void; toggleSearch?: () => void
   }
   export const dashboardContextKey: InjectionKey<DashboardContext> = Symbol('hareui-dashboard')
   ```
   Consumers call `inject(dashboardContextKey, {})`, so every dashboard piece also works outside a group, as Nuxt's `useDashboard({})` does. This replaces Nuxt runtime hooks.
10. **DashboardGroup**:
    - Props as in Nuxt, except `storage?: 'local' | 'cookie'`, default **`'local'`** (plain Vue has no SSR cookie reader).
    - New `searchOpen = defineModel<boolean>('searchOpen', { default: false })`.
    - Owns `sidebarOpen = ref(false)` and `sidebarCollapsed = ref(false)`, and provides:
      - `toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }`
      - `collapseSidebar = v => { sidebarCollapsed.value = v }`
      - `toggleSearch = () => { searchOpen.value = !searchOpen.value }`
      - the storage props
    - Theme `{ slots: { base: 'fixed inset-0 flex overflow-hidden' } }`.
11. **DashboardSidebar**:
    - Models `open` / `collapsed` sync with context in both directions:
      - `watch(open, v => { if (ctx.sidebarOpen) ctx.sidebarOpen.value = v }, { immediate: true })`
      - `watch(() => ctx.sidebarOpen?.value, v => { if (v !== undefined) open.value = v })`
      - `collapsed` / `isCollapsed` from `useResizable` sync the same way with `ctx.sidebarCollapsed`. External changes call `collapse(v)`, so the previous size is saved and restored.
    - Storage key `${storageKey}-${id}`, as in Nuxt.
    - Default `mode = 'slideover'`.
12. **DashboardPanel**, **DashboardToolbar**, **DashboardResizeHandle**: Nuxt themes translated.
13. **DashboardNavbar**:
    - `icon?: Component`.
    - Slot props are `{ sidebarOpen, sidebarCollapsed, toggleSidebar, collapseSidebar, toggleSearch }`, unwrapped as booleans for the refs.
14. **DashboardSidebarToggle**:
    - HareUI `Button`, `variant = 'ghost'`, `size = 'sm'`, `iconOnly`. Drop `color`.
    - `MenuIcon` when closed, `CloseIcon` when open. Aria-label `Open sidebar` / `Close sidebar`.
    - Click calls `ctx.toggleSidebar?.()`.
15. **DashboardSidebarCollapse**:
    - Same button setup as DashboardSidebarToggle.
    - Icon when expanded: `ChevronsLeftIcon` (side `left`) or `ChevronsRightIcon` (side `right`). Collapsed state uses the opposite icon.
    - Aria-label `Collapse sidebar` / `Expand sidebar`. Click calls `ctx.collapseSidebar?.(!ctx.sidebarCollapsed?.value)`.
16. **DashboardSearchButton**:
    - Props:
      - `icon?: Component | false`, default `SearchIcon`
      - `label = 'Search…'`
      - `variant` default `collapsed ? 'ghost' : 'outline'`
      - `size = 'sm'`
      - `collapsed = false`
      - `tooltip: boolean | Partial<TooltipProps> = false`
      - `kbds: string[] = ['command', 'k']`
    - Kbds render as **one** HareUI `Kbd`. Entries that are keys of `kbdKeysMap` (from `@hareui/vue`) go to `keys`; the rest are upper-cased and joined as slot text, so the default renders `⌘K`.
    - When `collapsed`: `iconOnly`, `aria-label = label`. If `tooltip`, the button is wrapped in `<Tooltip :text="label" v-bind="tooltipProps">`.
    - Click calls `ctx.toggleSearch?.()`. Nuxt's `DashboardSearch` is not ported, so this toggles `DashboardGroup`'s `v-model:search-open`, which apps bind to their own `Modal`.
    - Theme slots `base/label/trailing`, with the `collapsed` variant as in Nuxt.

**Tests**, in `packages/scaffold/test/*.spec.ts`, with the vitest + `@vue/test-utils` style of `packages/vue/test/ui.spec.ts`:
- **`plugin.spec.ts` / `resolver.spec.ts`:** the same cases as Step 5, with these expectations:
  - `HDashboardPanel` and `HError` are registered.
  - `HareUIScaffoldResolver().resolve('HDashboardGroup')` → `{ name: 'DashboardGroup', from: '@hareui/scaffold' }`.
  - `resolve('HButton')` → `undefined`.
- **`theme-config.spec.ts`:** `mount(DashboardPanel, { global: { plugins: [createHareUI({ ui: { dashboardPanel: { slots: { root: 'bg-surface' } } } })] } })`. The root `[data-slot="root"]` has class `bg-surface`. This also compile-checks the augmentation.
- **`use-resizable.spec.ts`:**
  - Mount a harness with `unit: 'px'`, `side: 'left'`, `minSize: 100`, `maxSize: 400`, `defaultSize: 200`, `collapsible: true`, `collapsedSize: 0`, `storage: 'local'`, `storageKey: 'test'`, `id: 'sb'`.
  - Stub `HTMLElement.prototype.offsetWidth` to `200`.
  - Cases:
    - mousedown at `clientX: 0`, then a `window` mousemove at `clientX: 50` → `size === 250`.
    - Move to `clientX: 500` → `size === 400` (clamped).
    - Move to `clientX: -197` → `isCollapsed === true`.
    - Dblclick → not collapsed, `size === 200`.
    - `localStorage.getItem('test-sb')` parses to `{ size, collapsed }`.
    - A second harness mounted with the same key restores that `size`.
    - With `storage: 'cookie'`, a resize leaves `document.cookie` containing `test-sb=`.
- **`dashboard.spec.ts`** (`attachTo: document.body`):
  - `DashboardGroup > [DashboardSidebar collapsible, DashboardPanel > DashboardNavbar]`.
  - Clicking `DashboardSidebarCollapse` in the sidebar `#header` flips the sidebar root `data-collapsed` from `false` to `true`.
  - Clicking the navbar toggle (aria-label `Open sidebar`) renders `[data-slot="drawer-dialog"]` in `document.body`, and the toggle's aria-label becomes `Close sidebar`.
  - With a `createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: {} }, { path: '/b', component: {} }] })` plugin, `await router.push('/b')` closes it.
  - `DashboardSearchButton` click sets the group's `searchOpen` to `true` (assert via the `onUpdate:searchOpen` prop spy).
- **`layout.spec.ts`:**
  - `Error` with `{ error: { statusCode: 404, statusMessage: 'Page not found', message: 'Gone' } }` renders the three texts in their data-slots. Clicking `Back to home` emits `clear` and calls the router (memory router at `/x` ends at `/`).
  - `Header` toggle opens a `Modal` (`mode` default).
  - `Sidebar` with `open: false` renders root `data-state="collapsed"`. Clicking the rail emits `update:open` with `true`.

### Step 10: Playground and docs (commit `docs(scaffold): scaffold section, demos and playground pages`)
- **Playground** (pages are auto-routed by `playground/src/router.ts`):
  - `playground/src/pages/ScaffoldDashboard.vue`: full-viewport `DashboardGroup` with:
    - a resizable, collapsible `DashboardSidebar` with `SidebarCollapse` in `#header`, three `RouterLink`s (`/ScaffoldDashboard?tab=1`, `?tab=2`, `/ScaffoldLayout`) in the body, and a `DashboardSearchButton`
    - a `DashboardPanel` with `DashboardNavbar title="Inbox"` + `DashboardToolbar`
    - a second resizable `DashboardPanel`
    - `v-model:search-open` bound to a HareUI `Modal`
  - `playground/src/pages/ScaffoldLayout.vue`: `App > Header (links in #body, RouterLink to /ScaffoldDashboard) + Main > Container + Footer`, plus a `Sidebar collapsible="icon"` variant section.
- **Docs sidebar** (`docs/.vitepress/sidebar.ts`):
  - Add `const s = (page: string) => \`/docs/scaffold/${page}\``.
  - Append this section after `Components`:
    `{ text: 'Scaffold', icon: 'layout-header-side-content', base: '/docs/scaffold', items: [{ separator: 'Overview' }, { text: 'Introduction', link: s('') }, { separator: 'Layout' }, …App, Container, Main, Header, Footer, Error, Sidebar…, { separator: 'Dashboard' }, …DashboardGroup, DashboardSidebar, DashboardSidebarToggle, DashboardSidebarCollapse, DashboardPanel, DashboardNavbar, DashboardToolbar, DashboardResizeHandle, DashboardSearchButton…] }`
  - Use `text` = component name and `link` = `s('<kebab-name>')`. `layout-header-side-content` exists in the installed gravity-ui icon set.
  - `gen-llms.ts` iterates `sidebar`, so the section is picked up automatically.
- **`docs/.vitepress/theme/components/PageHeader.vue`:** add `nuxtui?: string` to `PageLinks`, and a badge `{ label: 'Nuxt UI', href: \`https://ui.nuxt.com/docs/components/${links.nuxtui}\`, icon: 'nuxtui' }`. Render the `nuxtui` icon as `<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 2 15 14H1z" /></svg>` and extend the icon union type.
- **`docs/docs/scaffold/index.md`** (title `Scaffold`), with these sections:
  - **Installation:** a code-group installing `@hareui/scaffold`, which requires `@hareui/vue`.
  - **CSS:** `@import "tailwindcss"; @import "@hareui/vue"; @import "@hareui/scaffold";`, and overriding `--ui-header-height` / `--ui-container`.
  - **Global registration:** `app.use(HareUIScaffold)` and the `PrefixedScaffoldComponents<'H'>` `GlobalComponents` snippet.
  - **Auto import:** `resolvers: [HareUIResolver(), HareUIScaffoldResolver()]`.
  - **Theming:** `createHareUI({ ui: { dashboardSidebar: { slots: { root: '…' } } } })`.
  - **Router:** auto-close, title link and Error redirect use vue-router when it is installed, and fall back to `<a href>` / `location.assign` otherwise.
  - A full composed dashboard demo `scaffold/dashboard`.
- **One page per component**, `docs/docs/scaffold/<kebab>.md`:
  - Frontmatter: `title: <Name>`, `description:` copied from the Nuxt UI .md frontmatter, `links: { nuxtui: <kebab> }`.
  - `## Usage`: an import snippet from `@hareui/scaffold` plus `<ComponentPreview name="<kebab>/default" />`.
  - Then one section per example section of the Nuxt UI page, with the same headings in the same order, each backed by `docs/demos/<kebab>/<slug>.vue`.
  - Nuxt-only material becomes plain Vue: `app.vue`/`error.vue` examples become `App.vue` / router error-page examples, and `useCookie` notes become the `storage` prop. Changelog sections are skipped.
  - Then `## API Reference` with `### Props` / `### Slots` / `### Events` (Events only if the component emits) via `<ApiTable component="<Name>" kind="…" />`.
  - Then `## Theme` with the snippet `<<< ../../../packages/scaffold/src/theme/<camelKey>.ts`.
  - `error.md` adds a tip: `import { Error as HError } from '@hareui/scaffold'` avoids shadowing the global `Error`.
- **Full-layout demos** (anything containing DashboardGroup, Sidebar, Header+Main, Main or Error) wrap their template in `<div class="relative h-[28rem] w-full overflow-hidden rounded-xl border border-separator [contain:layout_paint]">`. This makes `fixed` descendants position against the frame and not the page. Viewport-height classes are overridden inside demos:
  - DashboardSidebar / DashboardPanel: `:ui="{ root: 'min-h-full' }"`
  - Sidebar: `:ui="{ container: 'h-full' }"`
  - Main / Error: `class="min-h-full"`
- **Agent notes:** add to `agents/decisions.md` a section `## @hareui/scaffold` with these bullets:
  - The package, its scope (Layout + Dashboard from Nuxt UI v4, no DashboardSearch/CommandPalette).
  - The token table above.
  - The mode→overlay mapping.
  - `storage` default `'local'`.
  - `searchOpen` model on DashboardGroup.
  - Gravity icons.
  - English literals.

  Add `packages/scaffold` to the repo layout list in `agents/README.md`.
- **Peer dispatch (optional):** after Step 8 lands, the Step 9 per-component units (component + theme + tests + demos + doc page) may be dispatched to idle peers via mecca, in dependency order:
  - Container / Main / Footer → App → Error → Header → Sidebar
  - useResizable + context → DashboardGroup → ResizeHandle → SidebarToggle / SidebarCollapse → DashboardSidebar → DashboardPanel → Navbar → Toolbar → SearchButton

  Peers send their registry lines (`allComponents.ts`, `componentNames.ts`, theme `index.ts`, `src/index.ts` type exports, sidebar entry) to the integrating session, which owns those five shared files and all commits.

## Critical files & anchors
- `packages/vue/src/config.ts`: `createHareUI` / `hareUIConfigKey` / `HareUIThemes`. `HareUI` reuses `createHareUI`; `useComponentUI.ts` and scaffold's `useScaffoldUI.ts` inject the key.
- `packages/vue/src/index.ts`: the component value exports move to `allComponents.ts`; type exports stay. `docs/scripts/gen-api.ts` must read the registry file.
- `packages/vue/src/components/Drawer.vue` (`DrawerSlots`, ~l.56; `content` slot ~l.273): the `content` slot replaces the dialog's inner markup but keeps the panel. The scaffold menus therefore use `title` / `#body` / `#footer` and only forward a user `content` slot.
- `/tmp/nuxt-ui/src/runtime/composables/useResizable.ts`: the resize, collapse and persistence algorithm ported in Step 9.8. Its `useCookie` / `useLocale` uses are the only Nuxt couplings.
- `docs/.vitepress/theme/components/ComponentPreview.vue` (~l.66): the preview container has `contain: content`. Full-layout demos need their own `[contain:layout_paint]` frame so `fixed` elements stay inside the demo.

## Verification
Run all commands from `/Volumes/Workspaces/opensource/herouse`.

**After Step 1 (rename):**
1. `bun install && bun run typecheck && bun run test && bun run build`: 0 type errors, all specs pass, and `packages/vue/dist/index.js` exists.
2. `bun run docs:build` exits 0. `docs/.vitepress/dist/llms.txt` contains `https://hareui.dev` and no `herouse`. `rg -i herouse docs/.vitepress/dist -g '*.html' -c` → no matches.
3. Run `bun run dev` and `bun run reference` as named background services. If :5173 or :5174 is already taken by another session, don't kill that process. Send its owner (find it via `mecca://sessions`) a direct mecca message asking them to restart it, end your turn, and run parity only after they confirm. Then `bun parity/compare.ts --component button --concurrency 2` prints all cases passed. This proves the playground alias resolves `@hareui/vue`.
4. The `rg` gate from Step 1.4.

**After Steps 2–5:**
5. `bun run typecheck` passes. Sanity check: temporarily delete `'Kbd'` from `componentNames.ts`; typecheck must fail on `namesInSync` with `"Kbd"` in the message. Revert.
6. `bun run test` passes, including `plugin.spec.ts` and `resolver.spec.ts`.
7. `bun run build`. `dist/resolver.js` imports only `./componentNames.js`. Then `node -e "import('/Volumes/Workspaces/opensource/herouse/packages/vue/dist/resolver.js').then(m => console.log(m.HareUIResolver().resolve('HAlert')))"` prints `{ name: 'Alert', from: '@hareui/vue' }`.

**Consumer smoke (end-to-end, both mechanisms):**
8. Set up a consumer app:
   ```sh
   cd packages/vue && bun pm pack --destination /tmp
   cd /tmp && rm -rf hareui-smoke && bun create vite hareui-smoke --template vue-ts && cd hareui-smoke
   bun add /tmp/hareui-vue-0.1.0.tgz @internationalized/date tailwindcss @tailwindcss/vite
   bun add -d unplugin-vue-components
   ```
   - `src/style.css`: `@import "tailwindcss"; @import "@hareui/vue";`
   - `main.ts`: imports `./style.css`.
   - `App.vue`: template only, no script imports:
     ```vue
     <HButton variant="danger">Delete</HButton>
     <h-chip>New</h-chip>
     ```
9. **Resolver mode:**
   - `vite.config.ts` plugins: `[vue(), tailwindcss(), Components({ dts: true, resolvers: [HareUIResolver()] })]`.
   - Run `bunx vite build`. It must succeed. `components.d.ts` contains `HButton: typeof import('@hareui/vue')['Button']` and `HChip`.
   - Tree-shaking check: `rg -c hareui-dropdown-section dist/assets` returns no matches. That literal exists only in Dropdown.
   - `bunx vite preview --port 4317`, then in the browser:
     - `document.querySelector('button[data-slot="button"]').textContent.trim() === 'Delete'`
     - `document.querySelector('hbutton, h-chip') === null`
     - Take a screenshot showing the red danger button and the chip.
10. **Plugin mode:**
    - Remove `Components(...)` from `vite.config.ts` and delete `components.d.ts`.
    - `main.ts`: `createApp(App).use(HareUI).mount('#app')`.
    - Add `src/hareui.d.ts` from the docs snippet.
    - `bunx vue-tsc --noEmit -p tsconfig.app.json` → 0 errors. Temporarily set `<HButton variant="nope">`; it must report a type error on `variant`. Revert.
    - `bunx vite build`. `rg -c hareui-dropdown-section dist/assets` returns ≥1, because every component is registered.
    - Run `bunx vite --port 4318`, open the page: same DOM checks as step 9, and no `Failed to resolve component` warning in the console.
    - Delete `/tmp/hareui-smoke` and the tarball afterwards.
11. **Docs:**
    - `bun run docs:build` exits 0, and `docs/.vitepress/dist/llms-full.txt` contains `HareUIResolver` and `PrefixedComponents<'H'>`.
    - `bun run docs:dev -- --port 5181 --strictPort`, open `/docs/getting-started/quick-start`. The three new sections render with code groups, and the frameworks tip links jump to them.

**Phase 2 (`@hareui/scaffold`):**
12. `bun install && bun run typecheck && bun run test && bun run build` all pass. `packages/scaffold/dist/index.js`, `dist/resolver.js` and `dist/index.d.ts` exist, and `dist/index.d.ts` contains `interface HareUIThemes extends ScaffoldThemes`. Sanity check: temporarily delete `'DashboardPanel'` from scaffold `componentNames.ts`; typecheck must fail on `namesInSync`. Revert.
13. `node -e "import('/Volumes/Workspaces/opensource/herouse/packages/scaffold/dist/resolver.js').then(m => console.log(m.HareUIScaffoldResolver().resolve('HDashboardSidebar')))"` prints `{ name: 'DashboardSidebar', from: '@hareui/scaffold' }`. This only works if `@hareui/vue/resolver` resolves from `packages/scaffold/node_modules` (the workspace link).
14. **Playground (browser).** Run `bun run dev` (named service, port 5173) and open `http://localhost:5173/ScaffoldDashboard`.
    - At 1440×900:
      - Drag the sidebar handle right by 100px; the sidebar width grows.
      - Reload; the width persists (`localStorage['dashboard-<id>']` holds `{ size, collapsed }`).
      - Click `Collapse sidebar`; root gets `data-collapsed="true"` and the button label becomes `Expand sidebar`.
      - Click the search button; the Modal opens.
    - At 390×844:
      - The sidebar is hidden and the navbar toggle `Open sidebar` is visible. Clicking it opens a left Drawer with the sidebar links.
      - Clicking the `?tab=2` link closes the Drawer (autoClose).
    - On `/ScaffoldLayout` at 390×844: the Header toggle opens the full-size Modal menu; navigating via its RouterLink closes it.
    - Take screenshots of both pages at both sizes.
15. **Docs.** `bun run docs:build` exits 0. `docs/.vitepress/api/DashboardSidebar.json` exists with a `props` entry `resizable`.
    - With `bun run docs:dev -- --port 5181 --strictPort`, open `/docs/scaffold/dashboard-sidebar`.
    - The Nuxt UI badge links to `https://ui.nuxt.com/docs/components/dashboard-sidebar`.
    - Each demo renders inside its frame, and no dashboard element covers the docs header or the code panel. Check this with `document.elementFromPoint` at the docs header center: it returns a docs header node.
    - ApiTable rows render. The sidebar shows the `Scaffold` tab with the Layout and Dashboard separators.
16. **Consumer smoke.**
    - Pack both packages: `bun pm pack --destination /tmp` in `packages/vue` and `packages/scaffold`.
    - Recreate `/tmp/hareui-smoke` as in step 8 and `bun add` both tarballs. `style.css` imports `tailwindcss`, `@hareui/vue` and `@hareui/scaffold`.
    - Vite config: `Components({ dts: true, resolvers: [HareUIResolver(), HareUIScaffoldResolver()] })`.
    - `App.vue` template: `<HDashboardGroup><HDashboardSidebar collapsible><template #header><HDashboardSidebarCollapse /></template></HDashboardSidebar><HDashboardPanel><template #header><HDashboardNavbar title="Home" /></template></HDashboardPanel></HDashboardGroup>`.
    - `main.ts`: `app.use(createHareUI({ ui: { dashboardNavbar: { slots: { title: 'text-accent' } } } }))`.
    - `bunx vue-tsc --noEmit -p tsconfig.app.json` → 0 errors. Temporarily change the key to `dashboardNavbarX`; it must report a type error. Revert.
    - `bunx vite build && bunx vite preview --port 4319`. In the browser:
      - `[data-slot="title"]` text is `Home` with class `text-accent`.
      - The collapse button toggles `data-collapsed`.
      - Take a screenshot.
    - Delete `/tmp/hareui-smoke` and the tarballs afterwards.

## Assumptions & contingencies
- Domain placeholder `herouse.dev` becomes `hareui.dev`. The user can change it in `docs/scripts/gen-llms.ts` (`SITE_URL`) and `docs/docs/getting-started/llms-txt.md`.
- The library directory becomes `packages/vue`, which leaves room for `packages/lynx`.
- Agent notes (`agents/**`, including `reviews/`) are renamed too, so future readers see current API names. Only `/tmp/herouse…` scratch paths and the repo root path stay.
- If peers don't reply within the session, don't rename over their uncommitted files. Leave Step 0 blocked and tell the user which peers/files are outstanding.
- If Vite rejects `lib.entry` as an object without `fileName`, add `fileName: (_format, name) => \`${name}.js\``.
- If `<HButton>` is untyped in vue-tsc (step 10), first confirm `src/hareui.d.ts` falls under `tsconfig.app.json` `include`. An interface extending a mapped type with statically known keys is valid TS, so the mechanism itself stays; do not replace it with hand-written per-component lists.
- `@hareui/scaffold` ports Nuxt UI's Layout and Dashboard groups only. DashboardSearch, CommandPalette and Page* blocks are left out.
- Nuxt UI structure is kept, but colors, radius and shadow are translated to HareUI tokens (table in Step 9), and the icons are Gravity UI.
- `Error` and `App` keep their Nuxt UI names.
- `DashboardGroup` `storage` defaults to `'local'`, not Nuxt's `'cookie'`. The user can flip the default in `DashboardGroup.vue`.
- `Header` `title` defaults to `'HareUI'`, mirroring Nuxt UI's self-branded default.
- If TS rejects `interface HareUIThemes extends ScaffoldThemes {}` inside `declare module '@hareui/vue'` (for example "An interface can only extend an object type…" from the `typeof import` namespace type), change `ScaffoldThemes` to an explicit `export interface ScaffoldThemes { container: typeof container; … }` in `packages/scaffold/src/theme/index.ts` and keep the augmentation.
- If `useStorage` from `@vueuse/core` 14 rejects a custom `StorageLike` in the cookie case, implement `cookie` persistence as `ref(read())` + `watch(…, write, { deep: true })` with the same `cookieStorage` helpers.
