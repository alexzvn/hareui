import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfigWithTheme } from 'vitepress'
import { headingPermalink, markdownConfig, searchRender } from './markdown'
import { sectionLinks, sidebar, type ThemeConfig } from './sidebar'

const componentSlugs = sidebar
  .flatMap(sectionLinks)
  .map((link) => link.link.match(/^\/docs\/components\/([\w-]+)$/)?.[1])
  .filter(Boolean)

export default defineConfigWithTheme<ThemeConfig>({
  title: 'HeroUse',
  description: 'Beautiful, fast and modern Vue UI library — a Vue port of HeroUI v3',
  cleanUrls: true,
  appearance: true,
  ignoreDeadLinks: [new RegExp(`^/docs/components/(${componentSlugs.join('|')})$`)],
  srcExclude: ['THIRD_PARTY_LICENSES.md', 'demos/**'],
  head: [['link', { rel: 'icon', href: 'data:,' }]],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    anchor: { permalink: headingPermalink },
    config: markdownConfig,
  },
  themeConfig: {
    sidebar,
    search: { provider: 'local', options: { _render: searchRender } },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        herouse: fileURLToPath(new URL('../../packages/herouse/src/index.ts', import.meta.url)),
      },
    },
  },
})
