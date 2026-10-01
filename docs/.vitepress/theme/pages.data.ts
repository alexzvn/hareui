import { createContentLoader } from 'vitepress'

export interface PageMeta {
  url: string
  title: string
  description: string
}

declare const data: PageMeta[]
export { data }

export default createContentLoader('docs/**/*.md', {
  transform: (pages): PageMeta[] =>
    pages.map((page) => ({
      url: page.url.replace(/\/$/, '') || '/',
      title: String(page.frontmatter.title ?? ''),
      description: String(page.frontmatter.description ?? ''),
    })),
})
