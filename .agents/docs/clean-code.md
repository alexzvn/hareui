# Clean-code rulebook

Decided with the maintainer on 2026-10-24. Library: `packages/vue` (`@hareui/vue`, Vue 3.5 + reka-ui + tailwind-variants). Docs: `docs/` (VitePress; `docs/demos/**.vue` are demo SFCs users copy).

## Scope
Rules govern: `packages/vue/src`, `packages/vue/test`, `docs/demos`, `docs/.vitepress` (theme/config), `docs/scripts`.
Not governed: `tooling/` (lint plugin, scripts, playground, reference, parity), any `dist/`, `node_modules/`.

## Formatting — oxfmt 0.74.0 (`.oxfmtrc.json`)
no semicolons, single quotes, printWidth 100, trailingComma all. Import order by oxfmt `sortImports`: builtins → external packages → `@/` alias → relative. Vue SFC script/style not indented.

## Lint — oxlint (v1.89, `.oxlintrc.json` at repo root) + local JS plugin `hareui` (`tooling/lint/hareui-plugin.mjs`, rules in `tooling/lint/rules/*.mjs`)

| # | Rule | Enforced by |
|---|------|-------------|
| T1 | No `any` (use `unknown` + narrowing) | `typescript/no-explicit-any` error |
| T2 | No unused locals/params | `eslint/no-unused-vars` + tsconfig `noUnusedLocals`/`noUnusedParameters` (packages/vue + docs) |
| T3 | `type` by default; `interface` only when declaration merging / `extends` is required | `typescript/consistent-type-definitions: ["error","type"]` (disable inline where merging needed) |
| T4 | `import type` for type-only imports | `typescript/consistent-type-imports` |
| T5 | No TS `enum`; string-literal unions + `as const` objects | `hareui/no-enum` |
| F1 | `const` arrow functions everywhere; no `function` declarations/expressions (callbacks are arrows) | `eslint/func-style: ["error","expression"]`, `eslint/prefer-arrow-callback`; generators exempt |
| F2 | ≤ 2 positional params; more → one options object | `eslint/max-params: ["error", {max: 2}]` |
| F3 | Default params / destructured defaults instead of `x ?? default` at top of body | review-only |
| F4 | No `else` / `else if`. Use guard clauses/early return, `as const` lookup maps (`Record<Union, Handler>` with `satisfies`), single-level ternary | `hareui/no-else` |
| F5 | Nested ternary banned | `eslint/no-nested-ternary` |
| F6 | `switch` only with a preceding `// perf: <reason>` comment AND a `default` clause; when the discriminant is a finite union the default calls `assertNever(x)` from `@/utils/assert` | `hareui/switch-perf` |
| N1 | Event handlers named `onX`; `handleX` banned | `hareui/handler-naming` |
| N2 | Boolean variables named `is/has/should/can` + PascalCase; `isNot*`/`hasNo*` banned. Props/`defineModel` names exempt (HTML/HeroUI names like `disabled`, `open`) | `hareui/boolean-prefix` |
| N3 | One verb per concept: `get` = pure read, `resolve` = read with fallback/merge, `create` = new instance, `use` = composable, `on` = handler, `to` = conversion | review-only, glossary in AGENTS.md |
| I1 | Path alias `@/` → `packages/vue/src` for any cross-directory import inside packages/vue (src + test); relative imports only for same folder (`./x`) | `hareui/no-parent-import` (autofix to `@/…`) |
| I2 | Sorted imports | oxfmt `sortImports` |
| V1 | SFC block order: `<template>` → `<script>` → `<style>` (src AND docs demos AND markdown code samples) | `hareui/sfc-block-order` (reads file from disk); one-off fixer `tooling/scripts/fix-sfc-block-order.ts` |
| V2 | Composables: one `useX` per file, named export, no default export (`src/composables/**`, any `use*.ts`) | `hareui/composable-export` |
| V3 | Template element refs via Vue 3.5 `useTemplateRef('name')`, one per element; `ref<HTMLElement>()` etc. banned | `hareui/use-template-ref` |
| V4 | Related local state keys grouped in `shallowReactive({...})` (`reactive` only when nested mutation is needed); a lone value stays `ref`. Never destructure a reactive object (use `toRefs`) | grouping review-only; `hareui/no-reactive-destructure` |
| V5 | Public props: ≥ 2 props sharing a camelCase prefix are grouped into one nested object prop (`prevLabel`,`prevIcon`,`prevDisabled` → `prev: { label, icon, disabled }`). Exempt prefixes: `aria`, `on`, `data`, `default`, `model` (DOM/ARIA and v-model/uncontrolled idioms) and verb prefixes `get`, `resolve`, `create`, `use`, `to`, `is`, `has`, `should`, `can`, `render` (callbacks, not noun groups). Nested-prop defaults deep-merge per key with `defu`. Internal state/types follow the same grouping | `hareui/prop-group` (on `*Props` types / defineProps type literals) |
| E1 | Throw only `Error` (subclasses) | `eslint/no-throw-literal`, `unicorn/throw-new-error` |
| E2 | No empty `catch`; comment the reason or rethrow | `eslint/no-empty` |
| E3 | No `console.*`; dev warnings via `warn()` from `@/utils/warn` (dev-only, stripped in production) | `eslint/no-console` (allowed only in `src/utils/warn.ts`) |
| E4 | Prefer `map/filter/reduce`; `for` loops allowed in hot paths (charts, collections, virtualization) | review-only |
| D1 | Dead code / unused exports / unused deps removed | knip (CI) |
| C1 | JSDoc on everything publicly importable from `@hareui/vue` entries (`src/index.ts`, `src/charts.ts`, `src/vite.ts`): exported functions, types, and every member of public Props/Emits/Slots types | `hareui/public-jsdoc` |
| C2 | Internal comments explain WHY only (invariants, RAC/HeroUI parity, workarounds with links), concise; delete comments restating code; no commented-out code | review-only |
| S1 | A file stays ≤ 600 lines (template + script + style). Over that, split by concern: public types → `<Component>.types.ts`, logic → `use<Component><Concern>.ts` composables or pure `<concern>.ts` modules, repeated markup → child components | `hareui/max-file-lines` |
| S2 | Public component types (Props, Emits, Slots, item/slot-prop types) live in `<Component>.types.ts` next to the SFC, imported with `import type … from './<Component>.types'`; SFCs keep no separate type-only `<script lang="ts">` block. Not `.d.ts`: hand-written declaration files are not emitted to `dist`, so consumers would lose the types | review-only |

## Readability
Code is read far more than written; give it room to breathe.

| # | Rule | Enforced by |
|---|------|-------------|
| R1 | Blank line before and after every multi-line statement (block, multi-line call or literal) unless it is first/last in its block, or the statement before it is a single-line `const`/`let` it uses ("compute, then branch"). Blank line before a `return` that follows other statements, except in a two-statement block | `hareui/padding-lines` (autofix) |
| R2 | A comment sits on its own line(s) directly above the code it explains, with a blank line above it (unless first in its block). No trailing comments after code | `hareui/padding-lines` (autofix), review |
| R3 | Max nesting depth 3 blocks, max 3 nested callbacks; deeper → extract a named function | `eslint/max-depth`, `eslint/max-nested-callbacks` |
| R4 | Name intermediate values instead of chaining them inside conditions (`const rows = list.rows() ?? []` then `rows.findIndex(…)`); one idea per line | review-only |
| R5 | Hoist inner helper closures to setup/module level when they don't need the enclosing function's locals beyond their parameters | review-only |

Before → after (R1–R5):

```ts
// Before: no breathing room, nested closure, chained lookups inside conditions
const setFocusKey = (value: ListBoxValue | null, scroll = true) => {
  focusedKey.value = value
  if (value == null || !scroll) return
  // Virtualized: render the row first, then scroll it into view like any other
  const reveal = () => document.getElementById(optionId(value))?.scrollIntoView({ block: 'nearest' })
  const list = listEl.value?.$el as HTMLElement | undefined
  if (props.virtualize && list && !document.getElementById(optionId(value))) {
    …
  } else {
    nextTick(reveal)
  }
}

// After
const revealOption = (value: ListBoxValue) => {
  document.getElementById(optionId(value))?.scrollIntoView({ block: 'nearest' })
}

const setFocusKey = (value: ListBoxValue | null, scroll = true) => {
  focusedKey.value = value
  if (value === null || !scroll) return

  const isRendered = document.getElementById(optionId(value)) !== null
  if (props.virtualize && !isRendered) {
    scrollVirtualRowIntoView(value)
    return
  }

  nextTick(() => revealOption(value))
}
```

## Tests
- One behavior per `it` (several expects OK); name states the behavior.
- Assert public behavior: DOM roles/ARIA, emits, v-model, keyboard.
- Class assertions (`.classes()`, `classList`, `className`) only in theme/variant contract specs (`packages/vue/test/theme/**`); elsewhere banned → `hareui/no-class-assertion`.
- Pure modules (field chrome, typeahead, range selection, numeric value) tested without mounting.
- Specs stay in flat `packages/vue/test/`.

## Exports
Keep current export style (default exports allowed for `theme.ts` etc.), except V2 composables.

## Enforcement
- CI blocking: `oxfmt --check`, `oxlint` (deny warnings), `knip`, typecheck, tests, build.
- Pre-commit: lefthook runs oxfmt + `oxlint --fix` on staged files, re-stages fixed files.
- `AGENTS.md` at repo root is the short version and links here.

## Release / commits
- Breaking nested-prop changes ship as 0.4.0 with a migration guide page listing every renamed prop; no deprecated aliases (clean cutover).
- Commits: subject-only conventional (`type(scope): summary`). Tooling first; then one commit per rule (mechanical, codemod-driven); behavioral/API changes separate per component family. Formatting commit hashes go in `.git-blame-ignore-revs`.
