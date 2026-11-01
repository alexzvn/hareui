<template>
  <nav
    :aria-label="t('pagination.label')"
    data-slot="pagination"
    role="navigation"
    :class="ui.base()"
  >
    <div v-if="$slots.summary" data-slot="pagination-summary" dir="auto" :class="ui.summary()">
      <slot name="summary" :page="current" :total="total" />
    </div>
    <ul data-slot="pagination-content" :class="ui.content()">
      <li data-slot="pagination-item" :class="ui.item()">
        <button
          type="button"
          data-slot="pagination-previous"
          :aria-label="prevButton.label ? undefined : t('pagination.prev')"
          :disabled="isPrevDisabled || undefined"
          :data-disabled="isPrevDisabled ? 'true' : undefined"
          :class="navClass"
          @click="go(current - 1)"
        >
          <span aria-hidden="true" data-slot="pagination-previous-icon" :class="ui.icon()">
            <slot name="prevIcon">
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                role="presentation"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>
            </slot>
          </span>
          <span v-if="prevButton.label">{{ prevButton.label }}</span>
        </button>
      </li>
      <template v-if="!hidePages">
        <li
          v-for="(entry, index) in entries"
          :key="entry === 'ellipsis' ? `ellipsis-${index}` : entry"
          data-slot="pagination-item"
          :class="ui.item()"
        >
          <span
            v-if="entry === 'ellipsis'"
            aria-hidden="true"
            data-slot="pagination-ellipsis"
            :class="ui.ellipsis()"
            >&hellip;</span
          >
          <button
            v-else
            type="button"
            data-slot="pagination-link"
            :aria-current="entry === current ? 'page' : undefined"
            :data-active="entry === current ? 'true' : undefined"
            :disabled="disabled || undefined"
            :class="linkClass"
            @click="go(entry)"
          >
            <slot name="link" :page="entry" :active="entry === current">
              {{ entry }}
            </slot>
          </button>
        </li>
      </template>
      <li data-slot="pagination-item" :class="ui.item()">
        <button
          type="button"
          data-slot="pagination-next"
          :aria-label="nextButton.label ? undefined : t('pagination.next')"
          :disabled="isNextDisabled || undefined"
          :data-disabled="isNextDisabled ? 'true' : undefined"
          :class="navClass"
          @click="go(current + 1)"
        >
          <span v-if="nextButton.label">{{ nextButton.label }}</span>
          <span aria-hidden="true" data-slot="pagination-next-icon" :class="ui.icon()">
            <slot name="nextIcon">
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                role="presentation"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>
            </slot>
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { computed, ref } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import type {
  PaginationEntry,
  PaginationNavButton,
  PaginationProps,
  PaginationSlots,
  PaginationEmits,
} from './Pagination.types'
import theme from './theme'

// `page: undefined` keeps the uncontrolled page when unbound.
const props = withDefaults(defineProps<PaginationProps>(), {
  page: undefined,
  defaultPage: 1,
})

const emit = defineEmits<PaginationEmits>()
defineSlots<PaginationSlots>()
const { t } = useLocale()

const ui = useComponentUI('pagination', {
  theme,
  variantProps: () => ({ size: props.size }),
  props,
})

const prevButton = computed(() =>
  defu(props.prev, { label: t('pagination.prevLabel') } satisfies PaginationNavButton),
)

const nextButton = computed(() =>
  defu(props.next, { label: t('pagination.nextLabel') } satisfies PaginationNavButton),
)

const uncontrolled = ref(props.defaultPage)
const current = computed(() => props.page ?? uncontrolled.value)
const go = (page: number) => {
  if (props.disabled || page < 1 || page > props.total || page === current.value) return
  uncontrolled.value = page
  emit('update:page', page)
}

const entries = computed<PaginationEntry[]>(() => {
  if (props.pages) return props.pages
  const all = Array.from({ length: props.total }, (_, i) => i + 1)
  if (!props.ellipsis || props.total <= 1) return all
  const page = current.value
  const list: PaginationEntry[] = [1]
  if (page > 3) list.push('ellipsis')
  for (let i = Math.max(2, page - 1); i <= Math.min(props.total - 1, page + 1); i++) list.push(i)
  if (page < props.total - 2) list.push('ellipsis')
  list.push(props.total)

  return list
})

const isPrevDisabled = computed(
  () => props.disabled || (prevButton.value.disabled ?? current.value <= 1),
)

const isNextDisabled = computed(
  () => props.disabled || (nextButton.value.disabled ?? current.value >= props.total),
)

const linkClass = computed(() => ui.value.link())

// `nav` modifies `link` (HeroUI's `.pagination__link--nav`); `ui.nav` stays above `ui.link`.
const navClass = computed(() => ui.value.link({ class: ui.value.nav(), override: props.ui?.nav }))
</script>
