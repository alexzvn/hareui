import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import ChatAttachment from '@/components/chat-attachment/ChatAttachment.vue'
import ChatAttachmentGroup from '@/components/chat-attachment/ChatAttachmentGroup.vue'
import ChatAttachmentInput from '@/components/chat-attachment/ChatAttachmentInput.vue'
import { resolveFileKind } from '@/components/chat-attachment/fileKind'
import type { ChatFilePart } from '@/types/chat'

const imagePart: ChatFilePart = {
  type: 'file',
  mediaType: 'image/png',
  url: 'https://example.com/photo.png',
  filename: 'photo.png',
}

const pdfPart: ChatFilePart = {
  type: 'file',
  mediaType: 'application/pdf',
  url: 'https://example.com/report.pdf',
  filename: 'report.pdf',
}

// A drag event carrying files, built by hand so it doesn't depend on the DOM's DataTransfer support
const dragEvent = (type: string, files: File[]) => {
  const event = new Event(type, { bubbles: true, cancelable: true })

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      types: ['Files'],
      files,
      items: files.map((f) => ({ kind: 'file', type: f.type })),
      dropEffect: 'none',
    },
  })

  return event
}

const dispatch = async (wrapper: ReturnType<typeof mount>, type: string, files: File[]) => {
  wrapper.element.dispatchEvent(dragEvent(type, files))
  await nextTick()
}

describe('chat-attachment', () => {
  it('previews an image part as a media thumbnail', () => {
    const wrapper = mount(ChatAttachment, { props: { part: imagePart } })

    expect(wrapper.attributes('data-variant')).toBe('media')
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/photo.png')
    expect(wrapper.find('img').attributes('alt')).toBe('photo.png')
  })

  it('names a thumbnail in its tooltip, since the hover caption truncates', () => {
    const wrapper = mount(ChatAttachment, { props: { part: imagePart } })

    expect(wrapper.attributes('title')).toBe('photo.png')
  })

  it('renders other files as a card with the name and the extension', () => {
    const wrapper = mount(ChatAttachment, { props: { part: pdfPart } })

    expect(wrapper.attributes('data-variant')).toBe('file')
    expect(wrapper.find('[data-slot=chat-attachment-name]').text()).toBe('report.pdf')
    expect(wrapper.find('[data-slot=chat-attachment-size]').text()).toBe('PDF')
  })

  it('shows the formatted size of a picked file', () => {
    const file = new File(['x'.repeat(2048)], 'notes.txt', { type: 'text/plain' })
    const wrapper = mount(ChatAttachment, { props: { file } })

    expect(wrapper.find('[data-slot=chat-attachment-name]').text()).toBe('notes.txt')
    expect(wrapper.find('[data-slot=chat-attachment-size]').text()).toBe('2 KB')
  })

  it('emits remove from a labelled remove button', async () => {
    const wrapper = mount(ChatAttachment, { props: { part: pdfPart, removable: true } })
    const remove = wrapper.find('[data-slot=chat-attachment-remove]')

    expect(remove.attributes('aria-label')).toBe('Remove report.pdf')

    await remove.trigger('click')

    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('has no remove button unless removable', () => {
    const wrapper = mount(ChatAttachment, { props: { part: pdfPart } })

    expect(wrapper.find('[data-slot=chat-attachment-remove]').exists()).toBe(false)
  })

  it('swaps the icon of a file card for a spinner and shimmers its name while uploading', () => {
    const wrapper = mount(ChatAttachment, { props: { part: pdfPart, status: 'uploading' } })
    const name = wrapper.find('[data-slot=chat-attachment-name]')

    expect(wrapper.attributes('data-status')).toBe('uploading')
    expect(wrapper.find('[data-slot=chat-attachment-spinner]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chat-attachment-icon]').exists()).toBe(false)
    expect(name.find('[data-slot=text-shimmer]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chat-attachment-overlay]').exists()).toBe(false)
    expect(wrapper.find('[aria-live=polite]').text()).toBe('Uploading')
  })

  it('dims a thumbnail behind a spinner while uploading', () => {
    const wrapper = mount(ChatAttachment, { props: { part: imagePart, status: 'uploading' } })

    expect(wrapper.find('[data-slot=chat-attachment-overlay]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=text-shimmer]').exists()).toBe(false)
  })

  it('renders a custom icon in place of the format icon', () => {
    const wrapper = mount(ChatAttachment, { props: { part: pdfPart, icon: 'i-custom-file' } })

    expect(wrapper.find('[data-slot=chat-attachment-icon] span.i-custom-file').exists()).toBe(true)
  })
})

describe('resolveFileKind', () => {
  it('reads the family from the media type', () => {
    expect(resolveFileKind('application/pdf', 'a')).toBe('pdf')
    expect(resolveFileKind('text/csv', 'a')).toBe('spreadsheet')
    expect(resolveFileKind('text/markdown', 'a')).toBe('text')
    expect(resolveFileKind('image/svg+xml', 'a')).toBe('image')
    expect(resolveFileKind('application/msword', 'a')).toBe('document')
  })

  it('falls back to the extension when the type is missing or generic', () => {
    expect(resolveFileKind('', 'budget.XLSX')).toBe('spreadsheet')
    expect(resolveFileKind('application/octet-stream', 'export.json')).toBe('code')
    expect(resolveFileKind('', 'archive.tgz')).toBe('archive')
    expect(resolveFileKind('', 'README')).toBe('file')
  })
})

describe('chat-attachment-group', () => {
  it('renders parts then files and emits remove with the index and the item', async () => {
    const file = new File(['a'], 'draft.md', { type: 'text/markdown' })
    const wrapper = mount(ChatAttachmentGroup, {
      props: { parts: [imagePart], files: [file], removable: true },
    })

    const removes = wrapper.findAll('[data-slot=chat-attachment-remove]')

    expect(wrapper.findAll('[data-slot=chat-attachment]')).toHaveLength(2)

    await removes[1]!.trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[1, file]])
  })

  it('renders items with their own status and emits remove with the item', async () => {
    const items = [
      { name: 'roadmap.pdf', type: 'application/pdf', bytes: 1_258_291 },
      { name: 'budget.xlsx', bytes: 98_304, status: 'uploading' as const },
    ]

    const wrapper = mount(ChatAttachmentGroup, { props: { items, removable: true } })
    const attachments = wrapper.findAll('[data-slot=chat-attachment]')

    expect(attachments.map((a) => a.attributes('data-status'))).toEqual(['idle', 'uploading'])
    expect(attachments[0]!.find('[data-slot=chat-attachment-size]').text()).toBe('1.2 MB')

    await attachments[1]!.find('[data-slot=chat-attachment-remove]').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[1, items[1]]])
  })

  it("lets an item's own removable win over the group's", () => {
    const wrapper = mount(ChatAttachmentGroup, {
      props: {
        items: [{ name: 'notes.md' }, { name: 'brief.pdf', removable: false }],
        removable: true,
      },
    })

    expect(wrapper.findAll('[data-slot=chat-attachment-remove]')).toHaveLength(1)
  })
})

describe('chat-attachment-input', () => {
  const png = new File(['a'], 'a.png', { type: 'image/png' })
  const txt = new File(['b'], 'b.txt', { type: 'text/plain' })

  it('emits the accepted files of a drop', async () => {
    const wrapper = mount(ChatAttachmentInput, { props: { accept: 'image/*' } })

    await dispatch(wrapper, 'drop', [png, txt])

    expect(wrapper.emitted('select')).toEqual([[[png]]])
  })

  it('keeps the first file when multiple is off and ignores drops when disabled', async () => {
    const wrapper = mount(ChatAttachmentInput, { props: { multiple: false } })

    await dispatch(wrapper, 'drop', [png, txt])

    expect(wrapper.emitted('select')).toEqual([[[png]]])

    await wrapper.setProps({ disabled: true })
    await dispatch(wrapper, 'drop', [txt])

    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  it('emits the accepted files of a paste and leaves text pastes alone', async () => {
    const wrapper = mount(ChatAttachmentInput, { props: { accept: 'image/*' } })

    const paste = (files: File[]) => {
      const event = new Event('paste', { bubbles: true, cancelable: true })

      Object.defineProperty(event, 'clipboardData', { value: { files } })
      wrapper.element.dispatchEvent(event)

      return event
    }

    expect(paste([png, txt]).defaultPrevented).toBe(true)
    expect(wrapper.emitted('select')).toEqual([[[png]]])

    expect(paste([]).defaultPrevented).toBe(false)
    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  it('exposes open and the dragging state to its slot', async () => {
    const wrapper = mount(ChatAttachmentInput, {
      slots: {
        default: ({ isDragging }: { isDragging: boolean }) =>
          h('span', isDragging ? 'dragging' : 'idle'),
      },
    })

    expect(wrapper.text()).toBe('idle')

    await dispatch(wrapper, 'dragenter', [png])

    expect(wrapper.text()).toBe('dragging')
    expect(wrapper.attributes('data-dragging')).toBe('true')
  })
})
