---
title: HeroUse
description: Redirecting to the HeroUse documentation.
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
onMounted(() => router.go('/docs/getting-started/'))
</script>

Redirecting to [the documentation](/docs/getting-started/)…
