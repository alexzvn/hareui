# Status (as of 2026-10-02)

## Done

- Plan Steps 1-8: workspace, HeroUI tokens CSS, tv/`ui` infra, all 18 components, playground, React reference, parity harness, unit specs. See `git log`: one commit per component plus harness/docs commits.
- Plan Step 9: the VitePress docs site exists (custom theme, Getting Started + Handbook, 18 component pages, API tables via `vue-component-meta`, `llms.txt` generator).
- Fonts aligned with heroui.com (Inter Variable, antialiased).
- Docs fidelity reviews finished (reports in `reviews/`). Every ported demo is 0 px diff vs heroui.com in light and dark, vibrant off:
  - Button, Spinner, CloseButton (Button `social` is 2 px of SVG anti-aliasing)
  - Card, Chip, Avatar
  - Label, Description, FieldError, Input, TextField
  - Checkbox, Switch, RadioGroup
- Last verified: typecheck clean; avatar parity 14/14, card 7/7; checkbox, switch and radio-group 16/16 each (reported by the peer); input 8/8, textfield 7/7.

## In flight when this was written

- **Modal, Popover:** review by peer DTT1wRo. Draft reports are in `reviews/modal.md` and `reviews/popover.md`.
- **Tabs, Tooltip:** review by peer _uhc9dP, covering the user's findings:
  - tab separators
  - vertical orientation, fully supported and demoed
  - the custom-styles demo looks off
  - Tabs parity must pass at the default 0.001 threshold. The earlier `maxDiffRatio: 0.06` and the ignored indicator width/height were rejected. Root cause: Reka `TabsIndicator` measures integer `offsetWidth`. Planned fix: an own indicator positioned from `getBoundingClientRect` (ResizeObserver + watch on the value), setting the same CSS vars.
- **Docs-site chrome review (peer hKWRyJv):**
  - pages: header, sidebar, TOC, typography, code blocks, preview cards, mobile drawer; light/dark, desktop and 390 px
  - content check of the 11 Getting Started/Handbook pages
  - plus the **Theme selector** (see `decisions.md`)
- **Uncommitted working-tree changes from those peers:**
  - docs sidebar/layout/markdown
  - Getting Started pages
  - tabs/tooltip components, themes, demos and cases
  - Commit each as its own unit once its owner reports.
- **Not yet run:**
  - a full `bun run parity` (all components) after the reviews
  - `docs:build` itself **passes** (29 pages, llms generated, `aeb7241`). Still pending: the llms-full.txt colour-data fix (hKWRyJv) and the final full run.
  - the visual playground pass (plan Verification 7)

## Resolved on 2026-10-02 (see `decisions.md`; don't ask again)

- **Missing components:** the user picked Skeleton, ProgressBar, NumberField, Alert, Disclosure, Toast and Typography instead. Link, Separator, TextArea, Surface, SwitchGroup and ButtonGroup were not chosen, so the demos that need them stay hand-ported (card Link markup, `<hr>` separators, inlined Surface) or missing (TextArea, SwitchGroup and ButtonGroup demos).
- **Responsive size override:** CSS-variable sizes, in progress (`next.md` API 1).
- **Card title/description in a custom wrapper:** document `tv(themes.card)` (API 4).
- **TextField input attrs and the validation layer:** both approved (API 2 and 3).
- **Render Function / Render Props / ripple:** Render Function and Render Props are ported, and the ripple demo is approved (API 5).
- **Review API additions:** signed off as official API. They are `readonly` on Checkbox/Switch/RadioGroup, `invalid` on Switch, `#description` slot props, `data-selected` on radio-content, Card `#leading`, Avatar `#image` + img attrs + `loadingStatusChange`, and Input/TextField `defaultValue` + `readonly`.

## Open decisions for the user

Collected from `reviews/*.md` (each has a "Decisions needed" section with options):

1. **Switch label-position** is a pixel-identical CSS workaround (DOM order differs from HeroUI).
2. **Related Showcases** widget on heroui.com component pages: not ported.
3. **Docs-site items** (`reviews/docs-site.md`). The sidebar is now flat and alphabetical, like heroui.com, not collapsible groups. Still open:
   - an "All Components" overview page
   - sidebar New/Updated badges
   - Getting Started entries with no herouse counterpart (CLI, Figma, MCP)
   - header GitHub link (needs a repo URL), Ask AI, and the language picker
   - Get Involved / Contributing sections
   - the React-only sections that were dropped
4. **Follow-up, not a decision:** Select (`40c8319`) and Separator (`e9c493a`) are now committed. -8sP15N replaces the styled native `<select>` in the ProgressBar custom-value demo and the hand-styled separators in older demos (wave 2 stand-in replacements).
5. **ProgressBar value formatting** follows Reka's ConfigProvider locale (default `en`), not the browser locale like RAC.
6. **Tooltip reka-limitations** (`reviews/tooltip.md`):
   - no `closeDelay` and no focus-only trigger
   - providers are per-instance, so there's no cross-tooltip warm-up
   - positions are integer pixels, up to 0.42 px off RAC; worst hover diff is 0.35 %
7. **Toast custom content** uses one `#toast` slot (`{ content, close }`) in place of HeroUI's ToastContent/Indicator/Title/Description/CloseButton parts (option A, props + slots). Reka Toast primitives aren't used: flat announce queue, no collapsed/expanded stack geometry.
8. **Landing page** (committed `0e3a3ef`). Measured per-cell against heroui.com at 1440 px, light and dark. **Pending:** a pixel diff at 390 px (so far only compared side by side), requested from vTSDGtr. Left out because herouse lacked the components (wave 2 restores them as they land): showcase bar (ColorSwatchPicker, theme builder, Pro iframes), Select, Slider, ListBox+Kbd, InputOTP, AvatarGroup demos, Separator lines in the login card. Dropped for good unless you decide otherwise: GitHub stars/link, Ask AI, language toggle, Themes/React Native/Blog/Roadmap links, Pro banner, footer About/Contact/Privacy/social links. Also open: no herouse logo (wordmark "HeroUse", avatar fallback "H"), footer "© <year> HeroUse." pending a LICENSE/copyright holder, invented X-profile bio text, HeroUI's placeholder follower counts.
9. **Wave 2 API stand-ins for HeroUI parts** (option A): ToggleButtonGroup and ButtonGroup separators are a `separator` prop on the group, not a `<ToggleButtonGroup.Separator/>` placed in each button. ListBox and Select take `items` (with `{ type: 'section' }` / `{ type: 'separator' }` entries) plus per-item slots. The ListBox Render Function demo has no `render` prop; attributes fall through.
10. **Select multiple-value text** renders as one string where React renders several text nodes: 1-16 px anti-aliasing diff on the disabled and controlled-multiple demos.
11. **Calendar/RangeCalendar week view and day view** (DTT1wRo): Reka always builds full month grids. Options: leave these demos out and document it, or build a custom grid outside Reka for those views.
12. **RangeCalendar anchor-dependent unavailable dates:** Reka's `isDateUnavailable` gets no anchor date. Not parked yet: DTT1wRo is trying a wrapper workaround (track Reka's `update:startValue` and pass an `isDateUnavailable` closure that reads it). It stays open only if that fails.
13. **AvatarGroup count** (option A): HeroUI's `<AvatarGroup.Count>` is a `#count` slot. The count can't take its own size/color/variant; it uses the group's. Table leaves out pagination (until Pagination lands), virtualization and the tanstack-table demo.
14. **TagGroup with-list-data demo** is left out: it needs an EmptyState component, which herouse doesn't have.
15. **Docs search dialog** (being ported to match heroui.com by vTSDGtr): the Web/Native tabs and the Ask AI rows are left out (herouse has no Native docs and no AI agent).

## Next steps

1. Commit the in-flight units as each peer reports, then delete the leftover scratch files (`.review-shot-tt.ts`, `verify_tooltip_tmp.mjs`, `.probe-tt.ts`).
2. Merge all reports into one decision report for the user (the list above), and get decisions.
3. Run the remaining plan Verification items (full parity light+dark, docs:build + llms, playground visual pass). Consumer smoke **passed** on 2026-10-02 with a real `bun pm pack` tarball. Overnight work is in `next.md`.
