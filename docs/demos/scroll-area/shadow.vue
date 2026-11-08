<template>
  <div
    class="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface"
  >
    <div class="flex items-center gap-3 border-b border-separator px-4 py-3">
      <Avatar fallback="MO" size="sm" />
      <div class="flex flex-col">
        <span class="text-sm font-medium text-foreground">Mia Okafor</span>
        <span class="text-xs text-muted">Design review</span>
      </div>
    </div>
    <ScrollArea
      ref="area"
      v-slot="{ item }"
      :items="messages"
      :shadow="{ size: 48 }"
      :ui="{ viewport: 'gap-2 p-3' }"
      class="h-80"
    >
      <div class="flex flex-col gap-1" :class="item.isMine ? 'items-end' : 'items-start'">
        <p
          class="max-w-[80%] rounded-2xl px-3 py-2 text-sm"
          :class="item.isMine ? 'bg-accent text-accent-foreground' : 'bg-default text-foreground'"
        >
          {{ item.text }}
        </p>
        <span class="px-1 text-xs text-muted">{{ item.time }}</span>
      </div>
    </ScrollArea>
  </div>
</template>

<script setup lang="ts">
import { Avatar, ScrollArea } from '@hareui/vue'
import { onMounted, useTemplateRef } from 'vue'

const messages = [
  { text: 'Morning! Is the review still at ten?', time: '8:12', isMine: true },
  { text: 'Yes, same room as last week.', time: '8:14', isMine: false },
  { text: 'Great. I will bring the printed mockups.', time: '8:15', isMine: true },
  { text: 'Can you also bring the usage numbers?', time: '8:15', isMine: false },
  { text: 'Sure, I will pull them this morning.', time: '8:16', isMine: true },
  { text: 'Thanks. Sam is joining remotely.', time: '8:20', isMine: false },
  { text: 'I will send Sam the call link.', time: '8:21', isMine: true },
  { text: 'Perfect, see you at ten.', time: '8:21', isMine: false },
  { text: 'Running five minutes late, start without me.', time: '9:58', isMine: false },
  { text: 'No problem, we will begin with the roadmap.', time: '9:59', isMine: true },
  { text: 'Back online, joining now.', time: '10:06', isMine: false },
  { text: 'Welcome back! We are on slide four.', time: '10:06', isMine: true },
].map((message, id) => ({ id, ...message }))

const area = useTemplateRef('area')

// A conversation opens on its latest message
onMounted(() => {
  const element = area.value?.$el
  if (element) element.scrollTop = element.scrollHeight
})
</script>
