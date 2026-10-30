<template>
  <div class="flex flex-wrap gap-3">
    <Button
      v-for="project in projects"
      :key="project.name"
      variant="secondary"
      @click="activity.open({ project: project.name, events: project.events })"
    >
      {{ project.name }} activity
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, useOverlay } from '@hareui/vue'

import ActivityDrawer from './components/ActivityDrawer.vue'

const overlay = useOverlay()

// One drawer, opened with different props each time.
const activity = overlay.create(ActivityDrawer)

const projects = [
  {
    name: 'Atlas',
    events: [
      { id: 1, summary: 'Priya merged the routing rewrite', time: '12 minutes ago' },
      { id: 2, summary: 'Tomás opened 3 issues', time: '1 hour ago' },
      { id: 3, summary: 'Release 1.8 was tagged', time: 'Yesterday' },
    ],
  },
  {
    name: 'Harbor',
    events: [
      { id: 1, summary: 'Mei updated the deploy checklist', time: '5 minutes ago' },
      { id: 2, summary: 'Nightly backup finished', time: '3 hours ago' },
    ],
  },
]
</script>
