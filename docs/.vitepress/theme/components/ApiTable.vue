<script setup lang="ts">
import { computed } from 'vue'

import type { ComponentApi } from '../../../scripts/api-types'

const props = defineProps<{ component: string; kind: 'props' | 'slots' | 'emits' }>()

const files = import.meta.glob<ComponentApi>('../../api/*.json', { import: 'default', eager: true })

const api = computed(() => {
  const data = files[`../../api/${props.component}.json`]
  if (!data)
    throw new Error(
      `ApiTable: missing docs/.vitepress/api/${props.component}.json (run \`bun run api\`)`,
    )
  return data
})

const table = computed(() => {
  const data = api.value
  if (props.kind === 'props') {
    return {
      head: ['Prop', 'Type', 'Default', 'Description'],
      rows: data.props.map((p) => [p.name, p.type, p.default ?? '-', p.description]),
    }
  }
  if (props.kind === 'slots') {
    return {
      head: ['Slot', 'Props', 'Description'],
      rows: data.slots.map((s) => [s.name, s.type, s.description]),
    }
  }
  return {
    head: ['Event', 'Payload', 'Description'],
    rows: data.events.map((e) => [e.name, e.type, e.description]),
  }
})

const codeColumns = computed(() => (props.kind === 'props' ? [0, 1, 2] : [0, 1]))
</script>

<template>
  <div class="relative overflow-auto prose-no-margin my-6">
    <table>
      <thead>
        <tr>
          <th v-for="h in table.head" :key="h">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.rows" :key="row[0]">
          <td v-for="(cell, i) in row" :key="i">
            <code v-if="codeColumns.includes(i) && cell !== '-' && cell !== ''">{{ cell }}</code>
            <template v-else-if="cell">
              <template v-for="(part, j) in cell.split('`')" :key="j"
                ><code v-if="j % 2">{{ part }}</code
                ><template v-else>{{ part }}</template></template
              >
            </template>
            <template v-else>-</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
