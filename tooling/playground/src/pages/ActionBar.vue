<script setup lang="ts">
import { ActionBar, Button, Chip, Separator } from '@hareui/vue'
import { ref } from 'vue'

const isOpen = ref(true)
const count = ref(3)

// `contain: paint` makes each frame the containing block of the fixed bar, so every case shows side by side.
const frame = 'relative h-40 overflow-hidden rounded-xl border border-separator bg-background [contain:paint]'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      ActionBar
    </h1>
    <p class="text-sm text-muted">
      Each frame contains its fixed bar. Arrow keys move between buttons; narrow the window below 640px to collapse the labels.
    </p>

    <section class="flex flex-col gap-3">
      <h2 class="font-medium">
        v-model:open (enter/exit animation)
      </h2>
      <div class="flex gap-2">
        <Button variant="secondary" @click="isOpen = !isOpen">
          Toggle ({{ isOpen ? 'open' : 'closed' }})
        </Button>
        <Button variant="tertiary" @click="count++">
          Add to selection
        </Button>
      </div>
      <div :class="frame">
        <ActionBar v-model:open="isOpen">
          <template #prefix>
            <Chip size="sm" variant="secondary" class="shrink-0 tabular-nums">
              {{ count }}
            </Chip>
          </template>
          <template #default="{ labelClass }">
            <Button size="sm" variant="ghost">
              ✎ <span :class="labelClass">Edit</span>
            </Button>
            <Button size="sm" variant="ghost">
              ⇩ <span :class="labelClass">Export</span>
            </Button>
            <Separator />
            <Button size="sm" variant="danger-soft">
              ✕ <span :class="labelClass">Delete</span>
            </Button>
          </template>
          <template #suffix="{ close }">
            <Button icon-only size="sm" variant="ghost" aria-label="Close" @click="close">
              ×
            </Button>
          </template>
        </ActionBar>
      </div>
    </section>

    <section v-for="attached in [true, false]" :key="String(attached)" class="flex flex-col gap-3">
      <h2 class="font-medium">
        attached={{ attached }}
      </h2>
      <div :class="frame">
        <ActionBar default-open :attached="attached">
          <template #prefix>
            <Chip size="sm" variant="secondary">
              2
            </Chip>
          </template>
          <Button size="sm" variant="ghost">
            Move
          </Button>
          <Button size="sm" variant="ghost">
            Copy
          </Button>
          <template #suffix>
            <Button icon-only size="sm" variant="ghost" aria-label="Clear">
              ×
            </Button>
          </template>
        </ActionBar>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-medium">
        orientation=vertical
      </h2>
      <div :class="frame" class="h-72">
        <ActionBar default-open orientation="vertical" aria-label="Alignment">
          <template #prefix>
            <Chip size="sm" variant="secondary">
              A
            </Chip>
          </template>
          <Button icon-only size="sm" variant="ghost" aria-label="Left">
            ⇤
          </Button>
          <Button icon-only size="sm" variant="ghost" aria-label="Right">
            ⇥
          </Button>
          <template #suffix>
            <Button icon-only size="sm" variant="ghost" aria-label="Close">
              ×
            </Button>
          </template>
        </ActionBar>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-medium">
        Slots: content only / prefix + suffix only
      </h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <div :class="frame">
          <ActionBar default-open>
            <Button size="sm" variant="ghost">
              Only content
            </Button>
          </ActionBar>
        </div>
        <div :class="frame">
          <ActionBar default-open>
            <template #prefix>
              <span class="text-sm">Prefix</span>
            </template>
            <template #suffix>
              <Button size="sm" variant="ghost">
                Suffix
              </Button>
            </template>
          </ActionBar>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-medium">
        :ui override (right-aligned, square-ish pill)
      </h2>
      <div :class="frame">
        <ActionBar default-open :ui="{ base: 'justify-end px-6', toolbar: 'rounded-xl' }" class="bg-surface-secondary">
          <Button size="sm" variant="ghost">
            Preview
          </Button>
          <Button size="sm">
            Publish
          </Button>
        </ActionBar>
      </div>
    </section>
  </div>
</template>
