<template>
  <div class="relative overflow-auto prose-no-margin my-6">
    <table class="api-table">
      <thead>
        <tr>
          <th class="col-name">{{ table.head[0] }}</th>
          <th class="col-type">{{ table.head[1] }}</th>
          <th v-if="table.defaults" class="col-default">Default</th>
          <th class="col-description">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.rows" :key="row.name">
          <td class="col-name">
            <code
              ><template v-for="(segment, k) in row.name.split('.')" :key="k"
                ><template v-if="k">.<wbr /></template><span>{{ segment }}</span></template
              ></code
            >
          </td>
          <td class="col-type">
            <code v-if="row.type"
              ><template v-for="(token, k) in tokens(row.type)" :key="k"
                >{{ k ? ' ' : ''
                }}<template v-for="(piece, p) in pieces(token)" :key="p"
                  ><wbr v-if="p" /><span>{{ piece }}</span></template
                ></template
              ></code
            >
            <template v-else>-</template>
          </td>
          <td v-if="table.defaults" class="col-default">
            <code v-if="row.default !== undefined"
              ><template v-for="(token, k) in tokens(row.default, false)" :key="k"
                >{{ k ? ' ' : '' }}<span>{{ token }}</span></template
              ></code
            >
            <template v-else>-</template>
          </td>
          <td class="col-description">
            <template v-for="(part, j) in inline(row.description)" :key="j">
              <code v-if="part.kind === 'code'">{{ part.text }}</code>
              <a
                v-else-if="part.kind === 'link'"
                :href="part.href"
                v-bind="part.href.startsWith('http') ? external : {}"
                >{{ part.text }}</a
              >
              <template v-else>{{ part.text }}</template>
            </template>
            <template v-if="!row.description">-</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

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

type Row = { name: string; type: string; description: string; default?: string }

// Rows of name, type, description and, for props, default.
const table = computed((): { head: [string, string]; defaults: boolean; rows: Row[] } => {
  const data = api.value
  if (props.kind === 'props') {
    // A nested prop group's members follow it as `group.member` rows.
    return {
      head: ['Prop', 'Type'],
      defaults: true,
      rows: data.props.flatMap((p) => [
        { name: p.name, type: p.type, description: p.description, default: p.default },
        ...(p.members ?? []).map((m) => ({
          name: `${p.name}.${m.name}`,
          type: m.type,
          description: m.description,
          default: m.default,
        })),
      ]),
    }
  }

  if (props.kind === 'slots') {
    return {
      head: ['Slot', 'Props'],
      defaults: false,
      rows: data.slots.map((s) => ({ name: s.name, type: s.type, description: s.description })),
    }
  }

  return {
    head: ['Event', 'Payload'],
    defaults: false,
    rows: data.events.map((e) => ({ name: e.name, type: e.type, description: e.description })),
  }
})

type Part = { kind: 'text' | 'code'; text: string } | { kind: 'link'; text: string; href: string }

const external = { target: '_blank', rel: 'noreferrer' }

// A type or default as the pieces a line may break between: words split at spaces, with an operator (`|`, `&`, `=>`)
// or closing bracket kept at the end of the word before it. In a type an opening bracket stays with the word after
// it; a default (often an object literal such as `{ gap: 4 }`) may break after it.
const tokens = (text: string, shouldJoinOpening = true): string[] => {
  const words = text.split(' ')
  const merged: string[] = []
  let opening = ''
  for (const word of words) {
    const isOpening = /^[({[]+$/.test(word)
    if (isOpening && shouldJoinOpening) {
      opening += `${word} `
      continue
    }

    if (isOpening) {
      merged.push(word)
      continue
    }

    const punctuation = /^[^\w"'`$]+$/.test(word)
    const previous = merged.length - 1
    if (punctuation && !opening && previous >= 0) {
      merged[previous] += ` ${word}`
      continue
    }

    merged.push(opening + word)
    opening = ''
  }

  if (opening) merged.push(opening.trimEnd())

  return merged
}

// Words up to this length stay whole; a longer one (a nested generic such as `SlotProps<Group<Item>>`) may also break
// after each `<` or `,`, between type names, so it does not stretch the column past the description.
const LONG_WORD = 24

const pieces = (token: string): string[] => {
  return token.length > LONG_WORD ? token.split(/(?<=[<,])/) : [token]
}

// A description's inline markdown: `code` spans and [links](url). A `{lang="…"}` after a code span is a highlighting
// hint for other renderers and is dropped.
const inline = (text: string): Part[] => {
  return text.split('`').flatMap((segment, i): Part[] => {
    if (i % 2) return [{ kind: 'code', text: segment }]

    const plain = i > 0 ? segment.replace(/^\{lang="[\w-]+"\}/, '') : segment
    const parts: Part[] = []
    let from = 0
    for (const link of plain.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
      parts.push({ kind: 'text', text: plain.slice(from, link.index) })
      parts.push({ kind: 'link', text: link[1]!, href: link[2]! })
      from = link.index + link[0].length
    }

    parts.push({ kind: 'text', text: plain.slice(from) })

    return parts
  })
}
</script>

<style scoped>
/* The description takes the spare width. Names keep each segment on one line (a nested `group.member` name may break
   after its dot); types and defaults break only between words (see `pieces` for long ones), so each grows to fit its
   longest word, and a prose default wraps at its spaces. Tight padding between the code columns and smaller code text
   in them leave the description its minimum width. */
.api-table {
  width: 100%;
}

.api-table th,
.api-table td {
  padding-inline: 6px;
}

.api-table th:first-child,
.api-table td:first-child {
  padding-left: 8px;
}

.api-table th:last-child,
.api-table td:last-child {
  padding-right: 8px;
}

.api-table td code {
  font-size: 0.75rem;
}

.api-table td.col-type code,
.api-table td.col-default code {
  font-size: 0.6875rem;
}

.api-table th.col-name,
.api-table td.col-name span {
  white-space: nowrap;
}

.api-table th.col-type {
  width: 30%;
}

.api-table th.col-default {
  width: 15%;
}

.api-table td.col-type {
  min-width: 8rem;
}

.api-table td.col-type code,
.api-table td.col-default code {
  display: inline-block;
  white-space: normal;
}

.api-table td.col-type span,
.api-table td.col-default span {
  white-space: nowrap;
}

.api-table .col-description {
  min-width: 240px;
}
</style>
