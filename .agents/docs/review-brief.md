# herouse: component docs fidelity review brief

The user wants each component's docs page and demos to match heroui.com to 99.9%, with full support of every official variant and configuration. Only the usage syntax may differ (Vue slots, props or `:ui` instead of React compound parts). They found visible gaps:
- The Card "Usage" demo has the icon and link in a different place and style.
- Card "Horizontal Layout" doesn't lay out horizontally. Our Card wraps the default slot in `card-content`, so `md:flex-row` only ever has one child.
- Tabs looks different from heroui.com: no separators between unselected tabs, and the vertical variant needs checking.
- Button secondary / danger-soft colours. ALREADY DIAGNOSED, not a bug: the user's browser had heroui.com's "Vibrant palette" toggle on (`<html data-vibrant-palette="true">`, localStorage `heroui-docs-vibrant-palette`). With it off, the computed colours are identical. Always compare with it OFF: open heroui.com in a fresh puppeteer profile.

## Setup
- Repo: /Volumes/Workspaces/opensource/herouse. Plan: /tmp/herouse-plan.md. Workflow and rules: /tmp/herouse-batch-brief.md (theme class strings must be literal, etc.).
- Docs dev server: start your own on a unique port (`bun run --cwd docs dev -- --port <port> --strictPort`). Your port is in your assignment message. Stop it when you're done. Don't touch :5173, :5174 or :5199.
- heroui.com pages are at https://heroui.com/en/docs/react/components/<kebab>. Ours are at http://localhost:<port>/docs/components/<kebab>.
- HeroUI sources: mdx at /tmp/heroui/apps/docs/content/docs/en/react/components/(<group>)/<kebab>.mdx; demos at /tmp/heroui/apps/docs/src/demos/en/<kebab>/*.tsx (index.ts lists them).
- The machine is loaded. Use ONE puppeteer browser at a time, with concurrency ≤ 2. Never pkill or kill anything you didn't start.

## Per component, do all of the following
1. **Content diff.** Go section by section: every H2/H3 of the HeroUI mdx in the same order, the same prose (with React syntax rewritten to Vue), and every demo present in the same position. List anything missing, extra or reordered.
2. **Visual diff of every demo.** At a 1440×900 viewport, take light and dark screenshots of each preview card on both sites. Element-screenshot the `.preview` card; pixelmatch at threshold 0.1 is fine, or compare by eye from the saved PNGs. Save them in /tmp/herouse-review/<kebab>/ as `<demo>-{heroui,ours}-{light,dark}.png`. The bar is 99.9%: same layout, sizes, colours, icons, text.
3. **Variant / config coverage.** Every prop, variant value, orientation, size and state in HeroUI's API Reference must exist in herouse, either as a prop or as an obvious Vue equivalent. Check the theme file and the component.
4. **Fix what you can.** Fix it when the cause is:
   - a demo port mistake (wrong markup, wrong icon or classes, missing demo), or
   - a docs content gap, or
   - a theme or component bug inside a single component's files.

   After a theme or component fix, re-run that component's parity: `bun parity/compare.ts --component <c> --concurrency 2`. It must stay all-passed; add a parity case for anything new you fix. You MAY edit `packages/herouse/src/components/<X>.vue` and `src/theme/<x>.ts` for your assigned components. For shared files (`src/index.ts`, `theme/index.ts`), add your own lines only, and re-read the file right before editing.
5. **Do not fix — report instead** — anything that needs an API redesign or a decision. Examples:
   - The slot-based API can't express HeroUI's free composition, like Card children in arbitrary order or a header inside a custom wrapper.
   - A HeroUI component that herouse doesn't have yet (Link, Separator, ButtonGroup, ScrollShadow, Surface…).
   - A Reka UI limitation, like a missing primitive, behaviour or attribute.
   - Anything that would change a public prop or slot name.

   For each one, give: what HeroUI does (file:line), what we do, why we can't match it, and 2–3 concrete options with their tradeoffs.

## Deliverable
Write /tmp/herouse-review/<kebab>.md for each assigned component with these sections:
- **Status:** match %, your honest estimate after fixes.
- **Fixed:** file, change, and evidence (before/after diff px, parity line).
- **Remaining gaps → decisions needed:** classified as API-design / missing-component / reka-limitation / other, each with options.
- **Screenshots:** paths.

Then message mecca://mailbox/gnUc_P1 with the list of report paths and a 3-line summary.
