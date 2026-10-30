<template>
  <Rating
    color="danger"
    label="Spice level"
    :icon="Flame"
    :item-label="(value) => `${value} chili${value > 1 ? 's' : ''}`"
    :default-value="2"
  />
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const Flame = () => h(Icon, { icon: 'gravity-ui:flame' })
</script>
