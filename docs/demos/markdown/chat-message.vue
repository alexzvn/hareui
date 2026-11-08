<template>
  <div class="flex w-full max-w-xl flex-col gap-3">
    <ChatMessage :message="question" />
    <ChatMessage :message="answer" icon="icon-[gravity-ui--sparkles]" :actions="actions">
      <template #text="{ part }">
        <Markdown :value="part.text" />
      </template>
    </ChatMessage>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'
import { Markdown } from '@hareui/vue/markdown'

const question: ChatMessageData = {
  id: 'question',
  role: 'user',
  parts: [{ type: 'text', text: 'How should we name git branches on the team?' }],
}

const answer: ChatMessageData = {
  id: 'answer',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: `## Branch names

Start each name with the **kind** of change, then a short summary:

- \`feat/\` for new features
- \`fix/\` for bug fixes
- \`chore/\` for tooling and upkeep

| Branch | Clear? |
| --- | --- |
| \`fix/login-timeout\` | Yes |
| \`daniels-branch\` | No, it says nothing about the change |

Create one from \`main\`:

\`\`\`bash
git switch main
git switch -c fix/login-timeout
\`\`\``,
    },
  ],
}

const actions: ChatMessageAction[] = [{ kind: 'copy' }, { kind: 'like' }, { kind: 'regenerate' }]
</script>
