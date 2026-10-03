# docs-site fidelity review: chrome + Getting Started / Handbook

## Status
- Chrome (header, tabs, sidebar, drawer, TOC, page header, footer, tables, code blocks, preview cards): about 98%. Element geometry, typography and colours match on /docs/getting-started/, /quick-start and /components/button at 1440×900 and 390×844, light and dark. Remaining differences are features HeroUI has and we don't port (listed below).
- Content (11 pages): about 95%. Every heading section that has a Vue equivalent is present and in HeroUI's order. The omissions are listed below.

Method: computed-style and rect diffs of matching elements (`/tmp/herouse-review/{chrome,tree,chain}.ts`). Fresh puppeteer profile, `data-vibrant-palette` removed.
Measurement noise to ignore: heroui.com has a 32px banner above the header, so every y value is offset by 32. `lab()` vs `oklch()` are the same colours in different serialisation. The font family is "Inter" (next/font) on theirs and "Inter Variable" on ours, the same face.

## Fixed
- `docs/.vitepress/sidebar.ts` and `theme/components/SidebarItems.vue`: the Components sidebar now matches HeroUI's `components/meta.json`. That is one flat alphabetical list under a "Components" separator, with no collapsible groups (HeroUI renders `<p>` separators and no `<button>`/`[data-state]`). Item heights are 36px (drawer 39px), the same as HeroUI. The old SidebarGroup type and collapsible code were removed, and `docs/scripts/gen-llms.ts` now uses `sectionLinks`. Prev/next on component pages follows the alphabetical order, as on HeroUI.
  - Note: this departs from plan Step 9 ("collapsible groups"), because heroui.com itself is flat.
- `docs/.vitepress/markdown.ts`: markdown tables are wrapped in `div.relative.overflow-auto.prose-no-margin.my-6`, which is what fumadocs' `Table` mdx component renders. Before: table bg `rgb(249,249,249)`, 1px border, 28px margin, square `th`. After: transparent, no border, `th` with 12px rounded ends and `bg-default/50`, the same as HeroUI.
- `docs/.vitepress/theme/Layout.vue`: the mobile drawer is ported 1:1 from heroui.com's live DOM:
  - fixed overlay `backdrop-blur-xs` (the bg-black/30 is gone)
  - aside `text-[0.9375rem]` with no `border-s`
  - header `sm:hidden` with a separator `<hr>`
  - masked viewport, and a framework-tabs footer
  - the extra "Getting Started / Components" links block is removed, because HeroUI switches sections from the header tabs
- ColorSection port: Vue versions of HeroUI's `ColorSectionSideBySide`, `ColorSectionStacked`, `ColorSectionPrimitive` and `ColorSectionFormField`, plus `CollapsibleCode` (culori ^4.0.2, the version HeroUI uses).
  - colors.md: all colour tables replaced by these components.
  - colors.md "Default Theme" and theming.md "Variables Reference": now collapsed code blocks containing the full variables.css and theme.css.
  - Accent section pixelmatch vs heroui.com: about 1% diff (font anti-aliasing).
  - Build passes.
- Theme selector (user request): see the separate mailbox message.
  Rects now match: aside 332×900, header 67px, hr at y=66, separator 23px.
- Content (subagents GsContentA/B, checked against `packages/herouse/src`):
  - index: "garden" sentence; "Is it production-ready?" FAQ
  - design-principles: Uber Base attribution
  - frameworks: "Next Steps" with 4 links
  - colors: Default Theme and Customizing Colors sections; Border merged into Other
  - theming: Adding Custom Colors, Variables Reference, Scrollbars, Vibrant Palette
  - styling: Scrollbars, Extending Component Themes, Responsive Design, CSS Modules
  - composition: Custom Components, Custom Variants
  - `bun run --cwd docs build` passed after these edits.
- In progress (subagent ColorSectionPort): Vue ports of HeroUI's `ColorSection*` swatch components and `CollapsibleCode`, used on colors.md and theming.md. Our pages currently show plain markdown tables there.

## Remaining gaps → decisions needed

1. **Components "Overview / All Components" index page** (missing-component/other). HeroUI's sidebar starts with an Overview separator and an "All Components" page. We have no components index page, and that page sits in the component-pages area another peer owns.
   - A: add `docs/docs/components/index.md` with a card grid of the 18 components. Matches HeroUI. Needs the card markup from HeroUI's components index.mdx.
   - B: leave it out. The sidebar starts directly with "Components".
2. **Sidebar "New" / "Updated" badges** (other). HeroUI tags some items.
   - A: add an optional `badge` field to sidebar entries, using the same chip classes as HeroUI.
   - B: skip. Badges are about HeroUI's release history, which says nothing about herouse.
3. **Getting Started entries with no herouse counterpart** (other): CLI, Showcase, Roadmap, Figma, MCP Server, Agent Skills, AGENTS.md.
   - A: leave them out (current).
   - B: link out to HeroUI's Figma file, since the tokens are the same.
4. **Header items not ported** (other): HeroUI logo (brand), Ask AI, language picker, GitHub link (there is no `git remote`), version selector. Add the GitHub link once the repo URL exists.
8. **Copy feedback on colour swatches** (missing-component). HeroUI shows `toast.success`, but herouse has no Toast, so we flash an outline pulse on the swatch instead.
   - A: add a herouse Toast and switch to it.
   - B: keep the pulse.
9. **llms.txt has lost the colour data** (regression, needs a decision). `docs/scripts/gen-llms.ts` strips Vue tags, so the colour variable names and values and the full variables.css/theme.css dumps are missing from llms-full.txt. Only the prose survives.
   - A (recommended): teach gen-llms to render `ColorSection*` `:colors` and `CollapsibleCode` `:code` as a markdown table or fence.
   - B: accept prose-only llms output.
5. **Community sections**: "Get Involved" (index.mdx) and "Contributing" (llms-txt.mdx). There is no public repo, Discord or CONTRIBUTING file.
   - A: leave out until a repo exists (current).
   - B: add Issues-only sections once the URL is known.
6. **Sections dropped because they are React-only or HeroUI-only.** No Vue equivalent exists:
   - quick-start: CopyPrompt/MCP block
   - frameworks: Next.js, React Router, the @heroui/styles "Other frameworks" install steps
   - dark-mode: next-themes, useTheme
   - styling: Render Props, BEM, CSS-in-JS, Component Classes Reference
   - animation: Framer Motion
   - composition: Compound Components (replaced by slots, per the user's decision), framework-agnostic and polymorphic sections
   - theming: Import Strategies (herouse has no per-component CSS subpath exports)
   - llms-txt: llms-components/patterns files

   Decision only needed if you want stand-ins, for example "Import Strategies" once per-component CSS exports exist.
7. **colors.md "Other" table**: our table has an extra "Focus" row and Border Secondary/Tertiary rows that HeroUI's stacked section doesn't have. The ColorSectionPort subagent is told to mirror HeroUI exactly.

## Screenshots
/tmp/herouse-review/docs-site/{getting-started,quick-start,button}-{1440,390}-{light,dark}-{heroui,ours}.png (taken before the fixes)
