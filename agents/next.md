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

The user did **not** pick Link, Separator, TextArea, Surface, SwitchGroup or ButtonGroup in the first list. Wave 2 below supersedes that: every remaining HeroUI component is now in scope.

### API work
1. **CSS-variable responsive sizes.** Theme sizes become `[--<c>-height:…] md:[--<c>-height:…] h-(--<c>-height)` (same for padding etc. where HeroUI uses breakpoints). A user's plain `h-11` then wins at every breakpoint, as with HeroUI's `@layer components`. Themes with `md:` today: button (7), avatar, chip, modal, spinner, switch. Re-run parity for each touched component.
2. **TextField: forward input attrs** (`autofocus`, `maxlength`, `minlength`, `pattern`, `autocomplete`, `inputmode`, …) to the `<input>`, not the wrapper div.
3. **Validation layer**, RAC-equivalent, across Input/TextField/NumberField/Checkbox/Switch/RadioGroup: `validate(value) => string | string[] | true | null`, `validationBehavior: 'native' | 'aria'` (HeroUI default `native`), and `validationErrors` server errors. Errors feed `invalid` and FieldError, and `#error` gets the errors as slot props. Port the HeroUI validation demos that this unblocks.
4. **Document `tv(themes.card)`** for Card title/description inside custom wrappers (card.md Customization).
5. **Button ripple-effect demo.** Port HeroUI's demo, adding a small ripple helper or composable if needed.
6. **Signed off:** all review API additions (see `status.md` item 8). They're now official API.

### Landing page (added by the user during the run)
Replace the redirect in `docs/index.md` with a port of heroui.com's home page (`/tmp/heroui/apps/docs/src/app/[lang]/(home)/`: `page.tsx`, `home-content.tsx`, `home-layout-links.tsx`, `layout.tsx`, `components/{demo-showcase,release-badges,trust-page}.tsx`, `src/components/footer`). Same layout, typography, spacing and light/dark look, with the live demos built from herouse components. Rebrand to HeroUse. Drop HeroUI-only commercial parts (Pro banner/badge/title, GitHub star count without a repo URL, the sponsor/trust logos) and park them as a user decision. Compare against https://heroui.com in light and dark at 1440 and 390 px.

### Wave 2: every remaining HeroUI component (added by the user during the run)
Port all of `/tmp/heroui/packages/react/src/components/*` that herouse doesn't have yet, with the same per-component deliverables as above (component, theme, exports, specs, playground page, parity cases, docs page with every HeroUI demo, sidebar line, 0 px against heroui.com in light and dark).
- **API:** option A still holds: props + named slots, no compound parts. Collections (ListBox, Select, ComboBox, Autocomplete, Dropdown/Menu, Table, TagGroup, Accordion, Breadcrumbs, ToggleButtonGroup, CheckboxGroup) take an `items` array with per-item slots, like Tabs/RadioGroup and Nuxt UI. Nested data (sections, sub-menus, table rows/columns) goes through the items shape (e.g. `{ type: 'section', label, items }`, `columns` + `rows`). If a HeroUI demo can't be expressed, park it in `status.md` with options. Don't invent compound parts.
- **Reka first:** Accordion, AlertDialog, Autocomplete, Calendar, ColorArea/Field/Picker/Slider/Swatch/SwatchPicker, Combobox, DateField, DatePicker, DateRangePicker, Drawer, DropdownMenu/Menu, Listbox, Pagination, PinInput (InputOTP), RangeCalendar, Select, Separator, Slider, TagGroup, TimeField, Toggle, ToggleGroup, Toolbar. Where Reka's behaviour can't match RAC, record it as a reka-limitation with numbers.
- **Internal parts** (`header`, `empty-state`, `list-box-item/section`, `menu-item/section`, `radio`, `calendar-year-picker`, `color-input-group`, `date-input-group`, `rac`, `icons.tsx`) are built where their parent needs them. They're exported only if HeroUI's docs show them standalone.
- **Dependency order:** Separator, Kbd, Surface, Link and ListBox come first, because later demos use them. If a dependency isn't committed yet, message its owner directly and build something else meanwhile.
- **Existing hand-ported markup:** once Separator, Link, Surface, ButtonGroup, SwitchGroup and TextArea land, their owners replace the hand-styled stand-ins in earlier demos (card links, `<hr>` separators in chip/avatar, inlined Surface, the dropped `on-surface`, `release-outline-variant`, switch group and textarea demos) and close those `status.md` items.
- **Subagents** are allowed. The peer stays responsible for the unit list, built from `git status` (including new helpers and CSS keyframes in `styles/theme.css`).

| Wave 2 owner | Components (in order) |
|---|---|
| -8sP15N | Separator, Kbd, Link, Surface, Badge, TextArea, ErrorMessage, Fieldset, ButtonGroup, ToggleButton, ToggleButtonGroup, Toolbar, then the stand-in replacements |
| kBg55Bg | ListBox (incl. item/section/header/empty-state), Select, ComboBox, Autocomplete |
| abE2Br_ | CheckboxGroup, SwitchGroup, InputGroup, SearchField, InputOTP, TagGroup, Slider |
| _uhc9dP | Accordion, DisclosureGroup, AlertDialog, Drawer, Dropdown (Menu), ScrollShadow (incl. Tabs overflow arrows if still hand-built), Breadcrumbs, Pagination |
| DTT1wRo | after the Toast fidelity unit: Calendar, RangeCalendar, DateField, TimeField, DatePicker, DateRangePicker |
| hKWRyJv | ColorSwatch, ColorSwatchPicker, ColorSlider, ColorArea, ColorField, ColorPicker; still owns the docs chrome and sidebar ordering |
| vTSDGtr | after the landing page: Meter, ProgressCircle, AvatarGroup, Table; then restore the landing-page cells that were left out once their components exist |

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
| vTSDGtr | landing page (added mid-run) |

## Integrator (gnUc_P1)
- Commit each reported unit with explicit pathspecs. Run typecheck, the relevant specs and component parity before each commit.
- When everything has landed: full `bun parity/compare.ts --concurrency 2` (light and dark), `bun run test`, `bun run typecheck`, `bun run docs:build` + the llms.txt checks, and the playground visual pass (plan Verification 7). Then update `status.md`.
