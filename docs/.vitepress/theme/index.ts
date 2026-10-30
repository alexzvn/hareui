import gravityIcons from '@iconify-json/gravity-ui/icons.json'
import { Icon, addCollection } from '@iconify/vue'
import type { Theme } from 'vitepress'

import ApiTable from './components/ApiTable.vue'
import ApiTheme from './components/ApiTheme.vue'
import CollapsibleCode from './components/CollapsibleCode.vue'
import ColorSectionFormField from './components/ColorSectionFormField.vue'
import ColorSectionPrimitive from './components/ColorSectionPrimitive.vue'
import ColorSectionSideBySide from './components/ColorSectionSideBySide.vue'
import ColorSectionStacked from './components/ColorSectionStacked.vue'
import ComponentPreview from './components/ComponentPreview.vue'
import ComponentsCategory from './components/ComponentsCategory.vue'
import Faq from './components/Faq.vue'
import FaqItem from './components/FaqItem.vue'
import RelatedComponents from './components/RelatedComponents.vue'
import Layout from './Layout.vue'
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
    app.component('Faq', Faq)
    app.component('FaqItem', FaqItem)
    app.component('Icon', Icon)
  },
} satisfies Theme
