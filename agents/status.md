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
4. **More missing components seen in new demos:** Select (ProgressBar custom-value uses a styled native `<select>`) and Separator (hand-styled again). Reported by vTSDGtr with the ProgressBar unit.
5. **ProgressBar value formatting** follows Reka's ConfigProvider locale (default `en`), not the browser locale like RAC.
6. **Tooltip reka-limitations** (`reviews/tooltip.md`):
   - no `closeDelay` and no focus-only trigger
   - providers are per-instance, so there's no cross-tooltip warm-up
   - positions are integer pixels, up to 0.42 px off RAC; worst hover diff is 0.35 %
7. **Toast custom content** uses one `#toast` slot (`{ content, close }`) in place of HeroUI's ToastContent/Indicator/Title/Description/CloseButton parts (option A, props + slots). Reka Toast primitives aren't used: flat announce queue, no collapsed/expanded stack geometry.
8. **Landing page gaps** (vTSDGtr, in progress): left out because herouse lacks the components: showcase bar (ColorSwatchPicker, theme builder, Pro iframes), Select, Slider, ListBox+Kbd, InputOTP, AvatarGroup demos, Separator lines in the login card. Also dropped: GitHub stars/link, Ask AI, language toggle, Themes/React Native/Blog/Roadmap links, Pro banner, footer About/Contact/Privacy/social links. Footer copyright reads "© <year> HeroUse." pending a LICENSE/copyright holder.

## Next steps

1. Commit the in-flight units as each peer reports, then delete the leftover scratch files (`.review-shot-tt.ts`, `verify_tooltip_tmp.mjs`, `.probe-tt.ts`).
2. Merge all reports into one decision report for the user (the list above), and get decisions.
3. Run the remaining plan Verification items (full parity light+dark, docs:build + llms, playground visual pass). Consumer smoke **passed** on 2026-10-02 with a real `bun pm pack` tarball. Overnight work is in `next.md`.
