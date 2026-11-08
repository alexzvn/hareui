<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatMessage
      v-for="message in messages"
      :key="message.id"
      role="user"
      :side="message.side"
      :avatar="message.author.avatar"
      :parts="[{ type: 'text', text: message.text }]"
    >
      <template #header>
        <span class="text-xs text-muted">
          <span class="font-medium text-foreground">{{ message.author.name }}</span>
          · {{ message.time }}
        </span>
      </template>
    </ChatMessage>
  </div>
</template>

<script setup lang="ts">
import type { AvatarProps } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'

type Author = {
  name: string
  avatar: AvatarProps
}

type Message = {
  id: string
  author: Author
  side: 'start' | 'end'
  time: string
  text: string
}

const nadia: Author = {
  name: 'Nadia Okafor',
  avatar: {
    src: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=5',
    alt: 'Nadia Okafor',
    fallback: 'NO',
  },
}

const tomas: Author = {
  name: 'Tomás Reyes',
  avatar: {
    src: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=8',
    alt: 'Tomás Reyes',
    fallback: 'TR',
  },
}

const messages: Message[] = [
  {
    id: '1',
    author: nadia,
    side: 'start',
    time: '09:12',
    text: 'The venue confirmed the room for Friday. Can you send them the final headcount?',
  },
  {
    id: '2',
    author: tomas,
    side: 'end',
    time: '09:15',
    text: "Sure. We're at 24, including the two guests from the Lisbon office.",
  },
  {
    id: '3',
    author: nadia,
    side: 'start',
    time: '09:16',
    text: "Perfect, I'll ask for vegetarian options too.",
  },
]
</script>
