<template>
  <div class="flex w-full max-w-[480px] flex-col gap-4">
    <CodeBlock
      :code="token"
      lang="text"
      :copy="{ label: 'Copy access token', copiedLabel: 'Token copied', duration: 4000 }"
    />
    <CodeBlock :code="query" lang="sql" :copy="false" />
  </div>
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'

const token = 'hk_live_4f9a2c71e8b3d605'

const query = `SELECT city, COUNT(*) AS stores
FROM shops
GROUP BY city
ORDER BY stores DESC;`
</script>
