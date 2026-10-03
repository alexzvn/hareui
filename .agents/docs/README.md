# herouse: agent / maintainer handover

Start here when you pick this project up in a fresh session or from another person.

herouse is a Vue 3 port of HeroUI v3 (`@heroui/react@3.2.6`, the `v3` branch). It has Nuxt-UI-style APIs (props, named slots, `:ui`, `class`, `createHeroUse({ ui })`) and must render **pixel-identical** to HeroUI. It ships with a VitePress docs site that must look identical to heroui.com/docs/react.

## Files in this folder

| File | What |
|---|---|
| [`plan.md`](plan.md) | The approved implementation plan (Steps 1-10, API conventions, CSS->tv translation rules, verification). Authoritative unless `decisions.md` overrides it. |
| [`decisions.md`](decisions.md) | Every user decision made during the discussion, newest overrides first. Read before changing API or scope. |
| [`status.md`](status.md) | What is done, what is in flight, and the open decisions waiting on the user. |
| [`batch-brief.md`](batch-brief.md) | Brief given to peer agents building components (workflow + rules). |
| [`review-brief.md`](review-brief.md) | Brief given to peer agents doing the docs-fidelity review against heroui.com. |
| [`../reviews/`](../reviews/) | Per-component fidelity reports: findings, fixes, and `Decisions needed` sections. |
| Logo editor: [`playground/src/pages/Logo.vue`](../../playground/src/pages/Logo.vue) | Built with HareUI; run `bun run dev` and open `/Logo`. Defaults are the shipped mark (`LOGO_DEFAULTS` in `playground/src/logo/geometry.ts`); "Copy params" gives the JSON that regenerates it. To change the logo, update `LOGO_DEFAULTS` and copy the path it shows into `docs/public/logo.svg` and `docs/.vitepress/theme/components/HareLogo.vue` (keep `transform="rotate(<tilt> 16 16)"`). |

The briefs refer to `/tmp/herouse-plan.md`, `/tmp/herouse-review/*.md`, etc. Those are the same files as `.agents/docs/plan.md` and `.agents/reviews/*`.

## Repo layout

```
packages/herouse/   the library: src/components/<kebab>/{index.ts,<Pascal>.vue,theme.ts,context.ts} (+ sub-parts/helpers owned by that component; index.ts lists the folder's public exports and src/index.ts re-exports it with `export *`), src/components/themes.ts (theme barrel), src/composables + src/utils (shared only), src/styles/*.css (HeroUI tokens), test/*.spec.ts
playground/         Vue dev app (:5173). Also hosts /parity/:id cases.
reference/          React app with @heroui/react 3.2.6 (:5174), renders the same parity cases
parity/             compare.ts (computed-style + pixelmatch diff) and cases/<component>.json
docs/               VitePress site with a custom theme copying fumadocs + heroui.com CSS; demos in docs/demos/<c>/
```

## Commands (bun workspace, run from repo root)

```sh
bun install
bun run typecheck                 # vue-tsc on the library
bun run test                      # vitest specs
bun run build                     # library dist
bun run dev                       # playground :5173   (needed for parity)
bun run reference                 # reference  :5174   (needed for parity)
bun parity/compare.ts --component <name> --concurrency 2   # must print N/N cases passed
bun run docs:dev                  # docs (use `-- --port 51xx --strictPort` for a private port)
bun run docs:build                # docs + llms.txt / llms-full.txt
```

Parity cases live in three places, and each one needs all three: `parity/cases/<c>.json` (ids/actions), `playground/src/parity/cases/<c>.ts` (Vue), `reference/src/cases/<c>.tsx` (React). Pass threshold is 0.1 % of pixels (`maxDiffRatio` default 0.001). **Raising the tolerance is not an acceptable fix.** `ignoreProps` is allowed only with a `reason` and only for an unfixable Reka vs React Aria difference.

## Reference sources (clone if `/tmp` was wiped)

```sh
git clone --depth 1 -b v3 https://github.com/heroui-inc/heroui /tmp/heroui
git clone --depth 1 -b v4 https://github.com/nuxt/ui /tmp/nuxt-ui
git clone --depth 1 https://github.com/unovue/reka-ui /tmp/reka-ui
mkdir -p /tmp/fd && npm pack fumadocs-ui@16.9.3 --pack-destination /tmp/fd && tar -xzf /tmp/fd/fumadocs-ui-16.9.3.tgz -C /tmp/fd
```

Per component: `/tmp/heroui/packages/react/src/components/<c>/<c>.tsx` (structure, data-slot), `/tmp/heroui/packages/styles/components/<c>.css` (styles to translate), docs `/tmp/heroui/apps/docs/content/docs/en/react/components/(<group>)/<c>.mdx` and demos `/tmp/heroui/apps/docs/src/demos/en/<c>/`.

## Working rules (learned the hard way)

- **Comparing against heroui.com:** use a fresh puppeteer profile and set the same `prefers-color-scheme` on both sites. heroui.com's header has a **Theme** menu with a "Vibrant palette" switch, stored in localStorage `heroui-docs-vibrant-palette` (`data-vibrant-palette` on `<html>`). It makes soft foregrounds lighter. The user once had it on, and it looked like a herouse bug. It wasn't. Compare the resolved computed values of real elements, not CSS variable strings. Hide heroui.com's sticky header and chat widget, and freeze animations before screenshots.
- **Machine load:** use at most `--concurrency 2` per parity run and one puppeteer browser per agent. Never `pkill` processes you didn't start; an earlier run killed peers' jobs and left ~190 orphaned Chrome processes. `compare.ts` now closes its browsers on SIGINT/SIGTERM.
- **Git:** make atomic commits, one logical unit each, staged by explicit pathspec (never `git add -A` / `.`). If several agents share the tree, exactly one session commits. The others report a file list and a commit message. If you must commit a partial version of a shared file (`src/index.ts`, `src/components/themes.ts`) while others edit it, stage it with `git update-index --cacheinfo 100644,$(git hash-object -w /tmp/x),<path>` and leave the working file alone.
- **Scratch scripts:** dot-prefixed (`.probe-x.ts`), `pp.ts`, or `*_tmp.*`. All are gitignored. Better still, keep them in `/tmp`.
- **Font:** the playground, reference and docs all load `@fontsource-variable/inter`, the same file heroui.com uses, with `antialiased` and `optimizeLegibility`. Don't add letter-spacing or other overrides to the playground: it must render the pure theme.
- **Multi-agent:** peers are coordinated via mecca (`mecca://guide`, `mecca://sessions`, `mecca://mailbox/<id>`). Replies arrive as notifications, so don't poll or `wait`.
