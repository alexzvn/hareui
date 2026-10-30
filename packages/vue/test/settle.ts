import { nextTick } from 'vue'

/** Flushes a few render ticks, enough for Reka's presence and focus work to land. */
export const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick()
}
