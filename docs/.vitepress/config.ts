import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfigWithTheme } from 'vitepress'

import { headingPermalink, markdownConfig, searchRender } from './markdown'
import { sectionLinks, sidebar, type ThemeConfig } from './sidebar'
import { DESIGN_THEME_IDS } from './theme/design-theme'

const componentSlugs = sidebar
  .flatMap(sectionLinks)
  .map((link) => link.link.match(/^\/docs\/components\/([\w-]+)$/)?.[1])
  .filter(Boolean)

const favicon = { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }

export default defineConfigWithTheme<ThemeConfig>({
  title: 'HareUI',
  description: 'Beautiful, fast and modern Vue UI library',
  cleanUrls: true,
  appearance: true,
  ignoreDeadLinks: [new RegExp(`^/docs/components/(${componentSlugs.join('|')})$`)],
  srcExclude: ['THIRD_PARTY_LICENSES.md', 'demos/**'],
  head: [
    ['link', favicon],
    // Restore the docs design-theme preset and vibrant palette before first paint (keys/attributes from HeroUI's utils/design-theme.ts).
    [
      'script',
      {},
      `try{var r=document.documentElement,t=localStorage.getItem('heroui-docs-design-theme');if(t&&t!=='default'&&${JSON.stringify(DESIGN_THEME_IDS)}.indexOf(t)>-1)r.setAttribute('data-design-theme',t);if(localStorage.getItem('heroui-docs-vibrant-palette')==='true')r.setAttribute('data-vibrant-palette','true')}catch(e){}`,
    ],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    anchor: { permalink: headingPermalink },
    config: markdownConfig,
  },
  themeConfig: {
    sidebar,
    search: {
      provider: 'local',
      // SearchDialog renders matched paragraphs from the stored section text.
      options: {
        _render: searchRender,
        miniSearch: { options: { storeFields: ['title', 'titles', 'text'] } },
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      // The dev server's page shell has no `head` entries until the app mounts, so the browser would request
      // /favicon.ico first; built pages carry the icon link already.
      {
        name: 'docs-dev-favicon',
        apply: 'serve',
        transformIndexHtml: () => [{ tag: 'link', attrs: favicon, injectTo: 'head' }],
      },
    ],
    // Tailwind emits `:is()` (never matches) where a variant's nested `&::before` meets a pseudo-element variant
    // (`motion-reduce:before:*`); esbuild's minifier flags that valid selector as a syntax error, lightningcss doesn't.
    build: { cssMinify: 'lightningcss' },
    resolve: {
      // Exact matches: the `@hareui/vue/<entry>` subpaths must not resolve as paths inside `@hareui/vue`.
      // `@/` is the library's internal alias for packages/vue/src, needed because the docs compile the library from source.
      alias: [
        {
          find: /^@hareui\/vue\/(charts|carousel|code-block|command-palette|editor)$/,
          replacement: fileURLToPath(new URL('../../packages/vue/src/$1.ts', import.meta.url)),
        },
        {
          find: /^@hareui\/vue$/,
          replacement: fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)),
        },
        {
          find: /^@\//,
          replacement: fileURLToPath(new URL('../../packages/vue/src/', import.meta.url)),
        },
      ],
    },
  },
})
