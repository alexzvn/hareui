// Port of HeroUI docs' components-category.tsx groups, limited to components HareUI has a page for.
// Shared by the sidebar and the "All Components" page; group order is alphabetical, as on that page.
export const COMPONENT_GROUPS: Record<string, readonly string[]> = {
  'Buttons': ['button', 'button-group', 'close-button', 'toggle-button', 'toggle-button-group'],
  'Collections': ['dropdown', 'list-box', 'tag-group'],
  'Colors': ['color-area', 'color-field', 'color-picker', 'color-slider', 'color-swatch', 'color-swatch-picker'],
  'Controls': ['slider', 'switch'],
  'Dashboard': [
    'dashboard-group',
    'dashboard-navbar',
    'dashboard-panel',
    'dashboard-resize-handle',
    'dashboard-sidebar',
    'dashboard-sidebar-collapse',
    'dashboard-sidebar-toggle',
    'dashboard-toolbar',
  ],
  'Data Display': ['badge', 'chip', 'rich-table', 'table'],
  'Date and Time': ['calendar', 'date-field', 'date-picker', 'date-range-picker', 'range-calendar', 'time-field'],
  'Feedback': ['alert', 'meter', 'progress-bar', 'progress-circle', 'skeleton', 'spinner'],
  'Forms': [
    'checkbox',
    'checkbox-group',
    'description',
    'field-error',
    'fieldset',
    'form',
    'input',
    'input-group',
    'input-otp',
    'label',
    'number-field',
    'radio-group',
    'search-field',
    'text-field',
    'text-area',
  ],
  'Layout': ['app', 'card', 'container', 'error', 'footer', 'header', 'main', 'separator', 'surface', 'toolbar'],
  'Media': ['avatar', 'avatar-group'],
  'Navigation': ['accordion', 'breadcrumbs', 'disclosure', 'disclosure-group', 'link', 'navigation-menu', 'pagination', 'tabs'],
  'Overlays': ['alert-dialog', 'drawer', 'modal', 'popover', 'toast', 'tooltip'],
  'Pickers': ['autocomplete', 'combo-box', 'select'],
  'Typography': ['kbd', 'typography'],
  'Utilities': ['scroll-shadow'],
}

// Pages that get a "New" badge in the sidebar. Clear entries once they stop being new.
export const NEW_COMPONENTS: ReadonlySet<string> = new Set([
  'app',
  'container',
  'dashboard-group',
  'dashboard-navbar',
  'dashboard-panel',
  'dashboard-resize-handle',
  'dashboard-sidebar',
  'dashboard-sidebar-collapse',
  'dashboard-sidebar-toggle',
  'dashboard-toolbar',
  'error',
  'footer',
  'header',
  'main',
  'navigation-menu',
  'rich-table',
])

// Pages that get an "Updated" badge in the sidebar. Clear entries after the next release.
export const UPDATED_COMPONENTS: ReadonlySet<string> = new Set([
  'form',
])
