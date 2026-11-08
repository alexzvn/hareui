<template>
  <aside
    class="flex w-full max-w-80 flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
  >
    <span class="text-xs font-medium text-muted">Assistant</span>
    <Markdown :value="value" :ui="ui" />
  </aside>
</template>

<script setup lang="ts">
import { Markdown } from '@hareui/vue/markdown'

// Each key styles one tag. `base` is the root, so its text size reaches every block.
const ui = {
  base: 'text-xs',
  h2: 'mt-3 mb-1.5 text-sm',
  p: 'mb-2',
  ul: 'mb-2',
  table: 'text-xs',
  th: 'px-2 py-1.5',
  td: 'px-2 py-1.5',
}

const value = `## Branch names

Start each name with the **kind** of change, then a short summary:

- \`feat/\` for new features
- \`fix/\` for bug fixes
- \`chore/\` for tooling and upkeep

| Branch | Clear? |
| --- | --- |
| \`fix/login-timeout\` | Yes |
| \`daniels-branch\` | No |

Create one from \`main\`:

\`\`\`bash
git switch main
git switch -c fix/login-timeout
\`\`\``
</script>
