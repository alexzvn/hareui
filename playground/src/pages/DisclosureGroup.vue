<script setup lang="ts">
import type { ExpandedValue } from 'herouse'
import { Button, Disclosure, DisclosureGroup, Separator, useDisclosureGroupNavigation } from 'herouse'
import { ref } from 'vue'

const expanded = ref<ExpandedValue[]>(['one'])
const { isNextDisabled, isPrevDisabled, onNext, onPrevious } = useDisclosureGroupNavigation({
  expandedKeys: expanded,
  itemIds: ['one', 'two', 'three'],
  onExpandedChange: (keys) => { expanded.value = keys },
})
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">DisclosureGroup</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">v-model + useDisclosureGroupNavigation</h2>
      <div class="mb-2 flex items-center gap-2">
        <p class="text-xs text-muted">
          Expanded: <span class="font-mono font-medium text-foreground">{{ expanded.join(', ') || 'none' }}</span>
        </p>
        <Button size="sm" variant="secondary" :disabled="isPrevDisabled" @click="onPrevious">Prev</Button>
        <Button size="sm" variant="secondary" :disabled="isNextDisabled" @click="onNext">Next</Button>
      </div>
      <DisclosureGroup v-model="expanded" class="max-w-md">
        <Disclosure value="one" title="First section"><p class="text-sm text-muted">Content one.</p></Disclosure>
        <Separator class="my-2" />
        <Disclosure value="two" title="Second section"><p class="text-sm text-muted">Content two.</p></Disclosure>
        <Separator class="my-2" />
        <Disclosure value="three" title="Third section"><p class="text-sm text-muted">Content three.</p></Disclosure>
      </DisclosureGroup>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">multiple</h2>
      <DisclosureGroup multiple :default-value="['a', 'b']" class="max-w-md">
        <Disclosure value="a" title="First section"><p class="text-sm text-muted">Content one.</p></Disclosure>
        <Disclosure value="b" title="Second section"><p class="text-sm text-muted">Content two.</p></Disclosure>
      </DisclosureGroup>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">disabled</h2>
      <DisclosureGroup disabled :default-value="['a']" class="max-w-md">
        <Disclosure value="a" title="First section"><p class="text-sm text-muted">Content one.</p></Disclosure>
        <Disclosure value="b" title="Second section"><p class="text-sm text-muted">Content two.</p></Disclosure>
      </DisclosureGroup>
    </section>
  </div>
</template>
