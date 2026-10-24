import { data as pages } from '../pages.data'

export interface ComponentPage {
  slug: string
  title: string
}

const PREFIX = '/docs/components/'

const bySlug = new Map(
  pages
    .filter((page) => page.url.startsWith(PREFIX))
    .map((page) => [page.url.slice(PREFIX.length), page.title] as const),
)

/** Component pages for the given slugs, in order, skipping slugs HareUI has no page for. */
export function componentPages(slugs: readonly string[]): ComponentPage[] {
  return slugs.flatMap((slug) => {
    const title = bySlug.get(slug)
    return title ? [{ slug, title }] : []
  })
}
