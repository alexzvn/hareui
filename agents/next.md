# Next chunk (overnight run, started 2026-10-02)

The user approved this before going to sleep. Autonomy is **full**: peers implement, the integrator (gnUc_P1) commits each unit and runs the final verification. Anything that needs a new user decision gets parked in `status.md` under "Open decisions". Don't block on it.

## Approved work

### New components (user's list)
Skeleton, ProgressBar, NumberField, Alert, Disclosure, Toast, Typography. Modal is already built; its review finishes as part of the in-flight work.
Each one is built per `plan.md` Step 5 conventions plus `decisions.md` (option A: props + named slots, no compound parts):
- `packages/herouse/src/components/<Name>.vue`, `src/theme/<camel>.ts` (translated from `/tmp/heroui/packages/styles/components/<kebab>.css`), and exports appended to `src/index.ts` + `src/theme/index.ts`. Append-only, one line each.
- Use Reka primitives where they exist: NumberField → `NumberFieldRoot/Input/Increment/Decrement`; Disclosure → `CollapsibleRoot/Trigger/Content`; ProgressBar → `ProgressRoot/Indicator`; Toast → `ToastProvider/Root/Viewport`, with HeroUI's queue API mapped to a `useToast()` composable.
- Unit specs for consumer-visible behaviour, a playground page, and parity cases in all 3 files (`parity/cases/<c>.json`, `playground/src/parity/cases/<c>.ts`, `reference/src/cases/<c>.tsx`) at the default threshold.
- Docs: `docs/docs/components/<kebab>.md` with every HeroUI demo ported to `docs/demos/<kebab>/`, a sidebar entry in HeroUI's category, and 0 px vs heroui.com in light and dark (review-brief method).

The user did **not** pick Link, Separator, TextArea, Surface, SwitchGroup or ButtonGroup. The demos that need them stay hand-ported or missing.

### API work
1. **CSS-variable responsive sizes.** Theme sizes become `[--<c>-height:…] md:[--<c>-height:…] h-(--<c>-height)` (same for padding etc. where HeroUI uses breakpoints). A user's plain `h-11` then wins at every breakpoint, as with HeroUI's `@layer components`. Themes with `md:` today: button (7), avatar, chip, modal, spinner, switch. Re-run parity for each touched component.
2. **TextField: forward input attrs** (`autofocus`, `maxlength`, `minlength`, `pattern`, `autocomplete`, `inputmode`, …) to the `<input>`, not the wrapper div.
3. **Validation layer**, RAC-equivalent, across Input/TextField/NumberField/Checkbox/Switch/RadioGroup: `validate(value) => string | string[] | true | null`, `validationBehavior: 'native' | 'aria'` (HeroUI default `native`), and `validationErrors` server errors. Errors feed `invalid` and FieldError, and `#error` gets the errors as slot props. Port the HeroUI validation demos that this unblocks.
4. **Document `tv(themes.card)`** for Card title/description inside custom wrappers (card.md Customization).
5. **Button ripple-effect demo.** Port HeroUI's demo, adding a small ripple helper or composable if needed.
6. **Signed off:** all review API additions (see `status.md` item 8). They're now official API.

## Assignments

| Peer | Work |
|---|---|
| -8sP15N | API 1 (CSS-var sizes, all 6 themes), API 5 (ripple), then Alert, Disclosure, Typography |
| kBg55Bg | NumberField |
| abE2Br_ | API 2 + API 3 (validation layer; coordinates with kBg55Bg for NumberField) |
| vTSDGtr | Skeleton, ProgressBar, API 4 |
| DTT1wRo | finish Tabs indicator + Modal/Popover review, then Toast |
| _uhc9dP | finish Tabs/Tooltip review |
| hKWRyJv | finish the docs-site review; add sidebar entries for new components when asked; fix the herouse gaps from the Theme selector: Popover z-index, Button `[&_svg]:size-4` outranking child icon sizes, Description `text-xs` line-height lost on merge |

## Integrator (gnUc_P1)
- Commit each reported unit with explicit pathspecs. Run typecheck, the relevant specs and component parity before each commit.
- When everything has landed: full `bun parity/compare.ts --concurrency 2` (light and dark), `bun run test`, `bun run typecheck`, `bun run docs:build` + the llms.txt checks, and the playground visual pass (plan Verification 7). Then update `status.md`.
