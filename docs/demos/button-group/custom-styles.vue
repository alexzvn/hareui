<template>
  <ButtonGroup separator>
    <Button class="rounded-none bg-[#08872B] hover:bg-[#0FBF3E]"> Merge pull request </Button>
    <Dropdown :items="mergeOptions" class="max-w-[290px] rounded-none" align="end">
      <Button
        icon-only
        aria-label="Merge options"
        class="rounded-none bg-[#08872B] hover:bg-[#0FBF3E]"
      >
        <Icon class="size-4" icon="gravity-ui:chevron-down" />
      </Button>
    </Dropdown>
  </ButtonGroup>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, ButtonGroup, Dropdown } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const mergeOptions: DropdownEntry[] = [
  {
    value: 'merge',
    label: 'Create a merge commit',
    description: 'All commits from this branch will be added to the base branch',
    class: 'flex flex-col items-start gap-1 rounded-none [&>div]:items-start [&>div]:gap-1',
  },
  {
    value: 'squash-and-merge',
    label: 'Squash and merge',
    description:
      'The 14 commits from this branch will be combined into one commit in the base branch',
    class: 'flex flex-col items-start gap-1 rounded-none [&>div]:items-start [&>div]:gap-1',
  },
  {
    value: 'rebase-and-merge',
    label: 'Rebase and merge',
    description: 'The 14 commits from this branch will be rebased and added to the base branch',
    class: 'flex flex-col items-start gap-1 rounded-none [&>div]:items-start [&>div]:gap-1',
  },
]
</script>
