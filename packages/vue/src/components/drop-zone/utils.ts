/** Badge colors of the file format icon. */
export type DropZoneFileColor = 'gray' | 'red' | 'green' | 'blue' | 'orange' | 'purple'

const FORMAT_COLORS: Record<string, DropZoneFileColor> = {
  csv: 'green',
  doc: 'blue',
  docx: 'blue',
  fig: 'purple',
  gif: 'green',
  jpeg: 'blue',
  jpg: 'blue',
  json: 'orange',
  mov: 'purple',
  mp3: 'purple',
  mp4: 'purple',
  pdf: 'red',
  png: 'green',
  ppt: 'orange',
  pptx: 'orange',
  svg: 'green',
  ts: 'blue',
  tsx: 'blue',
  txt: 'gray',
  wav: 'purple',
  webp: 'green',
  xls: 'green',
  xlsx: 'green',
  zip: 'orange',
}

/** The extension of a file name, without the dot (`''` when there is none). */
export function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1) : ''
}

/** The badge color for a file extension; `gray` for unknown ones. */
export function formatColor(extension: string): DropZoneFileColor {
  return FORMAT_COLORS[extension.toLowerCase()] ?? 'gray'
}

/** `512 B`, `480 KB`, `2.2 MB`. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function acceptEntries(accept: string | undefined): string[] {
  return (accept ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

function mimeMatches(type: string, entry: string): boolean {
  if (entry === '*' || entry === '*/*') return true
  if (entry.endsWith('/*')) return type.startsWith(entry.slice(0, -1))
  return type === entry
}

/** Whether a file matches an `accept` list of MIME types (`image/*`, `application/pdf`) and extensions (`.pdf`). */
export function matchesAccept(
  file: Pick<File, 'name' | 'type'>,
  accept: string | undefined,
): boolean {
  const entries = acceptEntries(accept)
  if (!entries.length) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return entries.some((entry) =>
    entry.startsWith('.') ? name.endsWith(entry) : mimeMatches(type, entry),
  )
}

/**
 * Whether a drag can be dropped. While dragging, browsers expose each file's MIME type but not its name, so items
 * with an unknown type, or an `accept` list with extensions, are let through and filtered on drop.
 */
export function dragMatchesAccept(
  items: DataTransferItemList | undefined,
  accept: string | undefined,
): boolean {
  const entries = acceptEntries(accept)
  if (!entries.length || !items?.length || entries.some((entry) => entry.startsWith('.')))
    return true
  return Array.from(items).some(
    (item) =>
      item.kind === 'file' &&
      (!item.type || entries.some((entry) => mimeMatches(item.type.toLowerCase(), entry))),
  )
}
