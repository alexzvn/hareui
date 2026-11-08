import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PromptInput from '@/components/prompt-input/PromptInput.vue'

describe('PromptInput theme', () => {
  const queueActions = (queueActions?: 'hover' | 'always') =>
    mount(PromptInput, { props: { queue: [{ text: 'Later' }], queueActions } }).get(
      '[data-slot=prompt-input-queue-send]',
    ).element.parentElement!.classList

  it('hides queue actions until hover by default', () => {
    expect(queueActions()).toContain('[@media(hover:hover)]:opacity-0')
  })

  it('always shows queue actions with queueActions="always"', () => {
    expect(queueActions('always')).not.toContain('[@media(hover:hover)]:opacity-0')
  })
})
