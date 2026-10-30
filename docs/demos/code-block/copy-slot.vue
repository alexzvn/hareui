<template>
  <CodeBlock :code="code" lang="bash" class="max-w-[480px]">
    <template #copy="{ copied, copy }">
      <Button size="sm" variant="tertiary" class="h-6 gap-1 px-2 text-xs" @click="copy">
        <Icon :icon="copied ? 'gravity-ui:check' : 'gravity-ui:copy'" class="size-3" />
        {{ copied ? 'Copied' : 'Copy' }}
      </Button>
    </template>
  </CodeBlock>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { CodeBlock } from '@hareui/vue/code-block'
import { Icon } from '@iconify/vue'

const code = 'bun add @hareui/vue shiki'
</script>
