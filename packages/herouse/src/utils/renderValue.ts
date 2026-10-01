import type { PropType, VNodeChild } from 'vue'
import { defineComponent } from 'vue'

/**
 * Renders an arbitrary `VNodeChild` held in reactive data (e.g. a toast's
 * `title`/`description`/`indicator`), as opposed to a template slot. Vue has
 * no built-in way to type a prop as "any value, unvalidated at runtime"
 * other than `type: null`, which has no matching `PropType`, hence the cast.
 */
export default defineComponent({
  name: 'RenderValue',
  props: {
    value: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  render() {
    return this.value
  },
})
