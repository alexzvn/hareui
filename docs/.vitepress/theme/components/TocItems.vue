<template>
  <div
    v-if="items.length === 0"
    class="rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground"
  >
    No Headings
  </div>
  <div v-else ref="container" class="relative">
    <div
      class="bg-fd-primary absolute inset-s-0 top-(--fd-top) h-(--fd-height) w-px transition-[top,height] ease-linear data-[hidden=true]:opacity-0"
      :data-hidden="active.length === 0"
      :style="{ '--fd-top': `${rail.top}px`, '--fd-height': `${rail.height}px` }"
    />
    <div class="border-fd-foreground/10 flex flex-col border-s">
      <a
        v-for="item in items"
        :key="item.id"
        :data-active="activeSet.has(item.id)"
        :href="`#${item.id}`"
        :class="[ITEM_CLASS, indent(item.depth)]"
        >{{ item.text }}</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import type { TocItem } from '../composables/useToc'

const props = defineProps<{ items: TocItem[]; active: string[] }>()

const container = ref<HTMLElement>()
const rail = ref({ top: 0, height: 0 })

const ITEM_CLASS =
  'prose text-fd-muted-foreground hover:text-fd-accent-foreground data-[active=true]:text-fd-primary scroll-m-4 py-1.5 text-sm wrap-anywhere transition-colors first:pt-0 last:pb-0'

const indent = (depth: number) => {
  return depth <= 2 ? 'ps-3' : depth === 3 ? 'ps-6' : 'ps-8'
}

const activeSet = computed(() => new Set(props.active))

const measure = () => {
  const el = container.value
  if (!el || props.active.length === 0) return
  const anchors = props.active
    .map((id) => el.querySelector<HTMLElement>(`a[href="#${CSS.escape(id)}"]`))
    .filter((a): a is HTMLElement => !!a)
  if (anchors.length === 0) return
  const first = anchors[0]
  const last = anchors[anchors.length - 1]
  const top = first.offsetTop + parseFloat(getComputedStyle(first).paddingTop)
  const bottom =
    last.offsetTop + last.clientHeight - parseFloat(getComputedStyle(last).paddingBottom)
  rail.value = { top, height: bottom - top }
}

watch(
  () => [props.active, props.items],
  () => nextTick(measure),
  { deep: true },
)
</script>
