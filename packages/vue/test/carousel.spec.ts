import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { Carousel } from '@/components/carousel'
import type { CarouselExposed, CarouselItem, CarouselProps } from '@/components/carousel'

import { expectAccessible } from './a11y'
import { settle } from './settle'

const SLIDE_SIZE = 300

const slotOf = (el: HTMLElement) => el.dataset.slot

// happy-dom has no layout: each slide is 300px and the viewport shows one, so every slide is a scroll position.
const LAYOUT = {
  offsetWidth(this: HTMLElement) {
    return slotOf(this)?.startsWith('carousel-') ? SLIDE_SIZE : 0
  },
  offsetHeight(this: HTMLElement) {
    return slotOf(this)?.startsWith('carousel-') ? SLIDE_SIZE : 0
  },
  offsetLeft(this: HTMLElement) {
    if (slotOf(this) !== 'carousel-item') return 0

    return [...this.parentElement!.children].indexOf(this) * SLIDE_SIZE
  },
  offsetTop(this: HTMLElement) {
    if (slotOf(this) !== 'carousel-item') return 0

    return [...this.parentElement!.children].indexOf(this) * SLIDE_SIZE
  },
}

const originals = new Map<string, PropertyDescriptor | undefined>()

beforeAll(() => {
  // Embla reads the last slide's margin; without a stylesheet happy-dom reports none (NaN).
  const style = document.createElement('style')
  style.textContent = '[data-slot=carousel-item] { margin: 0px }'
  document.head.append(style)

  for (const [key, get] of Object.entries(LAYOUT)) {
    originals.set(key, Object.getOwnPropertyDescriptor(HTMLElement.prototype, key))
    Object.defineProperty(HTMLElement.prototype, key, { configurable: true, get })
  }
})

afterAll(() => {
  for (const [key, descriptor] of originals) {
    if (descriptor) Object.defineProperty(HTMLElement.prototype, key, descriptor)
  }
})

afterEach(() => {
  document.body.innerHTML = ''
})

const ITEMS = ['Harbor', 'Canyon', 'Glacier', 'Meadow']

const render = async (props: Partial<CarouselProps> = {}, slots = {}) => {
  const wrapper = mount(Carousel, {
    attachTo: document.body,
    props: { items: ITEMS, 'aria-label': 'Places', ...props },
    slots: { default: ({ item }: { item: CarouselItem }) => h('span', String(item)), ...slots },
  })

  await settle()

  return wrapper
}

const button = (name: string) =>
  [...document.querySelectorAll('button')].find((el) => el.getAttribute('aria-label') === name)!

const apiOf = (wrapper: VueWrapper) => (wrapper.vm as unknown as CarouselExposed).emblaApi!

const selectedTab = (list: string) =>
  document
    .querySelector(`[role=tablist][aria-label="${list}"] [aria-selected=true]`)
    ?.getAttribute('aria-label')

describe('Carousel', () => {
  it('renders a carousel region with one slide group per item', async () => {
    await render()

    const region = document.querySelector('[role=region]')!
    expect(region.getAttribute('aria-roledescription')).toBe('carousel')
    expect(region.getAttribute('aria-label')).toBe('Places')

    const slides = [...document.querySelectorAll('[role=group]')]
    expect(slides.map((slide) => slide.getAttribute('aria-roledescription'))).toEqual(
      Array(4).fill('slide'),
    )

    expect(slides.map((slide) => slide.textContent)).toEqual(ITEMS)
  })

  it('passes each item and its index to the default slot', async () => {
    await render({}, { default: ({ index }: { index: number }) => h('span', `#${index}`) })

    const slides = [...document.querySelectorAll('[role=group]')]
    expect(slides.map((slide) => slide.textContent)).toEqual(['#0', '#1', '#2', '#3'])
  })

  it('renders no arrows, dots or thumbnails by default', async () => {
    await render()

    expect(document.querySelectorAll('button')).toHaveLength(0)
    expect(document.querySelector('[role=tablist]')).toBeNull()
  })

  it('disables the arrow at either end and moves one slide per click', async () => {
    const wrapper = await render({ arrows: true })

    expect(button('Previous slide').disabled).toBe(true)
    expect(button('Next slide').disabled).toBe(false)

    button('Next slide').click()
    await settle()

    expect(wrapper.emitted('select')).toEqual([[1]])
    expect(button('Previous slide').disabled).toBe(false)

    for (let i = 0; i < 2; i++) button('Next slide').click()
    await settle()

    expect(wrapper.emitted('select')?.at(-1)).toEqual([3])
    expect(button('Next slide').disabled).toBe(true)
  })

  it('wraps from the first slide to the last when looping', async () => {
    const wrapper = await render({ arrows: true, options: { loop: true } })

    expect(button('Previous slide').disabled).toBe(false)

    button('Previous slide').click()
    await settle()

    expect(wrapper.emitted('select')).toEqual([[3]])
  })

  it('merges the prev / next props into the arrow buttons', async () => {
    await render({
      arrows: true,
      prev: { 'aria-label': 'Earlier photo' },
      next: { 'aria-label': 'Later photo', disabled: true },
    })

    expect(button('Earlier photo')).toBeDefined()
    expect(button('Later photo').disabled).toBe(true)
  })

  it('renders the prevIcon and nextIcon slots inside the arrows', async () => {
    await render(
      { arrows: true },
      {
        prevIcon: () => h('i', { 'data-test': 'back' }),
        nextIcon: () => h('i', { 'data-test': 'on' }),
      },
    )

    expect(button('Previous slide').querySelector('[data-test=back]')).not.toBeNull()
    expect(button('Next slide').querySelector('[data-test=on]')).not.toBeNull()
  })

  it('renders one dot per scroll position and follows the selection', async () => {
    const wrapper = await render({ dots: true })

    const dots = [...document.querySelectorAll('[aria-label="Slide indicators"] [role=tab]')]
    expect(dots.map((dot) => dot.getAttribute('aria-label'))).toEqual([
      'Go to slide 1',
      'Go to slide 2',
      'Go to slide 3',
      'Go to slide 4',
    ])

    expect(selectedTab('Slide indicators')).toBe('Go to slide 1')

    button('Go to slide 3').click()
    await settle()

    expect(selectedTab('Slide indicators')).toBe('Go to slide 3')
    expect(wrapper.emitted('select')).toEqual([[2]])
  })

  it('hides the dots while every slide fits in view', async () => {
    await render({ dots: true, items: ['Only'] })

    expect(document.querySelector('[role=tablist]')).toBeNull()
  })

  it('renders a thumbnail tab per slide, with a string item as its image', async () => {
    await render({ thumbnails: true })

    const list = document.querySelector('[role=tablist][aria-label="Slide thumbnails"]')!
    const images = [...list.querySelectorAll('img')]
    expect(images.map((img) => img.getAttribute('src'))).toEqual(ITEMS)

    button('Go to slide 2').click()
    await settle()

    expect(selectedTab('Slide thumbnails')).toBe('Go to slide 2')
  })

  it('scrolls the thumbnail strip, not the page, to the selected thumbnail', async () => {
    const scrollTo = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => {})
    await render({ thumbnails: true })

    button('Go to slide 3').click()
    await settle()

    const strip = document.querySelector('[role=tablist][aria-label="Slide thumbnails"]')
    expect(scrollTo.mock.contexts).toContain(strip)
    scrollTo.mockRestore()
  })

  it('uses an object item thumbnail and alt for the default thumbnail image', async () => {
    await render({
      thumbnails: true,
      items: [{ thumbnail: '/harbor.jpg', alt: 'Harbor at dusk' }, { title: 'No image' }],
    })

    const images = [...document.querySelectorAll('[aria-label="Slide thumbnails"] img')]
    expect(images.map((img) => [img.getAttribute('src'), img.getAttribute('alt')])).toEqual([
      ['/harbor.jpg', 'Harbor at dusk'],
    ])
  })

  it('passes item, index and selected to the thumbnail slot', async () => {
    await render(
      { thumbnails: true },
      {
        thumbnail: ({ item, selected }: { item: string; selected: boolean }) =>
          h('span', `${item}${selected ? '*' : ''}`),
      },
    )

    const labels = [...document.querySelectorAll('[aria-label="Slide thumbnails"] [role=tab]')]
    expect(labels.map((el) => el.textContent)).toEqual(['Harbor*', 'Canyon', 'Glacier', 'Meadow'])
  })

  it('names the dots and thumbnails from their label options', async () => {
    await render({
      dots: { label: 'Pages' },
      thumbnails: { label: 'Previews' },
      goToLabel: (slide) => `Show ${slide}`,
    })

    expect(document.querySelector('[role=tablist][aria-label=Pages]')).not.toBeNull()
    expect(document.querySelector('[role=tablist][aria-label=Previews]')).not.toBeNull()
    expect(document.querySelectorAll('[aria-label="Show 4"]')).toHaveLength(2)
  })

  it('moves with the arrow keys of its orientation', async () => {
    const wrapper = await render()
    const region = wrapper.get('[role=region]')

    await region.trigger('keydown', { key: 'ArrowRight' })
    await region.trigger('keydown', { key: 'ArrowRight' })
    await region.trigger('keydown', { key: 'ArrowLeft' })
    await region.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('select')).toEqual([[1], [2], [1]])
  })

  it('swaps the horizontal arrow keys in right-to-left', async () => {
    const wrapper = await render({ dir: 'rtl' })
    const region = wrapper.get('[role=region]')

    await region.trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('select')).toEqual([[1]])
  })

  it('moves with the up and down keys when vertical', async () => {
    const wrapper = await render({ orientation: 'vertical' })
    const region = wrapper.get('[role=region]')

    await region.trigger('keydown', { key: 'ArrowRight' })
    await region.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('select')).toEqual([[1]])
  })

  it('sets the dir prop on the region so right-to-left lays the slides out from the right', async () => {
    await render({ dir: 'rtl' })

    expect(document.querySelector('[role=region]')!.getAttribute('dir')).toBe('rtl')
  })

  it('leaves the arrow keys to a text field inside a slide', async () => {
    const wrapper = await render({}, { default: () => h('input', { 'aria-label': 'Caption' }) })

    await wrapper.get('input').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('ignores an arrow key a slide has already handled', async () => {
    const onKeydown = (event: KeyboardEvent) => event.preventDefault()
    const slide = () => h('div', { 'data-test': 'widget', tabindex: 0, onKeydown })
    const wrapper = await render({}, { default: slide })

    await wrapper.get('[data-test=widget]').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('starts on options.startIndex', async () => {
    await render({ dots: true, options: { startIndex: 2 } })

    expect(selectedTab('Slide indicators')).toBe('Go to slide 3')
  })

  it('loads a plugin only when its prop is set', async () => {
    const plain = await render()
    const plainApi = apiOf(plain)
    expect(plainApi.plugins().autoplay).toBeUndefined()

    plain.unmount()

    const playing = await render({ autoplay: { delay: 60_000 } })
    const api = apiOf(playing)

    await vi.waitFor(() => expect(api.plugins().autoplay).toBeDefined())
  })

  it('stops autoplay when an arrow is pressed', async () => {
    const wrapper = await render({ arrows: true, autoplay: { delay: 60_000 } })
    const api = apiOf(wrapper)
    await vi.waitFor(() => expect(api.plugins().autoplay).toBeDefined())

    const stop = vi.spyOn(api.plugins().autoplay!, 'stop')
    button('Next slide').click()

    expect(stop).toHaveBeenCalled()
  })

  it('keeps autoplay running when stopOnInteraction is false', async () => {
    const wrapper = await render({
      arrows: true,
      autoplay: { delay: 60_000, stopOnInteraction: false },
    })

    const api = apiOf(wrapper)
    await vi.waitFor(() => expect(api.plugins().autoplay).toBeDefined())

    const stop = vi.spyOn(api.plugins().autoplay!, 'stop')
    button('Next slide').click()

    expect(stop).not.toHaveBeenCalled()
  })

  it('exposes the viewport element and the Embla API', async () => {
    const wrapper = await render()
    const { emblaRef, emblaApi } = wrapper.vm as unknown as CarouselExposed

    expect(emblaRef?.dataset.slot).toBe('carousel-viewport')

    emblaApi!.scrollTo(2)
    await settle()

    expect(wrapper.emitted('select')).toEqual([[2]])
  })

  it('has no axe violations with arrows, dots and thumbnails', async () => {
    const wrapper = await render({ arrows: true, dots: true, thumbnails: true })

    await expectAccessible(wrapper)
  })
})
