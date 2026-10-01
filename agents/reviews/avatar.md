# Avatar — docs fidelity review

## Status

**~99.9% after fixes.** All 7 demos, including the previously missing Custom Image Component, are pixel-identical to heroui.com in light and dark mode (0 px). Section order now matches the mdx. HeroUI's API Reference is covered:

- **Root props:** `size`, `color`, `variant` (`default`/`soft`).
- **Avatar.Image props:** `src`, `alt`, `srcSet`, `sizes`, `loading` and `crossOrigin` map to props, and `asChild` maps to the `#image` slot. `onLoad`/`onError` map to the `loadingStatusChange` emit.
- **Avatar.Fallback props:** `delayMs` maps to a prop, and children to the `#fallback` slot or `fallback` text. Its `color` maps to the root `color`, which only affects the fallback anyway.

| demo | before (light / dark) | after |
|---|---|---|
| basic / sizes / colors / custom-styles | 0 / 0 px | 0 / 0 px |
| variants | 251 / 252 px (person icon 14px vs 16px) | 0 / 0 px |
| fallback | 25 / 26 px (same icon) | 0 / 0 px |
| custom-image-component | missing | 0 / 0 px |

## Fixed

- **`packages/herouse/src/components/Avatar.vue`** (option-A extensions only, nothing renamed):
  - New props `srcset`, `sizes`, `loading`, `crossOrigin` and `referrerPolicy`, forwarded to the `<img>`. Before this, attributes like `loading="lazy"` fell through to the root `<span>`.
  - New emit `loadingStatusChange` (`'idle' | 'loading' | 'loaded' | 'error'`), forwarded from Reka's `AvatarImage`. This is the Vue equivalent of `onLoad`/`onError`.
  - New `#image` slot, the equivalent of `Avatar.Image asChild`. It renders `AvatarImage as-child`, so the slotted element (e.g. `<NuxtImg>`) receives `src`, the `image` classes and the `v-show` loading visibility, while `src` on Avatar drives the fallback.
  - `AvatarEmits` is exported from `src/index.ts` (my line only).
- **Tests:** new `test/avatar.spec.ts` checks that image attributes land on the `<img>` and not the root, and that `#image` replaces the `<img>` while keeping `src` and the theme classes. Together with the card spec, 7/7 tests pass. `bun run --cwd packages/herouse typecheck` is clean.
- **Parity:** new case `avatar-custom-image` (Vue `#image` vs React `Avatar.Image asChild`). `bun parity/compare.ts --component avatar --concurrency 2` → **14/14 cases passed**.
- **`docs/demos/avatar/custom-image-component.vue`** (new): uses the `#image` slot with a plain `<img>`, plus a comment pointing to `<NuxtImg>`/`<UnpicImage>`, since the docs have no Next `Image`.
- **`docs/demos/avatar/variants.vue`, `fallback.vue`**: the `gravity-ui:person` icon is now `width/height="16"`, the gravity-ui default; it was 1em, i.e. 14px.
- **`docs/docs/components/avatar.md`**:
  - Anatomy shows `#image` and `#fallback`.
  - Added the **Custom Image Component** section with HeroUI's prose adapted to Vue, in its original position before Tailwind CSS.
  - The global override example mirrors HeroUI's Global CSS example.
  - The Styling Reference uses HeroUI's descriptions plus the size, variant and colour modifier mapping.
  - Added an **Emits** `ApiTable`. API JSON regenerated: Avatar has 13 props, 2 slots and 1 event.

## Remaining gaps → decisions needed

### 1. other: `color` per fallback
- **HeroUI:** `avatar.tsx:101-110` lets `Avatar.Fallback color` override the root colour.
- **We:** have one `color` prop. It only styles the fallback, so the output is identical; there's just no way to give the fallback a colour separate from the root's `color`, and the root has no colour styles anyway. No action needed unless AvatarGroup is ported (HeroUI's group context feeds `size`/`color`/`variant`). AvatarGroup isn't in this page's demos, so it's out of scope here.

### 2. other: `onLoad`/`onError` event shape
- **HeroUI:** passes the native `SyntheticEvent`.
- **We:** emit `loadingStatusChange(status)`, Reka's model. A native `@load` on the custom `#image` element also works. To mirror HeroUI exactly, add `load`/`error` emits that forward the `<img>` events (small, additive).

No missing-component or Reka gaps. Separator use in the variants demo is reported under chip.md §1.

## Screenshots

`/tmp/herouse-review/avatar/{basic,sizes,colors,variants,fallback,custom-image-component,custom-styles}-{heroui,ours}-{light,dark}.png`
