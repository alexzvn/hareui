import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import Button from '../src/components/button/Button.vue'
import Form from '../src/components/form/Form.vue'
import TextField from '../src/components/text-field/TextField.vue'
import { expectAccessible } from './a11y'

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function signUp(formProps: Record<string, unknown> = {}) {
  wrapper = mount(
    () =>
      h(Form, { 'aria-label': 'Sign up', ...formProps }, () => [
        h(TextField, { label: 'Name', name: 'name', required: true }),
        h(TextField, {
          label: 'Email',
          name: 'email',
          type: 'email',
          required: true,
          description: 'We never share it.',
        }),
        h(Button, { type: 'submit' }, () => 'Create account'),
      ]),
    { attachTo: document.body },
  )
  return wrapper
}

/** The text of every element the control's `aria-describedby` points at. */
function descriptions(el: Element) {
  return (el.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent?.trim())
}

describe('Form', () => {
  it('a labelled form of labelled fields has no axe violations', async () => {
    const w = signUp()
    expect(w.get('form').attributes('aria-label')).toBe('Sign up')
    await expectAccessible(w)
  })

  it('server validationErrors mark each named field invalid and describe it with its message', async () => {
    const w = signUp({ validationErrors: { email: 'This email is already registered' } })
    await flushPromises()
    const email = w.get('input[name=email]').element
    expect(email.getAttribute('aria-invalid')).toBe('true')
    // TextField drops its description while invalid
    expect(descriptions(email)).toEqual(['This email is already registered'])
    expect(w.get('input[name=name]').attributes('aria-invalid')).toBeUndefined()
    await expectAccessible(w)
  })

  it('native validation on submit moves focus to the first invalid field and describes its error', async () => {
    const w = signUp()
    const form = w.findComponent(Form).vm as unknown as { submit: () => Promise<void> }
    await form.submit()
    await flushPromises()
    const name = w.get('input[name=name]').element
    expect(document.activeElement).toBe(name)
    expect(name.getAttribute('aria-invalid')).toBe('true')
    expect(descriptions(name)).toHaveLength(1)
    expect(descriptions(name)[0]).toBeTruthy()
    await expectAccessible(w)
  })

  it('disabled disables every field and the submit button, with no axe violations', async () => {
    const w = signUp({ disabled: true })
    for (const control of w.findAll('input, button'))
      expect((control.element as HTMLInputElement).disabled).toBe(true)
    await expectAccessible(w)
  })
})
