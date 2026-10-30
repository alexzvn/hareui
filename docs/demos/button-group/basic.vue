<template>
  <div class="flex flex-col items-start gap-6">
    <!-- Single button with dropdown -->
    <div class="flex flex-col gap-2">
      <ButtonGroup separator>
        <Button>Merge pull request</Button>
        <Dropdown :items="mergeOptions" class="max-w-[290px]" align="end">
          <Button icon-only aria-label="More options">
            <Icon icon="gravity-ui:chevron-down" />
          </Button>
        </Dropdown>
      </ButtonGroup>
    </div>

    <!-- Individual buttons -->
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap gap-x-2 gap-y-4">
        <ButtonGroup separator variant="tertiary">
          <Button>
            <Icon class="size-3.5" icon="gravity-ui:code-fork" />
            Fork
            <Chip color="accent" size="sm" variant="soft"> 24 </Chip>
          </Button>
          <Button icon-only aria-label="More fork options">
            <Icon icon="gravity-ui:chevron-down" />
          </Button>
        </ButtonGroup>
        <ButtonGroup separator variant="tertiary">
          <Button icon-only aria-label="Show QR code">
            <Icon icon="gravity-ui:qr-code" />
          </Button>
          <Button>Scan to pay</Button>
        </ButtonGroup>
        <ButtonGroup separator variant="tertiary">
          <Button>
            <Icon icon="gravity-ui:thumbs-up" />
            <span class="text-xs font-semibold">2.4K</span>
          </Button>
          <Button icon-only aria-label="Dislike">
            <Icon icon="gravity-ui:thumbs-down" />
          </Button>
        </ButtonGroup>
        <ButtonGroup separator variant="tertiary">
          <Button>
            <Icon class="size-3.5" icon="gravity-ui:star" />
            Star
          </Button>
          <Button class="px-2">
            <Chip color="accent" size="sm" variant="soft"> 104 </Chip>
          </Button>
        </ButtonGroup>
        <ButtonGroup separator variant="tertiary">
          <Button>
            <Icon icon="gravity-ui:pin" />
            Pinned
          </Button>
          <Button icon-only aria-label="More pin options">
            <Icon icon="gravity-ui:chevron-down" />
          </Button>
        </ButtonGroup>
      </div>
    </div>

    <!-- Previous/Next Button Group -->
    <div class="flex flex-col gap-2">
      <ButtonGroup separator variant="tertiary">
        <Button>
          <Icon icon="gravity-ui:chevron-left" />
          Previous
        </Button>
        <Button>
          Next
          <Icon icon="gravity-ui:chevron-right" />
        </Button>
      </ButtonGroup>
    </div>

    <!-- Content Selection Button Group -->
    <div class="flex flex-col gap-2">
      <ButtonGroup separator variant="tertiary">
        <Button>
          <Icon icon="gravity-ui:picture" />
          Photos
        </Button>
        <Button>
          <Icon icon="gravity-ui:video" />
          Videos
        </Button>
        <Button icon-only aria-label="More options">
          <Icon icon="gravity-ui:ellipsis" />
        </Button>
      </ButtonGroup>
    </div>

    <!-- Text Alignment Button Group -->
    <div class="flex flex-col gap-2">
      <ButtonGroup separator variant="tertiary">
        <Button>Left</Button>
        <Button>Center</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </div>

    <!-- Icon-Only Alignment Button Group -->
    <div class="flex flex-col gap-2">
      <ButtonGroup separator variant="tertiary">
        <Button icon-only aria-label="Align left">
          <Icon icon="gravity-ui:text-align-left" />
        </Button>
        <Button icon-only aria-label="Align center">
          <Icon icon="gravity-ui:text-align-center" />
        </Button>
        <Button icon-only aria-label="Align right">
          <Icon icon="gravity-ui:text-align-right" />
        </Button>
        <Button icon-only aria-label="Justify">
          <Icon icon="gravity-ui:text-align-justify" />
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, ButtonGroup, Chip, Dropdown } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const mergeOptions: DropdownEntry[] = [
  {
    value: 'merge',
    label: 'Create a merge commit',
    description: 'All commits from this branch will be added to the base branch',
    class: 'flex flex-col items-start gap-1 [&>div]:items-start [&>div]:gap-1',
  },
  {
    value: 'squash-and-merge',
    label: 'Squash and merge',
    description:
      'The 14 commits from this branch will be combined into one commit in the base branch',
    class: 'flex flex-col items-start gap-1 [&>div]:items-start [&>div]:gap-1',
  },
  {
    value: 'rebase-and-merge',
    label: 'Rebase and merge',
    description: 'The 14 commits from this branch will be rebased and added to the base branch',
    class: 'flex flex-col items-start gap-1 [&>div]:items-start [&>div]:gap-1',
  },
]
</script>
