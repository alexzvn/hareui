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

## In flight at wind-down (2026-10-02 ~15:20; HEAD `a8fbbd9`/`ed43c6a`)

Everything below is uncommitted in the working tree. Commit each as its own unit with an isolated-index check (copy containing only the unit's files: library + playground typecheck, unit tests, docs build exit 0 with a clean log). Stage `src/index.ts`, `theme/index.ts` and `docs/.vitepress/sidebar.ts` per line, never whole-file.

- **Date components (DTT1wRo):** Calendar, RangeCalendar, DateField, TimeField, DatePicker. Still fixing parity; their sidebar lines are already in `sidebar.ts`. Status items 11-12.
- **Toast height fix (DTT1wRo):** verified (toast parity 15/15, five demos 0 px vs heroui.com light+dark); unit not yet sent.
- **ComboBox, Autocomplete (wave 2, kBg55Bg):** not started. kBg55Bg has no uncommitted files.
- **Colour components** (hKWRyJv): all six committed (`468b999`..`651604a`); nothing outstanding.
- **_uhc9dP wave 2** (Accordion, DisclosureGroup, ScrollShadow, Breadcrumbs, Pagination, AlertDialog, Drawer, Dropdown + compare.ts box-shadow normaliser): committed (`5d36ce7`..`62af4ff`). Residues: scroll-shadow custom-styles (~1.1k px text raster) and visibility-change (200 px).
- **ButtonGroup basic/custom-styles demos** (-8sP15N): not done; they were waiting on Dropdown, which is now committed, so they can be written.
- **`<RelatedComponents>` in `docs/docs/components/modal.md`** (uncommitted): presumed abE2Br_'s Related-cards work; goes with that unit.
- **All Components page (abE2Br_):** `docs/docs/components/index.md` started; ComponentsCategory/ComponentItem Vue port, self-generated thumbnails in `docs/public/related-components/` (no HeroUI CDN images), then Related Components cards on every component page. Its two sidebar lines ("Overview" separator + "All Components (Vue)", by hKWRyJv) go in with this unit only.
- **Theme builder page (vTSDGtr):** utils committed (`ed43c6a`). `docs/.vitepress/theme/themes/ThemesPage.vue` and `docs/themes.md` (layout: themes) in progress; the two `Layout.vue` lines (import + `v-else-if` branch) are removed until the page builds. Acceptance: pixel match vs heroui.com/en/themes at 1440/390 light+dark incl. after changing accent/radius/font; generated CSS byte-identical.
- **Not yet run:** a full `bun run parity` (all components, light+dark) and the visual playground pass (plan Verification 7).
- **Parity lock:** `/tmp/herouse-parity.lock` has been left stale twice; if a run finds it held with no compare/popdiff process alive, remove it.

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
8. **Landing page** (committed `0e3a3ef`). Measured per-cell against heroui.com at 1440 px, light and dark. **Pending:** a pixel diff at 390 px (so far only compared side by side), requested from vTSDGtr. Left out because herouse lacked the components (restored in `e9e4ad0` and later wave 2 commits): Select, Slider, ListBox+Kbd, InputOTP, AvatarGroup demos, Separator lines in the login card. The showcase tab bar stays removed (user decision 2026-10-02: its Dashboard/Mail/Chat/Finances/CRM tabs are HeroUI Pro iframes that heroui.pro refuses to be framed in). Dropped for good unless you decide otherwise: GitHub stars/link, Ask AI, language toggle, Themes/React Native/Blog/Roadmap links, Pro banner, footer About/Contact/Privacy/social links. Also open: no herouse logo (wordmark "HeroUse", avatar fallback "H"), footer "© <year> HeroUse." pending a LICENSE/copyright holder, invented X-profile bio text, HeroUI's placeholder follower counts.
9. **Wave 2 API stand-ins for HeroUI parts** (option A): ToggleButtonGroup and ButtonGroup separators are a `separator` prop on the group, not a `<ToggleButtonGroup.Separator/>` placed in each button. ListBox and Select take `items` (with `{ type: 'section' }` / `{ type: 'separator' }` entries) plus per-item slots. The ListBox Render Function demo has no `render` prop; attributes fall through.
10. **Select multiple-value text** renders as one string where React renders several text nodes: 1-16 px anti-aliasing diff on the disabled and controlled-multiple demos.
11. **Calendar/RangeCalendar week view and day view** (DTT1wRo): Reka always builds full month grids. Options: leave these demos out and document it, or build a custom grid outside Reka for those views.
12. **RangeCalendar anchor-dependent unavailable dates:** Reka's `isDateUnavailable` gets no anchor date. Not parked yet: DTT1wRo is trying a wrapper workaround (track Reka's `update:startValue` and pass an `isDateUnavailable` closure that reads it). It stays open only if that fails.
13. **AvatarGroup count** (option A): HeroUI's `<AvatarGroup.Count>` is a `#count` slot. The count can't take its own size/color/variant; it uses the group's. Table leaves out pagination (until Pagination lands), virtualization and the tanstack-table demo.
14. **TagGroup with-list-data demo** is left out: it needs an EmptyState component, which herouse doesn't have.
15. **Docs search dialog** (being ported to match heroui.com by vTSDGtr): the Web/Native tabs and the Ask AI rows are left out (herouse has no Native docs and no AI agent).
16. **ColorField empty value** (hKWRyJv): React Aria allows an empty ColorField and shows the placeholder. Reka's ColorFieldRoot always holds a colour, so herouse shows `#000000`. That makes `color-field-required` differ by 93 px, and the controlled demo's "Clear" button was dropped. Options: (A) show an empty input when there's no value or defaultValue, while Reka still holds `#000000` internally, so it matches visually but the form value is `#000000`; (B) accept the gap and document it; (C) add null support upstream in Reka.
17. **ColorSwatchPicker** (hKWRyJv; the default is to keep the current behaviour for all four): (a) Reka's item indicator only renders when selected, while HeroUI always renders it and scales it in, so herouse uses a plain span; (b) Reka's root emits `update:modelValue` twice per click, so the component has a same-tick guard (upstream bug candidate); (c) HeroUI's light-colour checkmark selector never matches, and herouse copies that, so the check is always white; (d) items are matched by hex, so items that differ only in alpha collide.
18. **ColorArea** (hKWRyJv; the default is to keep the current behaviour for all four): (a) Reka's ColorAreaRoot adds an extra `role=group` wrapper div, one DOM level more than RAC (parity still passes); options: keep it, make it `display: contents`, or reimplement natively; (b) Reka loses hsb precision when the x axis is hue: `hsb(200,50%,50%)` + ArrowRight gives `hsb(201,67%,56%)`; options: document it, re-apply the channels in the component, or report upstream; (c) Reka's v-model emits a lossy hex string, so the component uses `update:color`; option: emit hex when the model was a string; (d) HeroUI's docs say the default x/y channels are saturation/brightness, but RAC derives them from the colour space, and herouse follows RAC.
19. **ColorSlider** (hKWRyJv; the default is to keep the current behaviour for all four): (a) Reka's slider gradient is hardcoded `to right`, so the component rewrites it to `to top` for vertical sliders; (b) Reka positions the thumb differently from RAC, so the component uses `thumb-alignment="overflow"` plus an inline `top` on the vertical axis; (c) Reka focuses the thumb itself where RAC focuses an inner input, so the theme removes the browser's default focus outline; (d) `v-model` emits a Color object in the channel's colour space instead of Reka's hex string, which would lose the hue on greys.
20. **ColorPicker** (hKWRyJv; the default is to keep the current behaviour for all five): (a) Reka's hsb conversion floors where RAC rounds, so some colours (e.g. `#0485F7`) differ by one channel level; the parity cases use exactly convertible colours; (b) the ColorArea thumb keeps alpha for hsla colours, where HeroUI paints it opaque (affects the with-fields demo); (c) herouse adds `defaultOpen` and `v-model:open`, which RAC doesn't expose; (d) the API is one component with `trigger` and default slots and `side`/`align` instead of `placement`, where HeroUI uses compound parts (option A); (e) ColorField's input dropped `min-w-0` to match HeroUI, so narrow ColorFields clip their input as HeroUI's do.

## Next steps

1. Commit the in-flight units as each peer reports, then delete the leftover scratch files (`.review-shot-tt.ts`, `verify_tooltip_tmp.mjs`, `.probe-tt.ts`).
2. Merge all reports into one decision report for the user (the list above), and get decisions.
3. Run the remaining plan Verification items (full parity light+dark, docs:build + llms, playground visual pass). Consumer smoke **passed** on 2026-10-02 with a real `bun pm pack` tarball. Overnight work is in `next.md`.
4. **All Components page + Related Components cards** (abE2Br_, paused at wind-down, uncommitted). **Done:** `docs/.vitepress/theme/components/{ComponentItem,ComponentsCategory,RelatedComponents}.vue` + `componentPages.ts` (registered in `theme/index.ts`); `docs/docs/components/index.md` (68 cards, renders with no page errors; sidebar entry by hKWRyJv); every component page's Related list converted to `<RelatedComponents>`; `docs/scripts/gen-thumbnails.ts`. **Remaining:** (a) the thumbnail script should use a fixed 2x DPR (HeroUI's PNGs are plain 2x renders) and scale down only when the box overflows the 874x594 canvas; its current `MAX_SCALE` 2.4 / `MAX_CONTENT` cap are wrong; (b) regenerate all 136 PNGs into `docs/public/related-components` (64 exist, made with the wrong scale), with a dev server on :5183 and no docs/ edits during the run; (c) port HeroUI's `StatusChip` (optional frontmatter `status` matching HeroUI's meta) or report it as a known deviation; (d) pixel diff vs heroui.com (`/tmp/allc/pagediff.ts`) and a docs build.

- vTSDGtr (2026-10-02, wind-down) — theme builder `/themes` page unit: UNCOMMITTED, not done. Done: utils (committed ed43c6a); page + composables + controls written under `docs/.vitepress/theme/themes/`, plus `docs/themes.md`, the DesignThemeSelector "Edit theme" link, and 2 lines in Layout.vue (lines 8 and 62). docs build passes, and the code panel CSS matches heroui.com for default. Remains: (1) park runtime font loading (`injectFontLink` / `cdnUrl`): the assignment parks "fonts CDN"; the font-family CSS must stay byte-identical. (2) The undo/redo + popstate in `composables/variables.ts` must not trigger VitePress router reloads (pushState with null state); re-sync `search` on mount. (3) Move `docs/public/themes/` → `public/theme-builder/` (it clashes with the /themes route). (4) design-theme.ts should import presets from `themes/theme-values.ts`. (5) Pixel compare is unfinished: `/tmp/herouse-review/themes/shot.ts`. Its heroui strip step must skip ancestors of `#theme-builder-content`. The preset states don't encode semanticOverrides; check how nuqs infers them.
