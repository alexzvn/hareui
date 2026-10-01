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
  - `bun run docs:build` + the llms.txt checks
  - the consumer smoke test (plan Verification 5)
  - the visual playground pass (plan Verification 7)

## Open decisions for the user

Collected from `reviews/*.md` (each has a "Decisions needed" section with options):

1. **Missing components that HeroUI demos use:**
   - Link: 3 card demos use hand-ported markup.
   - Separator: chip/avatar demos use `<hr>`.
   - TextArea: textfield validation/controlled/on-surface and textarea demos are missing.
   - Surface: inlined for now; radio/input "In Surface".
   - SwitchGroup: switch Group / Group Horizontal / Form demos.
   - ButtonGroup: `release-outline-variant`, which appears only in release notes.
2. **Responsive size override:** a plain `h-11` doesn't beat the theme's `md:h-9`. In HeroUI the theme sits in `@layer components`, so a plain utility wins. Options: document it, use CSS-variable heights, or add a `responsive` variant. (`reviews/button.md`.) Related: the checkbox/switch/radio peer already moved some rules to `:where()` / var-driven utilities so user utilities win.
3. **Card title/description inside a custom wrapper become plain markup.** Recommended: document `tv(themes.card)` (`reviews/card.md` §2).
4. **TextField:** input-level attrs (`autofocus`, `maxlength`, `pattern`) land on the root div. No validation layer (`validate`, `validationBehavior`, `validationErrors`) across form components.
5. **Render Function / Render Props / ripple-effect demos.** The plan dropped all three, but they're on heroui.com.
   - Already ported: Button Render Function (`as` prop, `074a98c`), Checkbox and Switch render-props, and Avatar `custom-image-component` (new `#image` slot).
   - Still missing: Button **ripple-effect**, which needs a ripple primitive or new Button API (`reviews/button.md` #4).
6. **Switch label-position** is a pixel-identical CSS workaround (DOM order differs from HeroUI).
7. **Related Showcases** widget on heroui.com component pages: not ported.
8. **API additions made during review that need your sign-off.** All are additive and option A is kept:
   - `readonly` on Checkbox, Switch and RadioGroup
   - `invalid` on Switch
   - slot props on `#description`
   - `data-selected` on radio-content
   - Card `#leading`, Avatar `#image` + img attrs + `loadingStatusChange`
   - Input/TextField `defaultValue` + `readonly`

## Next steps

1. Commit the in-flight units as each peer reports, then delete the leftover scratch files (`.review-shot-tt.ts`, `verify_tooltip_tmp.mjs`, `.probe-tt.ts`).
2. Merge all reports into one decision report for the user (the list above), and get decisions.
3. Run the remaining plan Verification items (full parity light+dark, docs:build + llms, consumer smoke, playground visual pass).
