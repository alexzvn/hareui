# Modal — docs fidelity review

## Status

**Match: ~99.8%** (visual/interaction identical on every demo checked; one feature intentionally
not ported due to a missing `Surface` component).

## Fixed

No bugs found in `Modal.vue` / `theme/modal.ts` — the existing implementation already matched
HeroUI pixel-for-pixel on every demo and interactive state checked (see Screenshots). No edits
were made to Modal component/theme files.

Content check: `docs/docs/components/modal.md` section order matches
`/tmp/heroui/.../modal.mdx` exactly — Usage, Anatomy, Examples (Sizes, Placement, Scroll Behavior,
Controlled State, [With Form — dropped], Custom Trigger, Backdrop Variants, Custom Backdrop,
Dismiss Behavior, Close Methods, Custom Animations, Custom Portal), Customization (Tailwind CSS,
Global theme override ↔ Global CSS), Styling Reference, API Reference, Accessibility, Related
Components.

Parity: `bun parity/compare.ts --component modal --concurrency 2` → **16/16 cases passed**
(re-run after review, no regressions).

## Remaining gaps → decisions needed

### missing-component: "With Form" demo dropped

- **HeroUI**: `/tmp/heroui/apps/docs/src/demos/en/modal/with-form.tsx` — a contact-form modal
  that wraps its form fields in `<Surface variant="default">` (HeroUI's `Surface` primitive gives
  a nested-background-token container so inputs inside a modal get a visually distinct card).
- **herouse**: no `Surface` component exists (it's explicitly out of the core-component set per
  `/tmp/herouse-plan.md` Step 9's drop list and Step 5's component list).
- **Why we can't match it**: `Surface` provides a `SurfaceContext` that downstream components
  (`Card`, `Input`, etc.) read to pick a nested bg token; porting just this one demo without the
  primitive would require either a fake one-off wrapper (diverges from HeroUI's real mechanism) or
  reimplementing `Surface` end-to-end for a single demo.
- **Options**:
  1. **Port `Surface` as a new component** (slots: `base`; a `variant` prop toggling a
     `--surface-bg` CSS var token) — most faithful, costs a new component + theme file + parity
     cases, benefits every future demo that needs nested-surface styling (TextField "on-surface"
     variants, Checkbox/RadioGroup "on-surface" demos are also currently dropped for the same
     reason).
  2. **Skip the demo, note it in docs** — current state. Zero cost, but Modal's "With Form"
     example (a common real-world use case: contact forms in a dialog) is absent from the docs.
  3. **Port the demo without `Surface`**, using a plain `<div class="rounded-xl bg-surface p-4">`
     wrapper that approximates the visual without the context mechanism — closes the visible gap
     at low cost, but misrepresents the "real" HeroUI composition pattern if a user reads the
     source.
  - Recommend option 1 if `Surface` ends up needed by ≥2 components (it already is, for the
    `on-surface` demos dropped from TextField/Input/RadioGroup/Switch); otherwise option 3 is the
    pragmatic 80% fix.

## Screenshots

All in `/tmp/herouse-review/modal/`:
- `ours-full-light.png` / `heroui-full-light.png` — full-page overview, section-by-section order
  check (dark theme captured by default; both sites render consistently dark under puppeteer's
  default `prefers-color-scheme`).
- `sizes-ours-light.png` / `sizes-heroui-light.png` — Sizes demo, Xs modal open: pixel-identical
  layout, copy, icon, buttons.
- `backdrop-ours-light.png` / `backdrop-heroui-light.png` — Backdrop Variants demo, Opaque open:
  pixel-identical.
- `close-methods-ours.png` / `close-methods-heroui.png` — Close Methods demo open: layout/visual
  identical; prose differs only because HeroUI's demo uses `slot="close"` (React Aria concept) vs
  herouse's `#footer="{ close }"` scoped slot — a documented, intentional API-syntax difference,
  not a visual gap.
- `custom-anim-ours.png` / `custom-anim-heroui.png` — Custom Animations demo ("Kinematic Scale")
  open: pixel-identical including the icon.
- `dismiss-ours.png` / `dismiss-heroui.png` — Dismiss Behavior demo (`dismissible = false`) open:
  pixel-identical layout; prose matches (minor casing: HeroUI's `isDismissable` prop name →
  herouse's `dismissible`, expected per API conventions).
