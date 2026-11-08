// Map: a maplibre-gl map that fills its parent, on the default fill until the first tiles draw.
// maplibre-gl's stylesheet isn't loaded: `canvas` carries the rules its DOM needs (canvas placement, grab cursors,
// touch gestures, marker and popup placement, the attribution and the box-zoom outline).
// The `--map-*` variables on `base` are the defaults of the parts: marker dot and ring, route, arc and polygon lines,
// cluster sizes, single points and the heatmap ramp. The attribution is a compact 20px pill on a translucent surface
// with muted 11px text, 8px from the corner; it starts collapsed to a 20px "i" button. The loader blurs the map behind a half
// transparent overlay fill.
export default {
  slots: {
    base: [
      'relative isolate size-full overflow-hidden bg-default',
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
      'absolute inset-0 [-webkit-tap-highlight-color:transparent]',
      // Canvas, sized by maplibre-gl
      '[&_.maplibregl-canvas]:absolute [&_.maplibregl-canvas]:top-0 [&_.maplibregl-canvas]:left-0 [&_.maplibregl-canvas]:outline-none',
      // Grab cursors while the map can be dragged
      '[&_.maplibregl-interactive]:cursor-grab [&_.maplibregl-interactive]:select-none [&_.maplibregl-interactive:active]:cursor-grabbing',
      '[&_.maplibregl-interactive.maplibregl-track-pointer]:cursor-pointer',
      // Touch gestures the map handles itself, so the page doesn't pan or zoom with them
      '[&_.maplibregl-touch-zoom-rotate]:[touch-action:pan-x_pan-y] [&_.maplibregl-touch-zoom-rotate_canvas]:[touch-action:pan-x_pan-y]',
      '[&_.maplibregl-touch-drag-pan]:[touch-action:pinch-zoom] [&_.maplibregl-touch-drag-pan_canvas]:[touch-action:pinch-zoom]',
      '[&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan]:touch-none [&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan_canvas]:touch-none',
      '[&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan.maplibregl-cooperative-gestures]:[touch-action:pan-x_pan-y]',
      '[&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan.maplibregl-cooperative-gestures_canvas]:[touch-action:pan-x_pan-y]',
      // Markers and popups, moved by maplibre-gl transforms
      '[&_.maplibregl-marker]:absolute [&_.maplibregl-marker]:top-0 [&_.maplibregl-marker]:left-0 [&_.maplibregl-marker]:will-change-transform',
      '[&_.maplibregl-marker]:transition-opacity [&_.maplibregl-marker]:duration-200',
      '[&_.maplibregl-popup]:pointer-events-none [&_.maplibregl-popup]:absolute [&_.maplibregl-popup]:top-0 [&_.maplibregl-popup]:left-0 [&_.maplibregl-popup]:z-10 [&_.maplibregl-popup]:flex [&_.maplibregl-popup]:will-change-transform',
      '[&_.maplibregl-popup-tip]:hidden [&_.maplibregl-popup-content]:pointer-events-auto',
      // Control corners
      '[&_:is(.maplibregl-ctrl-top-left,.maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-left,.maplibregl-ctrl-bottom-right)]:pointer-events-none',
      '[&_:is(.maplibregl-ctrl-top-left,.maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-left,.maplibregl-ctrl-bottom-right)]:absolute',
      '[&_:is(.maplibregl-ctrl-top-left,.maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-left,.maplibregl-ctrl-bottom-right)]:z-10',
      '[&_.maplibregl-ctrl-top-left]:top-0 [&_.maplibregl-ctrl-top-left]:left-0 [&_.maplibregl-ctrl-top-right]:top-0 [&_.maplibregl-ctrl-top-right]:right-0',
      '[&_.maplibregl-ctrl-bottom-left]:bottom-0 [&_.maplibregl-ctrl-bottom-left]:left-0 [&_.maplibregl-ctrl-bottom-right]:right-0 [&_.maplibregl-ctrl-bottom-right]:bottom-0',
      '[&_.maplibregl-ctrl]:pointer-events-auto',
      // Attribution pill. Compact, it starts as its "i" button and opens on press
      '[&_.maplibregl-ctrl-attrib]:relative [&_.maplibregl-ctrl-attrib]:m-2 [&_.maplibregl-ctrl-attrib]:rounded-full',
      '[&_.maplibregl-ctrl-attrib]:bg-surface/85 [&_.maplibregl-ctrl-attrib]:backdrop-blur-sm [&_.maplibregl-ctrl-attrib]:shadow-surface',
      '[&_.maplibregl-ctrl-attrib]:px-2 [&_.maplibregl-ctrl-attrib]:text-[11px]/5 [&_.maplibregl-ctrl-attrib]:text-muted',
      '[&_.maplibregl-ctrl-attrib.maplibregl-compact]:min-h-5 [&_.maplibregl-ctrl-attrib.maplibregl-compact]:py-0',
      '[&_.maplibregl-ctrl-attrib.maplibregl-compact]:pr-5 [&_.maplibregl-ctrl-attrib.maplibregl-compact]:pl-0',
      '[&_.maplibregl-ctrl-attrib.maplibregl-compact.maplibregl-compact-show]:pr-6 [&_.maplibregl-ctrl-attrib.maplibregl-compact.maplibregl-compact-show]:pl-2',
      '[&_.maplibregl-compact:not(.maplibregl-compact-show)_.maplibregl-ctrl-attrib-inner]:hidden [&_.maplibregl-attrib-empty]:hidden',
      '[&_.maplibregl-ctrl-attrib_a]:text-foreground/80 [&_.maplibregl-ctrl-attrib_a]:no-underline [&_.maplibregl-ctrl-attrib_a:hover]:underline',
      '[&_.maplibregl-ctrl-attrib-button]:hidden [&_.maplibregl-compact_.maplibregl-ctrl-attrib-button]:block',
      '[&_.maplibregl-ctrl-attrib-button]:absolute [&_.maplibregl-ctrl-attrib-button]:top-0 [&_.maplibregl-ctrl-attrib-button]:right-0',
      '[&_.maplibregl-ctrl-attrib-button]:size-5 [&_.maplibregl-ctrl-attrib-button]:cursor-pointer [&_.maplibregl-ctrl-attrib-button]:list-none',
      '[&_.maplibregl-ctrl-attrib-button]:rounded-full [&_.maplibregl-ctrl-attrib-button]:outline-none [&_.maplibregl-ctrl-attrib-button:focus-visible]:status-focused',
      '[&_.maplibregl-ctrl-attrib-button::-webkit-details-marker]:hidden',
      "[&_.maplibregl-ctrl-attrib-button]:before:absolute [&_.maplibregl-ctrl-attrib-button]:before:inset-0.5 [&_.maplibregl-ctrl-attrib-button]:before:content-['i']",
      '[&_.maplibregl-ctrl-attrib-button]:before:flex [&_.maplibregl-ctrl-attrib-button]:before:items-center [&_.maplibregl-ctrl-attrib-button]:before:justify-center',
      '[&_.maplibregl-ctrl-attrib-button]:before:rounded-full [&_.maplibregl-ctrl-attrib-button]:before:bg-default',
      '[&_.maplibregl-ctrl-attrib-button]:before:font-serif [&_.maplibregl-ctrl-attrib-button]:before:text-[11px] [&_.maplibregl-ctrl-attrib-button]:before:font-semibold [&_.maplibregl-ctrl-attrib-button]:before:text-default-foreground',
      // Shift-drag box zoom outline, sized by maplibre-gl
      '[&_.maplibregl-boxzoom]:absolute [&_.maplibregl-boxzoom]:top-0 [&_.maplibregl-boxzoom]:left-0 [&_.maplibregl-boxzoom]:size-0',
      '[&_.maplibregl-boxzoom]:border-2 [&_.maplibregl-boxzoom]:border-dotted [&_.maplibregl-boxzoom]:border-accent [&_.maplibregl-boxzoom]:bg-accent/15',
      // The hint `cooperativeGestures` shows over the map
      '[&_.maplibregl-cooperative-gesture-screen]:pointer-events-none [&_.maplibregl-cooperative-gesture-screen]:absolute [&_.maplibregl-cooperative-gesture-screen]:inset-0',
      '[&_.maplibregl-cooperative-gesture-screen]:z-20 [&_.maplibregl-cooperative-gesture-screen]:flex [&_.maplibregl-cooperative-gesture-screen]:items-center [&_.maplibregl-cooperative-gesture-screen]:justify-center',
      '[&_.maplibregl-cooperative-gesture-screen]:bg-black/40 [&_.maplibregl-cooperative-gesture-screen]:p-4 [&_.maplibregl-cooperative-gesture-screen]:text-center',
      '[&_.maplibregl-cooperative-gesture-screen]:text-lg [&_.maplibregl-cooperative-gesture-screen]:text-white [&_.maplibregl-cooperative-gesture-screen]:opacity-0',
      '[&_.maplibregl-cooperative-gesture-screen]:transition-opacity [&_.maplibregl-cooperative-gesture-screen]:delay-1000 [&_.maplibregl-cooperative-gesture-screen]:duration-1000',
      '[&_.maplibregl-cooperative-gesture-screen.maplibregl-show]:opacity-100 [&_.maplibregl-cooperative-gesture-screen.maplibregl-show]:delay-0 [&_.maplibregl-cooperative-gesture-screen.maplibregl-show]:duration-50',
      '[&_.maplibregl-mobile-message]:hidden pointer-coarse:[&_.maplibregl-mobile-message]:block pointer-coarse:[&_.maplibregl-desktop-message]:hidden',
    ],
    loader: 'absolute inset-0 z-20 flex items-center justify-center bg-overlay/50 backdrop-blur-xs',
    loaderSpinner: 'text-muted',
  },
}
