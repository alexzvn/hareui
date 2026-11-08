<template>
  <Sheet
    title="Share"
    class="mx-auto max-w-[480px]"
    :ui="{ body: 'flex flex-col gap-5 pb-6' }"
    @update:open="isCopied = false"
  >
    <Button variant="secondary">
      <Icon icon="gravity-ui:arrow-up-from-square" />
      Share
    </Button>
    <template #body="{ close }">
      <div class="flex items-center gap-3">
        <div
          class="size-12 shrink-0 rounded-xl bg-linear-to-br from-emerald-400 to-sky-500"
          aria-hidden="true"
        />
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-sm font-medium">Weekend in Lisbon</span>
          <span class="truncate text-xs text-muted">Photo album · 48 photos</span>
        </div>
      </div>
      <ul class="grid grid-cols-4 gap-x-2 gap-y-4">
        <li v-for="target in targets" :key="target.label">
          <button
            type="button"
            class="flex w-full flex-col items-center gap-2 rounded-xl p-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-focus"
            @click="close"
          >
            <span
              class="flex size-12 items-center justify-center rounded-2xl bg-default transition-colors hover:bg-default-hover"
            >
              <Icon class="size-6" :icon="target.icon" />
            </span>
            <span class="w-full truncate text-center">{{ target.label }}</span>
          </button>
        </li>
      </ul>
      <div class="flex items-center gap-3 rounded-2xl bg-default p-3">
        <Icon class="size-5 shrink-0 text-muted" icon="gravity-ui:link" />
        <span class="min-w-0 flex-1 truncate text-sm">{{ link }}</span>
        <Button size="sm" variant="tertiary" @click="copy">
          <Icon :icon="isCopied ? 'gravity-ui:copy-check' : 'gravity-ui:copy'" />
          {{ isCopied ? 'Copied' : 'Copy link' }}
        </Button>
      </div>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const link = 'https://photos.example.com/a/lisbon-weekend'

const targets = [
  { label: 'Messages', icon: 'gravity-ui:comments' },
  { label: 'Mail', icon: 'gravity-ui:envelope' },
  { label: 'Telegram', icon: 'gravity-ui:logo-telegram' },
  { label: 'Slack', icon: 'gravity-ui:logo-slack' },
  { label: 'LinkedIn', icon: 'gravity-ui:logo-linkedin' },
  { label: 'Facebook', icon: 'gravity-ui:logo-facebook' },
  { label: 'QR code', icon: 'gravity-ui:qr-code' },
  { label: 'Print', icon: 'gravity-ui:printer' },
]

const isCopied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(link)
  isCopied.value = true
}
</script>
