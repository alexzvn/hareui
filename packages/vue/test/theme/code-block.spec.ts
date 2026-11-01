import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CodeBlock from '@/components/code-block/CodeBlock.vue'

describe('CodeBlock theme', () => {
  it('without a header, the code stops short of the copy button', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'const a = 1', hideHeader: true } })

    expect(wrapper.get('[data-slot=code-block-code]').classes()).toContain('w-[calc(100%-2.75rem)]')
  })

  it('with a header, the code keeps its full width', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'const a = 1' } })

    expect(wrapper.get('[data-slot=code-block-code]').classes()).not.toContain(
      'w-[calc(100%-2.75rem)]',
    )
  })
})
