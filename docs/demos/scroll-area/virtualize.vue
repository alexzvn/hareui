<template>
  <ScrollArea
    v-slot="{ item, index }"
    :items="contacts"
    :virtualize="{ estimateSize: 56, skipMeasurement: true }"
    class="h-96 w-full max-w-md rounded-2xl border border-border bg-surface"
  >
    <div
      class="flex h-14 items-center gap-3 px-4"
      :class="index < contacts.length - 1 && 'border-b border-separator'"
    >
      <span
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-default text-xs font-medium text-default-foreground"
      >
        {{ item.initials }}
      </span>
      <div class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-sm font-medium text-foreground">{{ item.name }}</span>
        <span class="truncate text-xs text-muted">{{ item.email }}</span>
      </div>
      <span class="shrink-0 text-xs text-muted">{{ item.team }}</span>
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@hareui/vue'

const FIRST = [
  'Ada',
  'Amara',
  'Bruno',
  'Chen',
  'Dalia',
  'Elif',
  'Farah',
  'Gustav',
  'Hana',
  'Idris',
  'Jonas',
  'Kaito',
  'Lena',
  'Mateo',
  'Nadia',
  'Omar',
  'Priya',
  'Quinn',
  'Rosa',
  'Sven',
  'Tariq',
  'Uma',
  'Viktor',
  'Wen',
  'Yara',
  'Zofia',
  'Aiko',
  'Diego',
  'Freya',
  'Kofi',
]

const LAST = [
  'Andersen',
  'Barros',
  'Costa',
  'Dubois',
  'Eriksen',
  'Fischer',
  'Garcia',
  'Haddad',
  'Ito',
  'Jensen',
  'Kowalski',
  'Lindqvist',
  'Moreau',
  'Nakamura',
  'Okafor',
  'Petrov',
  'Quispe',
  'Rossi',
  'Santos',
  'Tanaka',
  'Usman',
  'Varga',
  'Weber',
  'Yilmaz',
  'Zhang',
  'Mensah',
  'Novak',
  'Ortiz',
  'Sato',
  'Bauer',
]

const TEAMS = ['Design', 'Engineering', 'Support', 'Marketing', 'Finance', 'Sales', 'Legal']

// 10,000 contacts, of which only those in view are rendered. The strides mix the name pools so neighbours differ
const contacts = Array.from({ length: 10_000 }, (_, index) => {
  const first = FIRST[(index * 7) % FIRST.length]!
  const last = LAST[(index * 11 + Math.floor(index / FIRST.length)) % LAST.length]!

  return {
    id: index,
    name: `${first} ${last}`,
    email: `${first}.${last}@example.com`.toLowerCase(),
    initials: `${first[0]}${last[0]}`,
    team: TEAMS[(index * 3) % TEAMS.length]!,
  }
})
</script>
