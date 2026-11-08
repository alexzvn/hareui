import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, onUpdated } from 'vue'

import Markdown from '@/components/markdown/Markdown.vue'

describe('markdown', () => {
  it('renders blocks and inline markup as elements', () => {
    const wrapper = mount(Markdown, {
      props: { value: '# Title\n\nSome **bold**, _em_ and `code`.\n\n- [x] done\n- [ ] todo' },
    })

    expect(wrapper.find('h1').text()).toBe('Title')
    expect(wrapper.find('p strong').text()).toBe('bold')
    expect(wrapper.find('p em').text()).toBe('em')
    expect(wrapper.find('p code').text()).toBe('code')

    const boxes = wrapper.findAll('li input[type=checkbox]')
    expect(boxes.map((box) => (box.element as HTMLInputElement).checked)).toEqual([true, false])
  })

  it('wraps each table in a scroll container', () => {
    const wrapper = mount(Markdown, { props: { value: '| a | b |\n| - | - |\n| 1 | 2 |' } })

    const scroller = wrapper.find('[data-slot=markdown-table]')
    expect(scroller.find('table td').text()).toBe('1')
  })

  it('shows raw HTML as text instead of rendering it', () => {
    const wrapper = mount(Markdown, { props: { value: '<img src=x onerror="alert(1)">' } })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('<img src=x onerror="alert(1)">')
  })

  it('drops unsafe link and image URLs but keeps safe ones', () => {
    const wrapper = mount(Markdown, {
      props: {
        value:
          '[bad](javascript:alert(1)) [encoded](jav&#x61;script:alert(1)) [good](https://example.com) ![pic](data:text/html,x)',
      },
    })

    const links = wrapper.findAll('a')

    expect(links.map((link) => link.attributes('href'))).toEqual([
      undefined,
      undefined,
      'https://example.com',
    ])

    expect(wrapper.find('img').attributes('src')).toBeUndefined()
  })

  it('renders open syntax on the last line as closed while streaming', () => {
    const wrapper = mount(Markdown, {
      props: { value: 'Some **bold and [a link](https://exa', streaming: true },
    })

    expect(wrapper.find('strong').exists()).toBe(true)
    expect(wrapper.find('[data-slot=markdown]').attributes('aria-busy')).toBe('true')
  })

  it('leaves code fences untouched while streaming', () => {
    const wrapper = mount(Markdown, {
      props: { value: '```ts\nconst a = **b', streaming: true, components: { pre: Pre } },
    })

    expect(wrapper.find('pre').text()).toBe('const a = **b')
    expect(wrapper.find('strong').exists()).toBe(false)
  })

  it('re-renders only the block that changed', async () => {
    const updates: string[] = []
    const Paragraph = defineComponent({
      setup(_, { slots }) {
        onUpdated(() => updates.push('p'))

        return () => h('p', slots.default?.())
      },
    })

    const wrapper = mount(Markdown, {
      props: { value: 'First block.\n\nSecond', streaming: true, components: { p: Paragraph } },
    })

    const first = wrapper.findAll('p')[0]?.element

    await wrapper.setProps({ value: 'First block.\n\nSecond block grows' })

    expect(wrapper.findAll('p')[0]?.element).toBe(first)
    expect(wrapper.findAll('p')[1]?.text()).toBe('Second block grows')
    expect(updates).toHaveLength(1)
  })

  it('passes code, language and meta to a `pre` override', () => {
    const wrapper = mount(Markdown, {
      props: { value: '```ts title="app.ts"\nlet a = 1\n```', components: { pre: Pre } },
    })

    expect(wrapper.find('pre').attributes()).toMatchObject({
      'data-lang': 'ts',
      'data-meta': 'title="app.ts"',
    })
  })
})

const Pre = defineComponent({
  props: { code: { type: String, required: true }, lang: String, meta: String },
  setup: (props) => () =>
    h('pre', { 'data-lang': props.lang, 'data-meta': props.meta }, props.code),
})
