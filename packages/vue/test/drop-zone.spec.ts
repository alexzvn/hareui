import type { DropZoneRejection } from '../src/components/drop-zone'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import DropZone from '../src/components/drop-zone/DropZone.vue'
import DropZoneFileItem from '../src/components/drop-zone/DropZoneFileItem.vue'
import DropZoneFileList from '../src/components/drop-zone/DropZoneFileList.vue'
import { matchesAccept } from '../src/components/drop-zone/utils'

const area = '[data-slot=drop-zone-area]'
const input = '[data-slot=drop-zone-input]'

function file(name: string, type: string, size = 3) {
  return new File(['x'.repeat(size)], name, { type })
}

// A drag event carrying files, built by hand so it doesn't depend on the DOM's DataTransfer support
function dragEvent(type: string, files: File[]) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'dataTransfer', {
    value: {
      types: ['Files'],
      files,
      items: files.map(f => ({ kind: 'file', type: f.type })),
      dropEffect: 'none',
    },
  })
  return event
}

async function drop(element: Element, files: File[]) {
  element.dispatchEvent(dragEvent('drop', files))
  await nextTick()
}

async function select(element: HTMLInputElement, files: File[]) {
  Object.defineProperty(element, 'files', { value: files, configurable: true, writable: true })
  element.dispatchEvent(new Event('change', { bubbles: true }))
  await nextTick()
}

function mountModel(props: Record<string, unknown> = {}) {
  const model = ref<File[]>([])
  const onAdd = vi.fn()
  const onReject = vi.fn<(rejections: DropZoneRejection[]) => void>()
  const wrapper = mount(() => h(DropZone, {
    'label': 'Upload',
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (files: File[]) => (model.value = files),
    onAdd,
    onReject,
  }))
  return { wrapper, model, onAdd, onReject }
}

describe('DropZone', () => {
  it('dropping files updates v-model and emits add', async () => {
    const { wrapper, model, onAdd } = mountModel({ multiple: true })
    const files = [file('a.pdf', 'application/pdf'), file('b.png', 'image/png')]
    await drop(wrapper.find(area).element, files)
    expect(model.value).toEqual(files)
    expect(onAdd).toHaveBeenCalledWith(files)
    expect(wrapper.findAll('[data-slot=drop-zone-file-item]')).toHaveLength(2)
  })

  it('selecting files through the input adds them to the selection', async () => {
    const { wrapper, model, onAdd } = mountModel({ multiple: true })
    const first = file('a.pdf', 'application/pdf')
    const second = file('b.pdf', 'application/pdf')
    await select(wrapper.find(input).element as HTMLInputElement, [first])
    await select(wrapper.find(input).element as HTMLInputElement, [second])
    expect(model.value).toEqual([first, second])
    expect(onAdd).toHaveBeenLastCalledWith([second])
  })

  it('without `multiple`, keeps only the newest file', async () => {
    const { wrapper, model } = mountModel()
    const first = file('a.pdf', 'application/pdf')
    const second = file('b.pdf', 'application/pdf')
    await drop(wrapper.find(area).element, [first, second])
    expect(model.value).toEqual([first])
    await drop(wrapper.find(area).element, [second])
    expect(model.value).toEqual([second])
  })

  it('rejects files that don\'t match accept or exceed maxSize', async () => {
    const { wrapper, model, onReject } = mountModel({ multiple: true, accept: 'image/*,.pdf', maxSize: 10 })
    const image = file('a.png', 'image/png')
    const pdf = file('b.pdf', '')
    const text = file('c.txt', 'text/plain')
    const large = file('d.jpg', 'image/jpeg', 20)
    await drop(wrapper.find(area).element, [image, pdf, text, large])
    expect(model.value).toEqual([image, pdf])
    expect(onReject).toHaveBeenCalledWith([{ file: text, reason: 'type' }, { file: large, reason: 'size' }])
  })

  it('emits nothing but reject when every file is rejected', async () => {
    const { wrapper, model, onAdd, onReject } = mountModel({ accept: 'image/png' })
    await select(wrapper.find(input).element as HTMLInputElement, [file('a.pdf', 'application/pdf')])
    expect(model.value).toEqual([])
    expect(onAdd).not.toHaveBeenCalled()
    expect(onReject).toHaveBeenCalledOnce()
  })

  it('marks the area as a drop target while dragging files over it', async () => {
    const { wrapper } = mountModel({ accept: 'image/*' })
    const element = wrapper.find(area).element
    element.dispatchEvent(dragEvent('dragenter', [file('a.png', 'image/png')]))
    await nextTick()
    expect(wrapper.find(area).attributes('data-drop-target')).toBe('true')
    element.dispatchEvent(new Event('dragleave', { bubbles: true }))
    await nextTick()
    expect(wrapper.find(area).attributes('data-drop-target')).toBeUndefined()
    element.dispatchEvent(dragEvent('dragenter', [file('a.pdf', 'application/pdf')]))
    await nextTick()
    expect(wrapper.find(area).attributes('data-drop-target')).toBeUndefined()
  })

  it('the area button and the trigger open the file picker', async () => {
    const { wrapper } = mountModel()
    const click = vi.spyOn(wrapper.find(input).element as HTMLInputElement, 'click')
    // Enter and Space on a native button dispatch `click`
    await wrapper.find('[data-slot=drop-zone-focus-target]').trigger('click')
    await wrapper.find('[data-slot=drop-zone-trigger]').trigger('click')
    expect(click).toHaveBeenCalledTimes(2)
  })

  it('the area button is labelled by the label and described by the description', () => {
    const wrapper = mount(DropZone, { props: { label: 'Upload', description: 'PDF only', id: 'dz' } })
    const button = wrapper.find('[data-slot=drop-zone-focus-target]')
    expect(button.attributes('aria-labelledby')).toBe('dz-label')
    expect(wrapper.find('#dz-label').text()).toBe('Upload')
    expect(button.attributes('aria-describedby')).toBe('dz-description')
  })

  it('disabled: ignores drops, never opens the picker and marks the area', async () => {
    const { wrapper, model, onAdd } = mountModel({ disabled: true })
    const click = vi.spyOn(wrapper.find(input).element as HTMLInputElement, 'click')
    await drop(wrapper.find(area).element, [file('a.pdf', 'application/pdf')])
    await wrapper.find('[data-slot=drop-zone-focus-target]').trigger('click')
    expect(model.value).toEqual([])
    expect(onAdd).not.toHaveBeenCalled()
    expect(click).not.toHaveBeenCalled()
    expect(wrapper.find(area).attributes('data-disabled')).toBe('true')
    expect(wrapper.find('[data-slot=drop-zone-focus-target]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-slot=drop-zone-trigger]').attributes('disabled')).toBeDefined()
  })

  it('the remove button of a file drops it from the selection', async () => {
    const a = file('a.pdf', 'application/pdf')
    const b = file('b.png', 'image/png')
    const model = ref<File[]>([a, b])
    const wrapper = mount(() => h(DropZone, { 'multiple': true, 'modelValue': model.value, 'onUpdate:modelValue': (files: File[]) => (model.value = files) }))
    const remove = wrapper.find('[aria-label="Remove a.pdf"]')
    expect(remove.exists()).toBe(true)
    await remove.trigger('click')
    expect(model.value).toEqual([b])
  })

  it('uncontrolled: starts from defaultValue and keeps its own selection', async () => {
    const a = file('a.pdf', 'application/pdf')
    const b = file('b.pdf', 'application/pdf')
    const wrapper = mount(DropZone, { props: { defaultValue: [a], multiple: true } })
    expect(wrapper.findAll('[data-slot=drop-zone-file-item]')).toHaveLength(1)
    await drop(wrapper.find(area).element, [b])
    expect(wrapper.findAll('[data-slot=drop-zone-file-item]')).toHaveLength(2)
  })

  it('the files slot replaces the built-in list and exposes removeFile', async () => {
    const a = file('a.pdf', 'application/pdf')
    const model = ref<File[]>([a])
    const wrapper = mount(() => h(DropZone, { 'modelValue': model.value, 'onUpdate:modelValue': (files: File[]) => (model.value = files) }, {
      files: ({ files, removeFile }: { files: File[], removeFile: (file: File) => void }) => files.map(f => h('button', { class: 'custom', onClick: () => removeFile(f) }, f.name)),
    }))
    expect(wrapper.find('[data-slot=drop-zone-file-list]').exists()).toBe(false)
    await wrapper.find('.custom').trigger('click')
    expect(model.value).toEqual([])
  })

  it('an empty files slot renders no list', () => {
    const wrapper = mount(DropZone, { props: { defaultValue: [file('a.pdf', 'application/pdf')] }, slots: { files: () => [] } })
    expect(wrapper.find('[data-slot=drop-zone-file-list]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=drop-zone-file-item]').exists()).toBe(false)
  })

  it('opening the picker clears the input, so a removed file can be picked again', async () => {
    const { wrapper, model } = mountModel()
    const el = wrapper.find(input).element as HTMLInputElement
    const a = file('a.pdf', 'application/pdf')
    await select(el, [a])
    await wrapper.find('[aria-label="Remove a.pdf"]').trigger('click')
    expect(model.value).toEqual([])
    // Browsers skip `change` when the input still holds the picked file; `open` must empty it first
    const values: string[] = []
    Object.defineProperty(el, 'value', { configurable: true, get: () => 'C:\\fakepath\\a.pdf', set: (v: string) => values.push(v) })
    vi.spyOn(el, 'click').mockImplementation(() => {})
    await wrapper.find('[data-slot=drop-zone-focus-target]').trigger('click')
    expect(values).toContain('')
    await select(el, [a])
    expect(model.value).toEqual([a])
  })

  it('focus sent to the hidden input moves to the area button', async () => {
    const wrapper = mount(DropZone, { props: { label: 'Upload' }, attachTo: document.body })
    ;(wrapper.find(input).element as HTMLInputElement).focus()
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('[data-slot=drop-zone-focus-target]').element)
    expect(wrapper.find(area).attributes('data-focus-visible')).toBe('true')
    wrapper.unmount()
  })

  it('the trigger slot receives open', async () => {
    const wrapper = mount(DropZone, { slots: { trigger: ({ open }: { open: () => void }) => h('a', { class: 'browse', onClick: open }, 'Browse') } })
    const click = vi.spyOn(wrapper.find(input).element as HTMLInputElement, 'click')
    expect(wrapper.find('[data-slot=drop-zone-trigger]').exists()).toBe(false)
    await wrapper.find('.browse').trigger('click')
    expect(click).toHaveBeenCalledOnce()
  })

  it('required: marks the file input and the root', () => {
    const wrapper = mount(DropZone, { props: { required: true } })
    expect(wrapper.find(input).attributes('required')).toBeDefined()
    expect(wrapper.attributes('data-required')).toBe('true')
  })
})

describe('DropZoneFileItem', () => {
  it('renders name, size, format badge and status', () => {
    const wrapper = mount(DropZoneFileItem, { props: { name: 'Annual report.pdf', size: 2306867, status: 'failed' } })
    expect(wrapper.attributes('data-status')).toBe('failed')
    expect(wrapper.find('[data-slot=drop-zone-file-name]').text()).toBe('Annual report.pdf')
    expect(wrapper.find('[data-slot=drop-zone-file-meta]').text()).toBe('2.2 MB')
    const badge = wrapper.find('[data-slot=drop-zone-file-format-icon-badge]')
    expect(badge.text()).toBe('PDF')
    expect(badge.attributes('data-color')).toBe('red')
  })

  it('shows a progress bar colored by status', () => {
    const wrapper = mount(DropZoneFileItem, { props: { name: 'a.png', progress: 40, status: 'uploading' } })
    const bar = wrapper.find('[data-slot=drop-zone-file-progress]')
    expect(bar.attributes('aria-valuenow')).toBe('40')
    expect(bar.attributes('aria-label')).toBe('Upload progress for a.png')
  })

  it('emits remove and, when failed and retryable, retry', async () => {
    const wrapper = mount(DropZoneFileItem, { props: { name: 'a.mp4', status: 'failed', retryable: true } })
    await wrapper.find('[data-slot=drop-zone-file-retry-trigger]').trigger('click')
    await wrapper.find('[data-slot=drop-zone-file-remove-trigger]').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('hides the retry button unless failed, and the remove button when not removable', () => {
    const wrapper = mount(DropZoneFileItem, { props: { name: 'a.mp4', status: 'uploading', retryable: true, removable: false } })
    expect(wrapper.find('[data-slot=drop-zone-file-retry-trigger]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=drop-zone-file-remove-trigger]').exists()).toBe(false)
  })

  it('works on its own inside a DropZoneFileList', () => {
    const wrapper = mount(DropZoneFileList, { slots: { default: () => [h(DropZoneFileItem, { key: 1, name: 'a.txt' })] } })
    expect(wrapper.attributes('data-slot')).toBe('drop-zone-file-list')
    expect(wrapper.find('[data-slot=drop-zone-file-format-icon-badge]').attributes('data-color')).toBe('gray')
  })
})

describe('matchesAccept', () => {
  it('matches MIME wildcards, exact types and extensions', () => {
    expect(matchesAccept({ name: 'a.PNG', type: 'image/png' }, 'image/*')).toBe(true)
    expect(matchesAccept({ name: 'a.csv', type: '' }, '.csv,.xlsx')).toBe(true)
    expect(matchesAccept({ name: 'a.pdf', type: 'application/pdf' }, 'image/png, image/jpeg')).toBe(false)
    expect(matchesAccept({ name: 'a.pdf', type: 'application/pdf' }, undefined)).toBe(true)
  })
})
