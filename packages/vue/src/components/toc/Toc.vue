<template>
  <Primitive
    v-if="variant === 'floating'"
    :as="as"
    data-slot="toc"
    data-variant="floating"
    :aria-label="as === 'nav' ? resolvedTitle : undefined"
    :class="ui.root()"
    v-bind="$attrs"
  >
    <PopoverRoot :open="isOpen" @update:open="setOpen">
      <PopoverAnchor as-child>
        <button
          ref="marksEl"
          type="button"
          data-slot="toc-marks"
          :data-side="side"
          :aria-label="resolvedTitle"
          aria-haspopup="dialog"
          :aria-expanded="isOpen"
          :aria-controls="isOpen ? panelId : undefined"
          :class="ui.marks()"
          @click="onMarksClick"
          @pointerenter="panel.onPointerEnter"
          @pointerleave="panel.onPointerLeave"
        >
          <span
            v-for="{ link, level } in flatLinks"
            :key="link.id"
            data-slot="toc-mark"
            :data-active="link.id === currentId || undefined"
            :style="{ '--toc-level': level }"
            :class="ui.mark({ active: link.id === currentId })"
          />
        </button>
      </PopoverAnchor>

      <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
        <PopoverContent
          ref="panelEl"
          data-slot="toc-panel"
          :aria-label="resolvedTitle"
          :side="side === 'right' ? 'left' : 'right'"
          :side-offset="8"
          :collision-padding="8"
          :class="ui.panel()"
          @open-auto-focus="onOpenAutoFocus"
          @close-auto-focus="onCloseAutoFocus"
          @interact-outside="onInteractOutside"
          @pointerenter="panel.onPointerEnter"
          @pointerleave="panel.onPointerLeave"
          @focusin="isFocusInPanel = true"
          @focusout="onPanelFocusOut"
        >
          <div v-if="!!slots.top" data-slot="toc-top" :class="ui.top()">
            <slot name="top" :links="links" />
          </div>

          <slot name="content" :links="links">
            <a
              v-for="{ link, level } in flatLinks"
              :key="link.id"
              :href="`#${link.id}`"
              data-slot="toc-link"
              :data-active="link.id === currentId || undefined"
              :aria-current="link.id === currentId ? 'location' : undefined"
              :style="{ '--toc-level': level }"
              :class="
                ui.panelLink({
                  override: [link.ui?.panelLink, link.class],
                  active: link.id === currentId,
                })
              "
              @click="onSelect({ event: $event, link })"
            >
              <slot name="link" :link="link" :active="link.id === currentId" :level="level">
                {{ link.text }}
              </slot>
            </a>
          </slot>

          <div v-if="!!slots.bottom" data-slot="toc-bottom" :class="ui.bottom()">
            <slot name="bottom" :links="links" />
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </Primitive>

  <CollapsibleRoot
    v-else
    v-slot="{ open: isCollapsibleOpen }"
    :as="as"
    data-slot="toc"
    data-variant="list"
    :aria-label="as === 'nav' ? resolvedTitle : undefined"
    :open="isOpen"
    :class="ui.root()"
    v-bind="$attrs"
    @update:open="setOpen"
  >
    <div data-slot="toc-container" :class="ui.container()">
      <div v-if="!!slots.top" data-slot="toc-top" :class="ui.top()">
        <slot name="top" :links="links" />
      </div>

      <template v-if="links.length > 0">
        <CollapsibleTrigger data-slot="toc-trigger" :class="ui.trigger({ class: 'lg:hidden' })">
          <TriggerContent :open="isCollapsibleOpen" />
        </CollapsibleTrigger>

        <CollapsibleContent data-slot="toc-content" :class="ui.content({ class: 'lg:hidden' })">
          <ListContent />
        </CollapsibleContent>

        <p data-slot="toc-trigger" :class="ui.trigger({ class: 'hidden lg:flex' })">
          <TriggerContent :open="isCollapsibleOpen" />
        </p>

        <ScrollShadow
          ref="listEl"
          data-slot="toc-content"
          hide-scroll-bar
          :class="ui.content({ class: 'hidden lg:flex lg:flex-col' })"
          :style="listStyle"
        >
          <ListContent />
        </ScrollShadow>
      </template>

      <div v-if="!!slots.bottom" data-slot="toc-bottom" :class="ui.bottom({ body: hasBody })">
        <slot name="bottom" :links="links" />
      </div>
    </div>
  </CollapsibleRoot>
</template>

<script setup lang="ts" generic="T extends TocLink = TocLink">
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  Primitive,
} from 'reka-ui'
import type { FunctionalComponent } from 'vue'
import { computed, h, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import ScrollShadow from '@/components/scroll-shadow/ScrollShadow.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { usePortal } from '@/composables/usePortal'
import { IconRenderer } from '@/utils/icon'

import { createCircuitMaskStyle, flattenLinks, LINK_HEIGHT } from './links'
import { centerInContainer, scrollToHeading } from './scroll'
import theme from './theme'
import type { TocEmits, TocHighlight, TocLink, TocProps, TocSlots } from './Toc.types'
import TocList from './TocList.vue'
import { useTocPanel } from './useTocPanel'
import { useTocScrollspy } from './useTocScrollspy'

defineOptions({ inheritAttrs: false })

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply.
const { t } = useLocale()

const props = withDefaults(defineProps<TocProps<T>>(), {
  as: 'nav',
  links: () => [],
  variant: 'list',
  title: undefined,
  color: 'accent',
  highlight: false,
  side: 'right',
  trigger: 'hover',
  delay: 200,
  closeDelay: 300,
  open: undefined,
  defaultOpen: false,
  portal: undefined,
})

const emit = defineEmits<TocEmits>()
const slots = defineSlots<TocSlots<T>>()

const resolvedTitle = computed(() => props.title ?? t('toc.title'))

const openState = ref(props.defaultOpen)
const isOpen = computed(() => props.open ?? openState.value)

const setOpen = (value: boolean) => {
  openState.value = value
  emit('update:open', value)
}

const highlight = computed<TocHighlight | undefined>(() => {
  if (!props.highlight) return undefined

  return props.highlight === true ? {} : props.highlight
})

const ui = useComponentUI('toc', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    side: props.side,
    color: props.color,
    highlight: !!highlight.value,
    highlightVariant: highlight.value?.variant,
    highlightColor: highlight.value?.color ?? props.color,
  }),
  props,
  classSlot: 'root',
})

const portalTarget = usePortal(() => props.portal)

const flatLinks = computed(() => flattenLinks(props.links))
const linkIds = computed(() => flatLinks.value.map(({ link }) => link.id))
const spy = useTocScrollspy(linkIds)

// The headings in view. The `floating` variant marks one of them: the first in document order, or the last once the
// headings' scroll container has reached its end, where the headings below the first can't reach the top.
const activeIds = computed(() => spy.state.active)
const isActive = (id: string) => activeIds.value.includes(id)
const activeIndex = computed(() => linkIds.value.findIndex(isActive))

const currentIndex = computed(() => {
  if (spy.state.isAtEnd) {
    const lastActiveId = linkIds.value.filter(isActive).at(-1)
    return lastActiveId === undefined ? -1 : linkIds.value.lastIndexOf(lastActiveId)
  }

  return activeIndex.value
})

const currentId = computed(() => linkIds.value[currentIndex.value])

const hasBody = computed(() => !!slots.top || props.links.length > 0)

// The natural height of the list, so the theme can floor how far it may shrink without inflating a short one.
const listStyle = computed(() => ({
  '--list-height': `${flatLinks.value.length * LINK_HEIGHT}rem`,
}))

const indicatorStyle = computed(() => {
  if (activeIds.value.length === 0) return undefined

  return {
    '--indicator-size': `${LINK_HEIGHT * activeIds.value.length}rem`,
    '--indicator-position': `${Math.max(activeIndex.value, 0) * LINK_HEIGHT}rem`,
  }
})

const circuitMaskStyle = computed(() => {
  if (highlight.value?.variant !== 'circuit' || flatLinks.value.length === 0) return undefined

  return createCircuitMaskStyle(flatLinks.value.map(({ level }) => level))
})

const listRef = useTemplateRef<{ $el: HTMLElement }>('listEl')
const panelRef = useTemplateRef<{ $el: HTMLElement }>('panelEl')
const marksRef = useTemplateRef<HTMLElement>('marksEl')

// The popover's root element is its positioning wrapper; the panel (the dialog) is inside it.
const getPanel = () => {
  return panelRef.value?.$el.querySelector?.<HTMLElement>('[data-slot=toc-panel]') ?? undefined
}

// The panel's id is generated by the popover; read it once the panel renders, for the marks' `aria-controls`.
const panelId = ref<string>()

const syncPanelId = () => {
  if (isOpen.value) panelId.value = getPanel()?.id
}

watch(isOpen, syncPanelId, { flush: 'post' })
onMounted(syncPanelId)

const getLinkElements = (container: HTMLElement | undefined) => {
  return [...(container?.querySelectorAll<HTMLElement>('[data-slot=toc-link]') ?? [])]
}

const centerLink = ({ container, index }: { container?: HTMLElement; index: number }) => {
  const target = getLinkElements(container)[index]
  if (container && target) centerInContainer({ container, target })
}

watch(activeIndex, (index) => {
  if (index < 0) return

  nextTick(() => centerLink({ container: listRef.value?.$el, index }))
})

const onSelect = ({ event, link }: { event: MouseEvent; link: TocLink }) => {
  event.preventDefault()

  const heading = document.getElementById(link.id)
  if (heading) {
    spy.pin(link.id)
    scrollToHeading(heading)
  }

  history.replaceState(history.state, '', `#${encodeURIComponent(link.id)}`)
  emit('move', link.id)
  if (props.variant === 'floating') setOpen(false)
}

const panel = useTocPanel({
  isOpen: () => isOpen.value,
  setOpen,
  options: () => ({ trigger: props.trigger, delay: props.delay, closeDelay: props.closeDelay }),
})

const isFocusInPanel = ref(false)

// The panel centres its active link itself; focusing it must not scroll anything else.
const focusCurrentLink = () => {
  const links = getLinkElements(getPanel())
  const target = links[Math.max(currentIndex.value, 0)]
  target?.focus({ preventScroll: true })
}

// Keyboard clicks (`detail` 0) on a panel the pointer already opened move focus into it, like a click-opened one.
const onMarksClick = (event: MouseEvent) => {
  panel.onTriggerClick()
  if (event.detail === 0 && isOpen.value) nextTick(focusCurrentLink)
}

// A hover-opened panel leaves focus where it is; a clicked one focuses the active link.
const onOpenAutoFocus = (event: Event) => {
  event.preventDefault()
  nextTick(() => centerLink({ container: getPanel(), index: currentIndex.value }))
  if (panel.isPinned()) focusCurrentLink()
}

// Marks that scrolled away with their container keep it at the heading a picked link scrolls to.
const onCloseAutoFocus = (event: Event) => {
  event.preventDefault()
  if (isFocusInPanel.value) marksRef.value?.focus({ preventScroll: true })
  isFocusInPanel.value = false
}

const onPanelFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget as Node | null
  isFocusInPanel.value = !!next && !!getPanel()?.contains(next)
}

// The marks toggle the panel themselves; a press on them must not count as a dismissing outside press.
const onInteractOutside = (event: Event) => {
  if (marksRef.value?.contains(event.target as Node)) event.preventDefault()
}

// The trigger row and the list render twice (collapsible below `lg`, static from `lg`), hence functional components.
const ChevronDown: FunctionalComponent<{ class?: string }> = (iconProps) =>
  h(
    'svg',
    {
      'aria-hidden': 'true',
      viewBox: '0 0 16 16',
      fill: 'currentColor',
      'data-slot': 'toc-trailing-icon',
      class: iconProps.class,
    },
    [
      h('path', {
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        d: 'M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06',
      }),
    ],
  )

const TriggerContent: FunctionalComponent<{ open: boolean }> = ({ open }) => {
  const slotProps = { open, ui: ui.value }
  const icon = props.trailingIcon ?? ChevronDown

  return [
    slots.leading?.(slotProps),
    h(
      'span',
      { 'data-slot': 'toc-title', class: ui.value.title() },
      slots.default?.({ open }) ?? resolvedTitle.value,
    ),
    h(
      'span',
      { 'data-slot': 'toc-trailing', class: ui.value.trailing() },
      slots.trailing?.(slotProps) ?? h(IconRenderer, { icon, class: ui.value.trailingIcon() }),
    ),
  ]
}

const ListContent: FunctionalComponent = () => {
  const indicator = highlight.value
    ? h(
        'div',
        {
          'data-slot': 'toc-indicator',
          class: ui.value.indicator(),
          style: { ...indicatorStyle.value, ...circuitMaskStyle.value },
        },
        [
          h('div', { 'data-slot': 'toc-indicator-line', class: ui.value.indicatorLine() }),
          indicatorStyle.value
            ? h('div', { 'data-slot': 'toc-indicator-active', class: ui.value.indicatorActive() })
            : null,
        ],
      )
    : null

  const list =
    slots.content?.({ links: props.links }) ??
    h(
      TocList,
      { links: props.links, level: 0, ui: ui.value, activeIds: activeIds.value, onSelect },
      slots.link ? { link: slots.link } : undefined,
    )

  return [indicator, list]
}
</script>
