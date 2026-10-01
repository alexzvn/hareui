import type { Theme } from 'vitepress'
import { Icon, addCollection } from '@iconify/vue'
import gravityIcons from '@iconify-json/gravity-ui/icons.json'
import Layout from './Layout.vue'
import ComponentPreview from './components/ComponentPreview.vue'
import ApiTable from './components/ApiTable.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    addCollection(gravityIcons)
    app.component('ComponentPreview', ComponentPreview)
    app.component('ApiTable', ApiTable)
    app.component('Icon', Icon)
  },
} satisfies Theme
