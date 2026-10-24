<template>
  <Primitive
    :as="as"
    data-slot="alert-root"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot name="leading" />
    <div
      v-if="indicator"
      data-slot="alert-indicator"
      :class="ui.indicator({ class: props.ui?.indicator })"
    >
      <slot name="indicator">
        <svg
          v-if="status === 'success'"
          data-slot="alert-default-icon"
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
            d="M13.5 8a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-3.9-1.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="status === 'warning'"
          data-slot="alert-default-icon"
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
            d="M7.134 2.994L2.217 11.5a1 1 0 0 0 .866 1.5h9.834a1 1 0 0 0 .866-1.5L8.866 2.993a1 1 0 0 0-1.732 0m3.03-.75c-.962-1.665-3.366-1.665-4.329 0L.918 10.749c-.963 1.666.24 3.751 2.165 3.751h9.834c1.925 0 3.128-2.085 2.164-3.751zM8 5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 5m1 5.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="status === 'danger'"
          data-slot="alert-default-icon"
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
            d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8.75 5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          data-slot="alert-default-icon"
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
            d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </slot>
    </div>
    <div data-slot="alert-content" :class="ui.content({ class: props.ui?.content })">
      <p
        v-if="title || !!slots.title"
        data-slot="alert-title"
        :class="ui.title({ class: props.ui?.title })"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </p>
      <span
        v-if="description || !!slots.description"
        data-slot="alert-description"
        :class="ui.description({ class: props.ui?.description })"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </span>
      <slot />
    </div>
    <slot name="trailing" />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { AlertProps, AlertSlots } from './Alert.types'
import theme from './theme'

const props = withDefaults(defineProps<AlertProps>(), { as: 'div', indicator: true })
const slots = defineSlots<AlertSlots>()

const ui = useComponentUI('alert', theme, () => ({ status: props.status }))
</script>
