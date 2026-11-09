// Map: a maplibre-gl map on the default fill until the first tiles draw.
// maplibre-gl's stylesheet isn't loaded. The rules its DOM needs to work (filling the parent, canvas placement, grab
// cursors, touch gestures, marker, popup and control placement, which attribution and gesture-hint parts show) sit in
// `Map.vue`, so they stay with `unstyled`. This file only styles them.
// The `--map-*` variables on `base` are the defaults of the parts: marker dot and ring, route, arc and polygon lines,
// cluster sizes, single points and the heatmap ramp. Markers fade in and out over 200ms. The attribution is a compact
// 20px pill on a translucent surface with muted 11px text, 8px from the corner; it starts collapsed to a 20px "i" button.
// The box-zoom outline is a 2px dotted accent border on a 15% accent fill. The cooperative-gestures hint is 18px white
// text centered on a 40% black scrim; it fades in after 1s. The loader blurs the map behind a half transparent overlay
// fill.
export default {
  slots: {
    base: [
      'bg-default',
      '[--map-marker-color:var(--accent)] [--map-marker-ring-color:var(--surface)]',
      '[--map-route-color:var(--accent)] [--map-route-width:4] [--map-route-opacity:0.9]',
      '[--map-arc-color:var(--accent)] [--map-arc-width:2] [--map-arc-opacity:0.85]',
      '[--map-polygon-color:var(--accent)] [--map-polygon-opacity:0.18] [--map-polygon-width:2]',
      '[--map-point-color:var(--accent)] [--map-point-ring-color:var(--surface)]',
      '[--map-cluster-small:var(--success)] [--map-cluster-medium:var(--warning)] [--map-cluster-large:var(--danger)]',
      '[--map-cluster-text-color:var(--snow)]',
      '[--map-heatmap-low:var(--accent)] [--map-heatmap-medium:var(--warning)] [--map-heatmap-high:var(--danger)]',
      // The canvas takes focus for arrow-key panning; the ring goes around the map, which clips the canvas
      'has-[.maplibregl-canvas:focus-visible]:status-focused',
    ],
    canvas: [
      '[&_.maplibregl-canvas]:outline-none',
      '[&_.maplibregl-marker]:transition-opacity [&_.maplibregl-marker]:duration-200',
      '[&_.maplibregl-popup-tip]:hidden',
      // Attribution pill. Compact, it starts as its "i" button and opens on press
      '[&_.maplibregl-ctrl-attrib]:relative [&_.maplibregl-ctrl-attrib]:m-2 [&_.maplibregl-ctrl-attrib]:rounded-full',
      '[&_.maplibregl-ctrl-attrib]:bg-surface/85 [&_.maplibregl-ctrl-attrib]:backdrop-blur-sm [&_.maplibregl-ctrl-attrib]:shadow-surface',
      '[&_.maplibregl-ctrl-attrib]:px-2 [&_.maplibregl-ctrl-attrib]:text-[11px]/5 [&_.maplibregl-ctrl-attrib]:text-muted',
      '[&_.maplibregl-ctrl-attrib.maplibregl-compact]:min-h-5 [&_.maplibregl-ctrl-attrib.maplibregl-compact]:py-0',
      '[&_.maplibregl-ctrl-attrib.maplibregl-compact]:pr-5 [&_.maplibregl-ctrl-attrib.maplibregl-compact]:pl-0',
      '[&_.maplibregl-ctrl-attrib.maplibregl-compact.maplibregl-compact-show]:pr-6 [&_.maplibregl-ctrl-attrib.maplibregl-compact.maplibregl-compact-show]:pl-2',
      '[&_.maplibregl-ctrl-attrib_a]:text-foreground/80 [&_.maplibregl-ctrl-attrib_a]:no-underline [&_.maplibregl-ctrl-attrib_a:hover]:underline',
      '[&_.maplibregl-ctrl-attrib-button]:absolute [&_.maplibregl-ctrl-attrib-button]:top-0 [&_.maplibregl-ctrl-attrib-button]:right-0',
      '[&_.maplibregl-ctrl-attrib-button]:size-5 [&_.maplibregl-ctrl-attrib-button]:cursor-pointer [&_.maplibregl-ctrl-attrib-button]:list-none',
      '[&_.maplibregl-ctrl-attrib-button]:rounded-full [&_.maplibregl-ctrl-attrib-button]:outline-none [&_.maplibregl-ctrl-attrib-button:focus-visible]:status-focused',
      '[&_.maplibregl-ctrl-attrib-button::-webkit-details-marker]:hidden',
      "[&_.maplibregl-ctrl-attrib-button]:before:absolute [&_.maplibregl-ctrl-attrib-button]:before:inset-0.5 [&_.maplibregl-ctrl-attrib-button]:before:content-['i']",
      '[&_.maplibregl-ctrl-attrib-button]:before:flex [&_.maplibregl-ctrl-attrib-button]:before:items-center [&_.maplibregl-ctrl-attrib-button]:before:justify-center',
      '[&_.maplibregl-ctrl-attrib-button]:before:rounded-full [&_.maplibregl-ctrl-attrib-button]:before:bg-default',
      '[&_.maplibregl-ctrl-attrib-button]:before:font-serif [&_.maplibregl-ctrl-attrib-button]:before:text-[11px] [&_.maplibregl-ctrl-attrib-button]:before:font-semibold [&_.maplibregl-ctrl-attrib-button]:before:text-default-foreground',
      // Shift-drag box zoom outline
      '[&_.maplibregl-boxzoom]:border-2 [&_.maplibregl-boxzoom]:border-dotted [&_.maplibregl-boxzoom]:border-accent [&_.maplibregl-boxzoom]:bg-accent/15',
      // The hint `cooperativeGestures` shows over the map
      '[&_.maplibregl-cooperative-gesture-screen]:flex [&_.maplibregl-cooperative-gesture-screen]:items-center [&_.maplibregl-cooperative-gesture-screen]:justify-center',
      '[&_.maplibregl-cooperative-gesture-screen]:bg-black/40 [&_.maplibregl-cooperative-gesture-screen]:p-4 [&_.maplibregl-cooperative-gesture-screen]:text-center',
      '[&_.maplibregl-cooperative-gesture-screen]:text-lg [&_.maplibregl-cooperative-gesture-screen]:text-white',
      '[&_.maplibregl-cooperative-gesture-screen]:transition-opacity [&_.maplibregl-cooperative-gesture-screen]:delay-1000 [&_.maplibregl-cooperative-gesture-screen]:duration-1000',
      '[&_.maplibregl-cooperative-gesture-screen.maplibregl-show]:delay-0 [&_.maplibregl-cooperative-gesture-screen.maplibregl-show]:duration-50',
    ],
    loader: 'absolute inset-0 z-20 flex items-center justify-center bg-overlay/50 backdrop-blur-xs',
    loaderSpinner: 'text-muted',
  },
}
