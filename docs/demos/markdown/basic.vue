<template>
  <Markdown :value="value" class="max-w-xl" />
</template>

<script setup lang="ts">
import { Markdown } from '@hareui/vue/markdown'

const value = `## Planning a weekend in Lisbon

Lisbon is **hilly**, so pack comfortable shoes. Tram 28 is the classic ride, but it gets _crowded_ by mid-morning.

1. Start in Alfama before the crowds
2. Walk up to the Miradouro da Senhora do Monte
3. End the day in Bairro Alto

- [x] Book the hotel
- [ ] Reserve a table for fado

| Day | Area | Budget |
| --- | --- | ---: |
| Saturday | Alfama | €60 |
| Sunday | Belém | €45 |

> Pastéis de nata taste best warm, straight from the oven.

Check the [tram timetable](https://www.carris.pt) before you go. To see a price in your own currency, run \`convert(60, 'USD')\`:

\`\`\`ts
const rates: Record<string, number> = { EUR: 1, USD: 1.08, GBP: 0.85 }

const convert = (euros: number, currency: string) => {
  const rate = rates[currency] ?? 1
  return Math.round(euros * rate)
}
\`\`\`
`
</script>
