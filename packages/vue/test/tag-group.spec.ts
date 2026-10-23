import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import type { ComponentOptions } from 'vue'
import { h, ref } from 'vue'
import TagGroup from '../src/components/tag-group/TagGroup.vue'

const items = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming', disabled: true },
  { id: 'shopping', label: 'Shopping' },
]

const tags = (w: ReturnType<typeof mount>) => w.findAll('[data-slot=tag]')

describe('TagGroup', () => {
  it('ArrowRight/ArrowLeft move roving focus between tags, skipping disabled ones', async () => {
    const w = mount(TagGroup, { props: { items }, attachTo: document.body })
    const t = tags(w)
    const first = t[0]!.element as HTMLElement
    first.focus()
    expect(document.activeElement).toBe(t[0]!.element)
    await t[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(t[1]!.element)
    // Gaming (index 2) is disabled: roving focus skips straight to Shopping.
    await t[1]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(t[3]!.element)
    await t[3]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(t[1]!.element)
    w.unmount()
  })

  it('selectionMode single selects one tag at a time via v-model:selected', async () => {
    const model = ref<string[]>([])
    const w = mount(() => h(TagGroup, { items, 'selectionMode': 'single', 'selected': model.value, 'onUpdate:selected': (v: string[] | undefined) => (model.value = v ?? []) }))
    const t = tags(w)
    await t[0]!.trigger('click')
    expect(model.value).toEqual(['news'])
    expect(t[0]!.attributes('data-selected')).toBe('true')
    expect(t[0]!.attributes('aria-selected')).toBe('true')

    await w.setProps({ selected: model.value })
    await t[3]!.trigger('click')
    expect(model.value).toEqual(['shopping'])
    expect(t[0]!.attributes('data-selected')).toBeUndefined()
    w.unmount()
  })

  it('selectionMode multiple accumulates selected ids', async () => {
    const model = ref<string[]>([])
    const w = mount(() => h(TagGroup, { items, 'selectionMode': 'multiple', 'selected': model.value, 'onUpdate:selected': (v: string[] | undefined) => (model.value = v ?? []) }))
    const t = tags(w)
    await t[0]!.trigger('click')
    await w.setProps({ selected: model.value })
    await t[1]!.trigger('click')
    expect(model.value).toEqual(['news', 'travel'])
    expect(w.find('[data-slot=tag-group-list]').attributes('aria-multiselectable')).toBe('true')
    w.unmount()
  })

  it('a mouse press selects on pointerdown, and the click ending that press does not toggle it back', async () => {
    const w = mount(TagGroup, { props: { items, selectionMode: 'multiple' } })
    const t = tags(w)
    await t[0]!.trigger('pointerdown', { pointerType: 'mouse', button: 0 })
    expect(w.emitted('update:selected')).toEqual([[['news']]])
    await t[0]!.trigger('click')
    expect(w.emitted('update:selected')).toHaveLength(1)
    // Touch selects on release (click) instead
    await t[1]!.trigger('pointerdown', { pointerType: 'touch', button: 0 })
    expect(w.emitted('update:selected')).toHaveLength(1)
    await t[1]!.trigger('click')
    expect(w.emitted('update:selected')).toHaveLength(2)
  })

  it('a disabled tag (own `disabled` or `disabledKeys`) cannot be selected', async () => {
    const w = mount(TagGroup, { props: { items, selectionMode: 'multiple', disabledKeys: ['news'] } })
    const t = tags(w)
    await t[0]!.trigger('click')
    expect(w.emitted('update:selected')).toBeUndefined()
    expect(t[0]!.attributes('data-disabled')).toBe('true')
    await t[2]!.trigger('click')
    expect(w.emitted('update:selected')).toBeUndefined()
    expect(t[2]!.attributes('data-disabled')).toBe('true')
    w.unmount()
  })

  it('removable shows a remove button that emits `remove` with the id on click', async () => {
    const w = mount(TagGroup, { props: { items, removable: true } })
    const button = w.findAll('[data-slot=tag-remove-button]')[1]!
    await button.trigger('click')
    expect(w.emitted('remove')!.at(-1)).toEqual([['travel']])
  })

  it('Delete/Backspace on a focused tag removes it; removes the whole selection if it is selected', async () => {
    const model = ref<string[]>(['news', 'travel'])
    const w = mount(() => h(TagGroup, { items, 'removable': true, 'selectionMode': 'multiple', 'selected': model.value, 'onUpdate:selected': (v: string[] | undefined) => (model.value = v ?? []) }), { attachTo: document.body })
    const tagGroup = w.findComponent(TagGroup)
    const t = tags(w)
    // Shopping isn't selected: Backspace removes just that tag.
    await t[3]!.trigger('keydown', { key: 'Backspace' })
    expect(tagGroup.emitted('remove')!.at(-1)).toEqual([['shopping']])
    // Travel is part of the current selection: Delete removes the whole selection.
    await t[1]!.trigger('keydown', { key: 'Delete' })
    expect(tagGroup.emitted('remove')!.at(-1)).toEqual([['news', 'travel']])
    w.unmount()
  })

  it('a disabled tag cannot be removed by button or keyboard', async () => {
    const w = mount(TagGroup, { props: { items, removable: true }, attachTo: document.body })
    const t = tags(w)
    const button = t[2]!.find('[data-slot=tag-remove-button]')
    expect(button.attributes('disabled')).toBeDefined()
    await button.trigger('click')
    expect(w.emitted('remove')).toBeUndefined()
    await t[2]!.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
    expect(w.emitted('remove')).toBeUndefined()
    w.unmount()
  })

  it('shows the error message after the description, and describes the list with both ids', () => {
    const w = mount(TagGroup, { props: { id: 'cats', items, label: 'Categories', description: 'Pick a category', errorMessage: 'Required' } })
    expect(w.find('#cats-label').text()).toBe('Categories')
    expect(w.find('#cats-description').text()).toBe('Pick a category')
    expect(w.find('#cats-error').text()).toBe('Required')
    const list = w.find('[data-slot=tag-group-list]')
    expect(list.attributes('aria-labelledby')).toBe('cats-label')
    expect(list.attributes('aria-describedby')).toBe('cats-description cats-error')
  })

  it('#removeButton replaces each remove button\'s icon and still removes its own tag', async () => {
    const w = mount(TagGroup, {
      props: { items, removable: true },
      slots: { removeButton: ({ item }: { item: { id: string } }) => h('i', { class: 'custom' }, item.id) },
    })
    const buttons = w.findAll('[data-slot=tag-remove-button]')
    expect(buttons[1]!.find('i.custom').text()).toBe('travel')
    expect(buttons[1]!.find('svg').exists()).toBe(false)
    await buttons[1]!.trigger('click')
    expect(w.emitted('remove')).toEqual([[['travel']]])
  })

  describe('removal focus and range selection (behaviour parity)', () => {
    const enabled = [
      { id: 'news', label: 'News' },
      { id: 'travel', label: 'Travel' },
      { id: 'gaming', label: 'Gaming' },
      { id: 'shopping', label: 'Shopping' },
    ]
    const press = (el: Element, key: string, init: KeyboardEventInit = {}) =>
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }))
    // The focused tag's label, or the element name when focus is somewhere else (e.g. `body`).
    const focusedId = () => {
      const el = document.activeElement
      return el instanceof HTMLElement && el.dataset.slot === 'tag' ? el.textContent?.trim() : el?.tagName.toLowerCase()
    }

    // Failed assertions skip `unmount()`; keep a leaked tree from polluting the next test's focus.
    afterEach(() => {
      document.body.innerHTML = ''
    })

    /** A TagGroup whose consumer removes the tags it is told to remove, as every real usage does. */
    function mountRemovable(initial: typeof enabled) {
      const list = ref(initial)
      const removed: string[][] = []
      const w = mount(() => h(TagGroup, {
        items: list.value,
        removable: true,
        onRemove: (ids: string[]) => {
          removed.push(ids)
          list.value = list.value.filter(i => !ids.includes(i.id))
        },
      }), { attachTo: document.body })
      return { w, removed }
    }

    it('clicking the remove button of the focused tag moves focus to the next tag', async () => {
      // behaviour-final-check H7 / T1
      const { w } = mountRemovable(enabled)
      const button = tags(w)[1]!.get('[data-slot=tag-remove-button]')
      ;(button.element as HTMLElement).focus()
      await button.trigger('click')
      await w.vm.$nextTick()
      expect(focusedId()).toBe('Gaming')
      w.unmount()
    })

    it('Delete on the focused tag removes it, focuses the next tag, and a following Delete removes that one', async () => {
      // behaviour-final-check H7 / T1
      const { w, removed } = mountRemovable(enabled)
      ;(tags(w)[1]!.element as HTMLElement).focus()
      press(document.activeElement!, 'Delete')
      await w.vm.$nextTick()
      expect(focusedId()).toBe('Gaming')
      press(document.activeElement!, 'Delete')
      await w.vm.$nextTick()
      expect(removed).toEqual([['travel'], ['gaming']])
      w.unmount()
    })

    it('Backspace on the last tag removes it and focuses the previous tag, whose Backspace removes it in turn', async () => {
      // behaviour-final-check H7 / T1
      const { w, removed } = mountRemovable(enabled)
      ;(tags(w)[3]!.element as HTMLElement).focus()
      press(document.activeElement!, 'Backspace')
      await w.vm.$nextTick()
      expect(focusedId()).toBe('Gaming')
      press(document.activeElement!, 'Backspace')
      await w.vm.$nextTick()
      expect(removed).toEqual([['shopping'], ['gaming']])
      w.unmount()
    })

    it('removing the only remaining tag moves focus to the group instead of body', async () => {
      // behaviour-final-check H7 / T1
      const { w } = mountRemovable([enabled[0]!])
      ;(tags(w)[0]!.element as HTMLElement).focus()
      press(document.activeElement!, 'Delete')
      await w.vm.$nextTick()
      expect(document.activeElement).toBe(w.get('[data-slot=tag-group-list]').element)
      w.unmount()
    })

    function mountMultiple(defaultSelected: string[] = []) {
      const w = mount(TagGroup, { props: { items, selectionMode: 'multiple', defaultSelected }, attachTo: document.body })
      const t = tags(w)
      return { w, t, el: (i: number) => t[i]!.element as HTMLElement, last: () => (w.emitted('update:selected')?.at(-1)?.[0] as string[] | undefined) }
    }

    it('Shift+ArrowRight extends the selection from the anchor, skipping disabled tags', async () => {
      // behaviour-final-check T2
      const { w, t, el, last } = mountMultiple()
      await t[0]!.trigger('pointerdown', { pointerType: 'mouse', button: 0 })
      el(0).focus()
      press(el(0), 'ArrowRight', { shiftKey: true })
      await w.vm.$nextTick()
      press(document.activeElement!, 'ArrowRight', { shiftKey: true })
      await w.vm.$nextTick()
      expect([...last()!].sort()).toEqual(['news', 'shopping', 'travel'])
      w.unmount()
    })

    it('Shift+End and Shift+Home select the range from the anchor to the edge', async () => {
      // behaviour-final-check T2
      const { w, t, el, last } = mountMultiple()
      await t[1]!.trigger('pointerdown', { pointerType: 'mouse', button: 0 })
      el(1).focus()
      press(el(1), 'End', { shiftKey: true })
      await w.vm.$nextTick()
      expect([...last()!].sort()).toEqual(['shopping', 'travel'])
      press(document.activeElement!, 'Home', { shiftKey: true })
      await w.vm.$nextTick()
      expect([...last()!].sort()).toEqual(['news', 'travel'])
      w.unmount()
    })

    it('Shift+click selects the range from the previously pressed tag', async () => {
      // behaviour-final-check T2
      const { w, t, last } = mountMultiple()
      await t[0]!.trigger('pointerdown', { pointerType: 'mouse', button: 0 })
      await t[0]!.trigger('click')
      await t[3]!.trigger('pointerdown', { pointerType: 'mouse', button: 0, shiftKey: true })
      await t[3]!.trigger('click', { shiftKey: true })
      expect([...last()!].sort()).toEqual(['news', 'shopping', 'travel'])
      w.unmount()
    })

    it('Ctrl/Meta+A selects every enabled tag', async () => {
      // behaviour-final-check T2
      const { w, el, last } = mountMultiple()
      el(1).focus()
      press(el(1), 'a', { ctrlKey: true })
      await w.vm.$nextTick()
      expect([...(last() ?? [])].sort()).toEqual(['news', 'shopping', 'travel'])
      w.unmount()
    })
  })

  it('removing one tag does not re-render the tags before it', async () => {
    const updatedTags: string[] = []
    const countTagUpdates: ComponentOptions = {
      updated() {
        if (this.$el instanceof Element && this.$el.matches('[data-slot=tag]'))
          updatedTags.push(this.$el.textContent!.trim())
      },
    }
    const list = ref(Array.from({ length: 20 }, (_, i) => ({ id: `t${i}`, label: `T${i}` })))
    const onRemove = (ids: string[]) => (list.value = list.value.filter(it => !ids.includes(it.id)))
    const w = mount(() => h(TagGroup, { items: list.value, removable: true, onRemove }), { global: { mixins: [countTagUpdates] } })
    const removeTag = (label: string) => w.findAll('[data-slot=tag]').find(t => t.text() === label)!.get('[data-slot=tag-remove-button]').trigger('click')
    await removeTag('T19')
    updatedTags.length = 0
    await removeTag('T10')
    expect(w.findAll('[data-slot=tag]')).toHaveLength(18)
    expect(updatedTags.filter(t => Number(t.slice(1)) < 10)).toEqual([])
    w.unmount()
  })
})
