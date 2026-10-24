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
| I2 | Sorted imports | Prettier plugin |
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
| S1 | No hard file-size limit; depth over size, review judgment | review-only |

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
