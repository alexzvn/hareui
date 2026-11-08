import { fileExtension } from '@/components/drop-zone/utils'

/** The family of a file, which picks its icon. */
export type FileKind =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'archive'
  | 'code'
  | 'text'
  | 'file'

// Checked in order: media first (`image/svg+xml` is an image, not code), then the types `text/*` would also match
const MIME_KINDS: [kind: FileKind, pattern: RegExp][] = [
  ['image', /^image\//],
  ['video', /^video\//],
  ['audio', /^audio\//],
  ['pdf', /^application\/pdf$/],
  ['spreadsheet', /spreadsheet|ms-excel|^text\/(csv|tab-separated-values)$/],
  ['document', /wordprocessing|msword|opendocument\.text|rtf/],
  ['archive', /zip|compressed|x-tar|rar|7z/],
  ['code', /json|javascript|typescript|xml|html|css|yaml|x-sh|x-python|sql/],
  ['text', /^text\//],
]

const EXTENSIONS: Record<Exclude<FileKind, 'file'>, string> = {
  image: 'png jpg jpeg gif webp avif heic svg bmp',
  video: 'mp4 mov webm mkv avi',
  audio: 'mp3 wav m4a ogg flac aac',
  pdf: 'pdf',
  spreadsheet: 'xls xlsx ods csv tsv numbers',
  document: 'doc docx odt rtf pages',
  archive: 'zip rar 7z tar gz tgz',
  code: 'js mjs ts jsx tsx vue svelte json html css scss xml yml yaml py rb go rs java kt swift c h cpp cs php sh sql',
  text: 'txt md markdown log',
}

const EXTENSION_KINDS = new Map(
  Object.entries(EXTENSIONS).flatMap(([kind, list]) =>
    list.split(' ').map((extension) => [extension, kind as FileKind] as const),
  ),
)

/** Resolves a file's family from its media type, or from its extension when the type is missing or generic. */
export const resolveFileKind = (type: string, name: string): FileKind => {
  const byType = MIME_KINDS.find(([, pattern]) => pattern.test(type))

  if (byType) return byType[0]

  return EXTENSION_KINDS.get(fileExtension(name).toLowerCase()) ?? 'file'
}
