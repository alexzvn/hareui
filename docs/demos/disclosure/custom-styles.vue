<script setup lang="ts">
import { Button, Disclosure } from 'herouse'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isExpanded = ref(false)
</script>

<template>
  <div class="w-full max-w-sm">
    <Disclosure
      v-model:open="isExpanded"
      :ui="{ bodyInner: 'mt-2 rounded-xl border border-border/70 bg-surface/50 p-4 text-sm leading-relaxed text-muted dark:bg-neutral-900/50' }"
    >
      <template #trigger="{ indicator }">
        <Button
          class="w-full justify-between rounded-xl border border-border/70 bg-linear-to-b from-neutral-50/90 to-white px-4 py-3 font-medium text-foreground shadow-sm ring-1 ring-black/5 hover:bg-muted/30 dark:from-neutral-900/80 dark:to-neutral-900 dark:ring-white/10"
          variant="ghost"
        >
          <span class="flex items-center gap-2">
            <Icon class="size-4 text-muted" icon="gravity-ui:shopping-bag" />
            Shipping details
          </span>
          <component :is="indicator" class="text-muted" />
        </Button>
      </template>
      Orders ship within 2 business days. Standard delivery takes 3–5 days; express is
      available at checkout.
    </Disclosure>
  </div>
</template>
