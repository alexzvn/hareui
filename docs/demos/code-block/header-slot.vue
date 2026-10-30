<template>
  <CodeBlock :code="code" lang="go" filename="main.go" class="max-w-[480px]">
    <template #header="{ filename, lang }">
      <div class="flex min-w-0 items-center gap-2">
        <span class="truncate text-xs font-medium text-foreground">{{ filename }}</span>
        <Chip color="accent" size="sm" variant="soft">{{ lang }}</Chip>
      </div>
    </template>
  </CodeBlock>
</template>

<script setup lang="ts">
import { Chip } from '@hareui/vue'
import { CodeBlock } from '@hareui/vue/code-block'

const code = `package main

import "fmt"

func main() {
\tfmt.Println("Build finished in 1.8s")
}`
</script>
