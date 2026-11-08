import type { ChatSourceItem, ChatSourcePart } from './ChatSource.types'

/** A source with its type settled, as `ChatSource` and `ChatSources` render it. */
export type ResolvedSource = Omit<ChatSourceItem, 'type'> & {
  type: 'url' | 'document'
  key: string
}

const isSourcePart = (source: ChatSourcePart | ChatSourceItem): source is ChatSourcePart => {
  return 'sourceId' in source
}

/** A source part or a hand-written item as one shape: parts map `url` to `href`, documents use the file name as fallback title. */
export const resolveSource = (
  source: ChatSourcePart | ChatSourceItem,
  index: number,
): ResolvedSource => {
  if (!isSourcePart(source)) {
    return {
      ...source,
      type: source.type ?? (source.href ? 'url' : 'document'),
      key: source.href ?? source.title ?? String(index),
    }
  }

  if (source.type === 'source-url') {
    return { type: 'url', href: source.url, title: source.title, key: source.sourceId }
  }

  return { type: 'document', title: source.title || source.filename, key: source.sourceId }
}

/** The hostname without a leading `www.`; empty for a missing or relative URL. */
export const sourceDomain = (href: string | undefined) => {
  if (!href) return ''

  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    // Relative or malformed URLs have no domain to show
    return ''
  }
}
