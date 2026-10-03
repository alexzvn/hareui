import type { Theme } from 'vitepress'
import { Icon, addCollection } from '@iconify/vue'
import gravityIcons from '@iconify-json/gravity-ui/icons.json'
import Layout from './Layout.vue'
import ComponentPreview from './components/ComponentPreview.vue'
import ApiTable from './components/ApiTable.vue'
import ApiTheme from './components/ApiTheme.vue'
import CollapsibleCode from './components/CollapsibleCode.vue'
import ColorSectionSideBySide from './components/ColorSectionSideBySide.vue'
import ColorSectionStacked from './components/ColorSectionStacked.vue'
import ColorSectionPrimitive from './components/ColorSectionPrimitive.vue'
import ColorSectionFormField from './components/ColorSectionFormField.vue'
import ComponentsCategory from './components/ComponentsCategory.vue'
import RelatedComponents from './components/RelatedComponents.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    addCollection(gravityIcons)
    app.component('ComponentPreview', ComponentPreview)
    app.component('ApiTable', ApiTable)
    app.component('ApiTheme', ApiTheme)
    app.component('CollapsibleCode', CollapsibleCode)
    app.component('ColorSectionSideBySide', ColorSectionSideBySide)
    app.component('ColorSectionStacked', ColorSectionStacked)
    app.component('ColorSectionPrimitive', ColorSectionPrimitive)
    app.component('ColorSectionFormField', ColorSectionFormField)
    app.component('ComponentsCategory', ComponentsCategory)
    app.component('RelatedComponents', RelatedComponents)
    app.component('Icon', Icon)
  },
} satisfies Theme
