import { Type } from '@sinclair/typebox'
import { Compile } from '@sinclair/typemap'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import * as v from 'valibot'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive, ref } from 'vue'
import * as z from 'zod'

import type { FormErrorEvent, FormInstance } from '@/components/form'
import Form from '@/components/form/Form.vue'
import TextField from '@/components/text-field/TextField.vue'
import type { StandardSchemaV1 } from '@/utils/form'
import { setAtPath } from '@/utils/form'

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.useRealTimers()
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const errors = () =>
  [...document.querySelectorAll('[data-slot="field-error"]')].map((e) => e.textContent?.trim())

async function type(input: HTMLInputElement, value: string) {
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await flushPromises()
}

async function blur(input: HTMLInputElement) {
  input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
  await flushPromises()
}

async function submit(w: VueWrapper) {
  const event = new Event('submit', { cancelable: true })
  w.get('form').element.dispatchEvent(event)
  await flushPromises()
  return event
}

/** A TextField bound with v-model to `state[name]`. */
function field(state: Record<string, any>, name: string, props: Record<string, unknown> = {}) {
  return h(TextField, {
    label: name,
    name,
    modelValue: state[name],
    'onUpdate:modelValue': (value: unknown) => {
      state[name] = value
    },
    ...props,
  })
}

const schemas: Record<string, StandardSchemaV1<any, { name: string }>> = {
  zod: z.object({ name: z.string().min(3, 'Too short') }),
  valibot: v.object({ name: v.pipe(v.string(), v.minLength(3, 'Too short')) }),
  typebox: Compile(Type.Object({ name: Type.String({ minLength: 3 }) })),
}

describe.each(Object.entries(schemas))('schema: %s', (vendor, schema) => {
  it('blocks submit with errors routed to the field by name, then submits the validated state', async () => {
    const state = reactive({ name: 'ab' })
    const onSubmit = vi.fn()
    const onError = vi.fn<(event: FormErrorEvent) => void>()
    wrapper = mount(
      () => h(Form, { schema, state, onSubmit, onError }, () => field(state, 'name')),
      { attachTo: document.body },
    )
    const input = wrapper.get('input').element

    await submit(wrapper)
    expect(errors()).toHaveLength(1)
    if (vendor !== 'typebox') expect(errors()[0]).toBe('Too short')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError.mock.calls[0]![0].errors).toEqual([
      expect.objectContaining({ name: 'name', id: input.id }),
    ])

    state.name = 'abcd'
    await submit(wrapper)
    expect(errors()).toEqual([])
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0]![0].data).toEqual({ name: 'abcd' })
  })
})

describe('form submission', () => {
  it('re-enables the fields before @error, so the handler can focus the first invalid one', async () => {
    const state = reactive({ name: '' })
    const onError = (event: FormErrorEvent) =>
      document.getElementById(event.errors[0]!.id!)?.focus()
    wrapper = mount(
      () => h(Form, { schema: schemas.zod, state, onError }, () => field(state, 'name')),
      { attachTo: document.body },
    )
    await submit(wrapper)
    expect(document.activeElement).toBe(wrapper.get('input').element)
  })

  it('keeps a nested form-level error unnamed in the parent', async () => {
    const state = reactive({ address: { city: 'Hanoi' } })
    const form = ref<FormInstance<z.ZodObject>>()
    wrapper = mount(
      () =>
        h(Form, { ref: form, state }, () =>
          h(
            Form,
            { nested: true, name: 'address', validate: () => [{ message: 'Address invalid' }] },
            () => field(state.address, 'city'),
          ),
        ),
      { attachTo: document.body },
    )
    await flushPromises()
    await expect(form.value!.validate({ nested: true })).rejects.toBeTruthy()
    form.value!.clear('other')
    expect(form.value!.getErrors()).toEqual([{ message: 'Address invalid' }])
  })

  it('reports a required message for a field typed in and cleared', async () => {
    const state = reactive<{ name?: string }>({})
    const schema = z.object({ name: z.string('Name is required').min(1, 'Name is required') })
    wrapper = mount(() => h(Form, { schema, state }, () => field(state, 'name')), {
      attachTo: document.body,
    })
    const input = wrapper.get('input').element
    await type(input, 'a')
    await type(input, '')
    expect(state.name).toBe('')
    await submit(wrapper)
    expect(errors()).toEqual(['Name is required'])
  })
})

describe('form validation', () => {
  it('submits the schema output, or the raw state with transform false', async () => {
    const schema = z.object({ age: z.coerce.number() })
    const state = reactive({ age: '42' })
    const onSubmit = vi.fn()
    const transform = ref(true)
    wrapper = mount(
      () =>
        h(Form, { schema, state, transform: transform.value, onSubmit }, () => field(state, 'age')),
      { attachTo: document.body },
    )
    await submit(wrapper)
    expect(onSubmit.mock.calls[0]![0].data).toEqual({ age: 42 })
    transform.value = false
    await nextTick()
    await submit(wrapper)
    expect(onSubmit.mock.calls[1]![0].data).toEqual({ age: '42' })
  })

  it('runs `validate` on the raw state alongside the schema; unnamed errors are form-level', async () => {
    const schema = z.object({ password: z.string().min(8, 'Min 8'), confirm: z.string() })
    const state = reactive({ password: 'short', confirm: 'other' })
    const validate = vi.fn((s: Partial<{ password: string; confirm: string }>) => [
      ...(s.password !== s.confirm ? [{ name: 'confirm', message: 'Passwords differ' }] : []),
      { message: 'Form-level' },
    ])
    const onSubmit = vi.fn()
    let slotErrors: unknown[] = []
    wrapper = mount(
      () =>
        h(
          Form,
          { schema, state, validate, onSubmit },
          {
            default: ({ errors }: { errors: unknown[] }) => {
              slotErrors = errors
              return [field(state, 'password'), field(state, 'confirm')]
            },
          },
        ),
      { attachTo: document.body },
    )
    await submit(wrapper)
    expect(validate).toHaveBeenCalledWith(state)
    expect(errors()).toEqual(['Min 8', 'Passwords differ'])
    expect(slotErrors).toContainEqual(expect.objectContaining({ message: 'Form-level' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('validates on input only once the field was left, unless eager', async () => {
    const state = reactive({ name: '', other: '' })
    const schema = z.object({
      name: z.string().min(3, 'Name?'),
      other: z.string().min(3, 'Other?'),
    })
    wrapper = mount(
      () =>
        h(Form, { schema, state, validateOnInputDelay: 0 }, () => [
          field(state, 'name'),
          field(state, 'other', { eagerValidation: true }),
        ]),
      { attachTo: document.body },
    )
    const [name, other] = wrapper.findAll('input').map((w) => w.element as HTMLInputElement)

    await type(name!, 'a')
    await sleep(0)
    await flushPromises()
    expect(errors()).toEqual([])
    await type(other!, 'a')
    await sleep(0)
    await flushPromises()
    expect(errors()).toEqual(['Other?'])

    await blur(name!)
    expect(errors()).toEqual(['Name?', 'Other?'])
    await type(name!, 'abc')
    await sleep(0)
    await flushPromises()
    expect(errors()).toEqual(['Other?'])
  })

  it('debounces input validation by validateOnInputDelay', async () => {
    vi.useFakeTimers()
    const state = reactive({ name: '' })
    wrapper = mount(
      () =>
        h(Form, { schema: schemas.zod, state, validateOnInputDelay: 300 }, () =>
          field(state, 'name', { eagerValidation: true }),
        ),
      { attachTo: document.body },
    )
    await type(wrapper.get('input').element, 'a')
    await vi.advanceTimersByTimeAsync(299)
    expect(errors()).toEqual([])
    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()
    expect(errors()).toEqual(['Too short'])
  })

  it('only validates on the events in validateOn', async () => {
    const state = reactive({ name: 'a' })
    wrapper = mount(
      () =>
        h(Form, { schema: schemas.zod, state, validateOn: ['blur'] }, () => field(state, 'name')),
      { attachTo: document.body },
    )
    const input = wrapper.get('input').element
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await flushPromises()
    expect(errors()).toEqual([])
    await blur(input)
    expect(errors()).toEqual(['Too short'])
  })

  it('drops a field validation that settles after a newer submit', async () => {
    const schema: StandardSchemaV1<{ name: string }> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate: async (value) => {
          const name = (value as { name: string }).name
          await sleep(name === 'taken' ? 30 : 1)
          return name === 'taken'
            ? { issues: [{ message: 'Taken', path: ['name'] }] }
            : { value: { name } }
        },
      },
    }
    const state = reactive({ name: 'taken' })
    const onSubmit = vi.fn()
    wrapper = mount(() => h(Form, { schema, state, onSubmit }, () => field(state, 'name')), {
      attachTo: document.body,
    })
    await blur(wrapper.get('input').element) // slow validation of "taken" starts
    state.name = 'free'
    await submit(wrapper)
    await sleep(5)
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledOnce()
    await sleep(40)
    await flushPromises()
    expect(errors()).toEqual([])
  })

  it('shows errors matching errorPattern on the field', async () => {
    const state = reactive({ tags: ['ok', 'x'] })
    const schema = z.object({ tags: z.array(z.string().min(2, 'Tag too short')) })
    wrapper = mount(
      () =>
        h(Form, { schema, state }, () =>
          h(TextField, { label: 'Tags', name: 'tags', errorPattern: /^tags\.\d+$/ }),
        ),
      { attachTo: document.body },
    )
    await submit(wrapper)
    expect(errors()).toEqual(['Tag too short'])
  })

  it('validates nested forms with the parent, prefixing their errors and merging their output', async () => {
    const state = reactive({ name: 'Ann', address: { city: '' } })
    const onSubmit = vi.fn()
    const onError = vi.fn<(event: FormErrorEvent) => void>()
    const address = state.address as Record<string, any>
    wrapper = mount(
      () =>
        h(Form, { schema: z.object({ name: z.string() }), state, onSubmit, onError }, () => [
          field(state, 'name'),
          h(
            Form,
            {
              nested: true,
              name: 'address',
              schema: z.object({
                city: z
                  .string()
                  .min(2, 'City?')
                  .transform((s) => s.toUpperCase()),
              }),
            },
            () => field(address, 'city'),
          ),
        ]),
      { attachTo: document.body },
    )
    await submit(wrapper)
    expect(errors()).toEqual(['City?'])
    expect(onError.mock.calls[0]![0].errors).toEqual([
      expect.objectContaining({ name: 'address.city' }),
    ])
    expect(onSubmit).not.toHaveBeenCalled()

    address.city = 'Hanoi'
    await submit(wrapper)
    expect(errors()).toEqual([])
    expect(onSubmit.mock.calls[0]![0].data).toEqual({ name: 'Ann', address: { city: 'HANOI' } })
  })

  it('disables the fields while an async @submit runs', async () => {
    const state = reactive({ name: 'abcd' })
    let finish!: () => void
    const onSubmit = () =>
      new Promise<void>((resolve) => {
        finish = resolve
      })
    wrapper = mount(
      () => h(Form, { schema: schemas.zod, state, onSubmit }, () => field(state, 'name')),
      { attachTo: document.body },
    )
    await submit(wrapper)
    expect(wrapper.get('input').element.disabled).toBe(true)
    finish()
    await flushPromises()
    expect(wrapper.get('input').element.disabled).toBe(false)
  })

  it('exposes validate, setErrors, getErrors, clear and dirty tracking', async () => {
    const state = reactive({ name: 'a', other: 'b' })
    const schema = z.object({
      name: z.string().min(3, 'Name?'),
      other: z.string().min(3, 'Other?'),
    })
    const form = ref<FormInstance<typeof schema>>()
    wrapper = mount(
      () =>
        h(Form, { ref: form, schema, state, onSubmit: () => {} }, () => [
          field(state, 'name'),
          field(state, 'other'),
        ]),
      { attachTo: document.body },
    )

    await expect(form.value!.validate({ name: 'name', silent: true })).resolves.toBe(false)
    await flushPromises()
    expect(errors()).toEqual(['Name?'])
    await expect(form.value!.validate()).rejects.toMatchObject({
      errors: [{ name: 'name' }, { name: 'other' }],
    })

    form.value!.setErrors([{ name: 'name', message: 'Server says no' }], 'name')
    await nextTick()
    expect(form.value!.getErrors('name')).toEqual([
      expect.objectContaining({ message: 'Server says no' }),
    ])
    expect(errors()).toEqual(['Server says no', 'Other?'])
    form.value!.clear(/^oth/)
    await nextTick()
    expect(errors()).toEqual(['Server says no'])

    await type(wrapper.get('input').element, 'abcd')
    expect(form.value!.dirty).toBe(true)
    expect([...form.value!.dirtyFields]).toEqual(['name'])
    state.other = 'abcd'
    await submit(wrapper)
    expect(form.value!.dirty).toBe(false)
  })

  it('clears schema errors on reset', async () => {
    const state = reactive({ name: 'a' })
    wrapper = mount(() => h(Form, { schema: schemas.zod, state }, () => field(state, 'name')), {
      attachTo: document.body,
    })
    await submit(wrapper)
    expect(errors()).toEqual(['Too short'])
    wrapper.get('form').element.dispatchEvent(new Event('reset'))
    await nextTick()
    expect(errors()).toEqual([])
  })

  it('without state, schema or validate, submits natively', async () => {
    const onSubmit = vi.fn()
    wrapper = mount(
      () =>
        h(Form, { onSubmit }, () =>
          h(TextField, { label: 'Name', name: 'name', defaultValue: 'x' }),
        ),
      { attachTo: document.body },
    )
    const event = await submit(wrapper)
    expect(onSubmit).toHaveBeenCalledWith(event)
    expect(event.defaultPrevented).toBe(false)
  })
})

describe('setAtPath', () => {
  it('creates arrays for numeric segments and ignores prototype keys', () => {
    expect(setAtPath({}, 'items.0.qty', 2)).toEqual({ items: [{ qty: 2 }] })
    setAtPath({}, '__proto__.polluted', true)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})
