# herouse component batch brief

Repo: /Volumes/Workspaces/opensource/herouse (bun workspace, already installed). Full plan: /tmp/herouse-plan.md — read "API conventions", Step 4 (CSS→tv rules), Step 5 (your components' specs), Step 7 (parity), Step 8 (tests), Step 9 "Content → Component pages".

## Reference implementation (copy these patterns exactly)
- packages/herouse/src/components/Button.vue, Spinner.vue — SFC shape: `<script lang="ts">` block exporting `XProps`/`XSlots` interfaces with JSDoc + `@defaultValue`, then `<script setup>` using `useComponentUI('<themeKey>', { theme, variantProps: () => ({ ...variant props }) })`.
- packages/herouse/src/theme/button.ts — theme shape (`slots`, `variants` with `{ slotKey: '...' }` objects, `compoundVariants`, `defaultVariants`).
- Parity cases: parity/cases/button.json + playground/src/parity/cases/button.ts + reference/src/cases/button.tsx. Shared test icon: `gear` from playground/src/parity/icons.ts and reference/src/icons.tsx.
- Tests: packages/herouse/test/button.spec.ts.

## Hard-won rules
1. **Every class string in theme files must be a literal** — no template-string interpolation or concatenated constants. Tailwind scans source text; interpolated classes are silently not generated (this broke Button svg sizing until fixed).
2. Use `[transform:scale(x)]` not `scale-*` when HeroUI sets `transform:` (Tailwind v4 `scale-*` sets the `scale` property → computed-style mismatch). Generally prefer the arbitrary property form when HeroUI writes a raw declaration.
3. HeroUI `@media (hover:hover){&:hover}` declared after `:active` means hover wins while pressed — see Button's `hover:active:` trick. Watch source order of HeroUI rules vs Tailwind's variant order (hover < focus < active).
4. `data-slot` strings must equal HeroUI's exactly, and the sequence of `[data-slot]` elements inside `#case` must match React's (the parity script compares them in document order).
5. Parity script freezes infinite animations at t=0 and finishes finite ones before capture.

## Workflow per component
1. Read `/tmp/heroui/packages/react/src/components/<c>/<c>.tsx`, `/tmp/heroui/packages/styles/src/components/<c>/<c>.styles.ts`, `/tmp/heroui/packages/styles/components/<c>.css`. Reka sources in /tmp/reka-ui/packages/core/src.
2. Write `packages/herouse/src/theme/<camel>.ts` and `packages/herouse/src/components/<Name>.vue`.
3. Register exports — the ONLY edits allowed in shared files, insert just your own lines, re-read the file right before each edit (others edit concurrently):
   - `packages/herouse/src/theme/index.ts`: `export { default as <camel> } from './<camel>'`
   - `packages/herouse/src/index.ts`: `export { default as <Name> } from './components/<Name>.vue'` + `export type { <Name>Props, ... } from './components/<Name>.vue'`
4. Parity: add `parity/cases/<c>.json` (array of `{ id, component, actions, ignoreSlots, [target], [overlay], [ignoreProps + reason] }`), `playground/src/parity/cases/<c>.ts`, `reference/src/cases/<c>.tsx` (React uses `@heroui/react@3.2.6` compound API with identical content). Coverage minimum: plan Step 7 "Minimum cases per component". Overlay cases: `"overlay": true`, render `defaultOpen`.
5. Dev servers are ALREADY RUNNING (playground :5173, reference :5174) — do not start/stop them. Run `bun parity/compare.ts --component <c>` until it prints all passed. Failures write PNGs to parity/out/ (shared dir; the script deletes it on start — only look at your own files right after your run). Fix by changing herouse only, never the reference. Escape hatch only per plan (`ignoreProps` + `reason`).
6. Playground page: `playground/src/pages/<Name>.vue` (routes are auto-discovered) — every variant × size, states, slot usage, one `:ui` override.
7. Tests: `packages/herouse/test/<kebab>.spec.ts` per plan Step 8; run `bun run --cwd packages/herouse vitest run test/<kebab>.spec.ts`.
8. Docs: `docs/demos/<c>/<demo>.vue` (port every HeroUI demo in /tmp/heroui/apps/docs/src/demos/en/<c>/ except dropped features listed in plan Step 9) and `docs/docs/components/<kebab>.md` (frontmatter `title`, `description`, `links: { reka, source, styles, heroui }`; sections per plan; `<ComponentPreview name="<c>/<demo>" />`, `<ApiTable component="<Name>" kind="props|slots|emits" />`). Source mdx: /tmp/heroui/apps/docs/content/docs/en/react/components/(<group>)/<c>.mdx. Icons in demos: `<Icon icon="gravity-ui:<kebab-name>" />` (globally registered `Icon` from @iconify/vue; import it explicitly: `import { Icon } from '@iconify/vue'`). The docs theme is built concurrently by another peer — you don't need docs:build to pass, but keep demos valid Vue that imports from 'herouse'.
   Wording: never name HeroUI Pro anywhere user-facing (docs `.md`, demo comments, README, and JSDoc on exported props/slots/emits, which `<ApiTable>` renders). Don't name Nuxt UI in component pages or JSDoc; describe the behaviour instead of "like Nuxt UI's X" / "as on Pro". See decisions.md "User-facing wording".
9. Final: `bun run --cwd packages/herouse typecheck` clean for your files.

Do not edit: other components' files, Button/Spinner, parity/compare.ts, playground App/router/main, reference main, docs/.vitepress/**. If you need a change in a shared/infra file, message the integrator (mecca://mailbox/gnUc_P1) instead.

Reply to mecca://mailbox/gnUc_P1 when done: files created, parity result line (`N/N cases passed`), tests result, any `ignoreProps` used with reasons, open issues.
