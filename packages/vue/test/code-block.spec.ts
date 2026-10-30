import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

import CodeBlock from '@/components/code-block/CodeBlock.vue'
import { toLineSet, toPlainLines } from '@/components/code-block/highlight'

import { expectAccessible } from './a11y'

const SNIPPET = 'const total = 3\nconsole.log(total)\n'

const writeText = vi.fn<(text: string) => Promise<void>>()

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-slot=code-block]')
const code = (wrapper: ReturnType<typeof mount>) => wrapper.get('pre').element.textContent
const lines = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-slot=code-block-line]')
const copyButton = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-slot=code-block-copy]')

const waitForHighlight = async (wrapper: ReturnType<typeof mount>) => {
  await vi.waitFor(() => expect(root(wrapper).attributes('data-syntax')).toBe('highlighted'), {
    timeout: 10_000,
  })
}

describe('CodeBlock', () => {
  it('renders the code as plain text before highlighting', () => {
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, lang: 'ts' } })

    expect(root(wrapper).attributes('data-syntax')).toBe('plain')
    expect(code(wrapper)).toBe('const total = 3console.log(total)')
    expect(lines(wrapper)).toHaveLength(2)
  })

  it('escapes markup in the code', () => {
    const wrapper = mount(CodeBlock, { props: { code: '<b onclick="x()">bold</b>' } })

    expect(wrapper.find('pre b').exists()).toBe(false)
    expect(code(wrapper)).toBe('<b onclick="x()">bold</b>')
  })

  it('highlights the code with both color schemes once shiki loads', async () => {
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, lang: 'ts' } })
    await waitForHighlight(wrapper)

    const keyword = wrapper.findAll('pre span[style]').find((span) => span.text() === 'const')!
    expect(keyword.attributes('style')).toContain('--shiki-light')
    expect(keyword.attributes('style')).toContain('--shiki-dark')
    expect(code(wrapper)).toBe('const total = 3console.log(total)')
  }, 15_000)

  it('shows the new code as plain text until its highlight lands', async () => {
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, lang: 'ts' } })
    await waitForHighlight(wrapper)
    await wrapper.setProps({ code: 'let next = 1' })

    expect(root(wrapper).attributes('data-syntax')).toBe('plain')
    expect(code(wrapper)).toBe('let next = 1')
    await waitForHighlight(wrapper)
    expect(code(wrapper)).toBe('let next = 1')
  }, 15_000)

  it('keeps plain text and warns for an unknown language', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, lang: 'not-a-language' } })

    await vi.waitFor(() => expect(consoleWarn).toHaveBeenCalled(), { timeout: 10_000 })
    expect(root(wrapper).attributes('data-syntax')).toBe('plain')
    expect(code(wrapper)).toBe('const total = 3console.log(total)')
    consoleWarn.mockRestore()
  }, 15_000)

  it('renders the language in the header, or the filename when set', async () => {
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, lang: 'ts' } })
    expect(wrapper.get('[data-slot=code-block-header]').text()).toBe('ts')

    await wrapper.setProps({ filename: 'src/total.ts' })
    expect(wrapper.get('[data-slot=code-block-header]').text()).toBe('src/total.ts')
  })

  it('renders the icon prop before the header label', () => {
    const FileIcon = { render: () => h('svg', { 'data-testid': 'file-icon' }) }
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, filename: 'a.ts', icon: FileIcon } })

    expect(wrapper.find('[data-slot=code-block-header] [data-testid=file-icon]').exists()).toBe(
      true,
    )
  })

  it('hides the header with hideHeader but keeps the copy button', () => {
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, hideHeader: true } })

    expect(wrapper.find('[data-slot=code-block-header]').exists()).toBe(false)
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copy code')
  })

  it('marks the lines and ranges listed in highlight', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: 'a\nb\nc\nd\ne', highlight: [1, [3, 4]] },
    })

    const marked = lines(wrapper).map((line) => line.attributes('data-highlighted') === 'true')
    expect(marked).toEqual([true, false, true, true, false])
  })

  it('scrolls long lines sideways in a horizontal scroll shadow', () => {
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET } })

    const code = wrapper.get('[data-slot=code-block-code]')
    expect(code.attributes('data-orientation')).toBe('horizontal')
    expect(code.attributes('data-scroll-shadow-mode')).toBe('auto')
  })

  it('numbers each line with hidden, unselectable numbers when lineNumbers is set', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'a\nb\nc', lineNumbers: true } })

    const numbers = wrapper.findAll('[data-slot=code-block-line-number]')
    expect(numbers.map((number) => number.text())).toEqual(['1', '2', '3'])
    expect(numbers.every((number) => number.attributes('aria-hidden') === 'true')).toBe(true)
  })

  it('copies the code and shows the copied state for the duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, copy: { duration: 1000 } } })

    await copyButton(wrapper).trigger('click')
    await nextTick()
    expect(writeText).toHaveBeenCalledWith(SNIPPET)
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copied')
    expect(copyButton(wrapper).attributes('data-copied')).toBe('true')

    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copy code')
  })

  it('stays in the idle state when the clipboard refuses the write', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET } })

    await copyButton(wrapper).trigger('click')
    await nextTick()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copy code')
  })

  it('takes custom copy labels', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: SNIPPET, copy: { label: 'Copy snippet', copiedLabel: 'Snippet copied' } },
    })

    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copy snippet')
    await copyButton(wrapper).trigger('click')
    await nextTick()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Snippet copied')
  })

  it('renders no copy button when copy is false', () => {
    const wrapper = mount(CodeBlock, { props: { code: SNIPPET, copy: false } })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('passes the copy state and action to the header and copy slots', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: SNIPPET, lang: 'ts', filename: 'total.ts' },
      slots: {
        header: ({ lang, filename }: { lang: string; filename?: string }) =>
          h('strong', `${filename} (${lang})`),
        copy: ({ copied, copy }: { copied: boolean; copy: () => Promise<void> }) =>
          h('button', { type: 'button', onClick: copy }, copied ? 'Done' : 'Copy'),
      },
    })

    expect(wrapper.get('[data-slot=code-block-header]').text()).toBe('total.ts (ts)')
    await wrapper.get('button').trigger('click')
    await nextTick()
    expect(writeText).toHaveBeenCalledWith(SNIPPET)
    expect(wrapper.get('button').text()).toBe('Done')
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: SNIPPET, lang: 'ts', lineNumbers: true, highlight: [1] },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
  })

  it('renders plain code on the server', async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(CodeBlock, { code: 'const a = 1 < 2', lang: 'ts' }) }),
    )

    expect(html).toContain('data-syntax="plain"')
    expect(html).toContain('const a = 1 &lt; 2')
  })
})

describe('code-block line helpers', () => {
  it('splits code into lines and drops the final newline', () => {
    expect(toPlainLines('a\r\n\nb\n')).toEqual([[{ content: 'a' }], [], [{ content: 'b' }]])
  })

  it('expands line numbers and inclusive ranges', () => {
    expect([...toLineSet([2, [5, 7], [9, 8]])]).toEqual([2, 5, 6, 7])
  })
})
