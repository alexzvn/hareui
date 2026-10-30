<template>
  <CodeBlock :code="code" lang="python" :highlight="[3, [5, 6]]" class="max-w-[480px]" />
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'

const code = `import csv

def read_temperatures(path):
    with open(path) as file:
        rows = csv.DictReader(file)
        return [float(row["celsius"]) for row in rows]`
</script>
