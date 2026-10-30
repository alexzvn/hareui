<template>
  <Button variant="secondary" @click="releaseNotes.open()">See what's new</Button>
</template>

<script setup lang="ts">
import { Button, useOverlay } from '@hareui/vue'

import ReleaseNotesModal from './components/ReleaseNotesModal.vue'

const overlay = useOverlay()

const releaseNotes = overlay.create(ReleaseNotesModal, {
  props: {
    version: '2.4',
    notes: [
      'Boards can now be archived from the sidebar.',
      'Comments support @mentions and emoji reactions.',
      'Exports finish twice as fast on large workspaces.',
    ],
  },
})
</script>
