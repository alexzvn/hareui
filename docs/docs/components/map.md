---
title: Map
description: Show an interactive map with markers, popups, routes, areas, heatmaps and clustered points.
links:
  source: map/Map.vue
  styles: map/theme.ts
---

## Usage

Place the map in an element with a height: it fills its parent. Pass `center` and a `zoom` level, from 0 (the whole world) to 22. Then add markers and other parts inside it.

```ts
import { Map, MapMarker } from '@hareui/vue/map'
```

<ComponentPreview name="map/viewpoints" />

The places, routes and parish areas in these examples come from OpenStreetMap, © OpenStreetMap contributors. The earthquakes come from the U.S. Geological Survey.

### Positions

Every position takes either form:

- `{ long, lat }`: longitude and latitude in degrees.
- `[long, lat]`: the same as a tuple, the order GeoJSON uses.

Events always report `{ long, lat }`. A `v-model` gives positions back in the form you passed.

### Installation

Import the map from `@hareui/vue/map`. It draws with `maplibre-gl`, which it loads when it mounts. Install the peer dependency:

::: code-group

```bash [npm]
npm i maplibre-gl
```

```bash [pnpm]
pnpm add maplibre-gl
```

```bash [yarn]
yarn add maplibre-gl
```

```bash [bun]
bun add maplibre-gl
```

:::

maplibre-gl draws tiles in a web worker. With Vite, the `hareui()` plugin serves that worker, so there's nothing more to set up. With another bundler, copy `maplibre-gl/dist/maplibre-gl-worker.mjs` to your public files and pass its URL:

```ts
app.use(createHareUI({ map: { workerUrl: '/maplibre-gl-worker.mjs' } }))
```

Don't import the maplibre-gl stylesheet. The map's theme styles what maplibre-gl draws, and the stylesheet's rules would override it.

### Map style

The map shows OpenFreeMap tiles by default, light or dark to match the page. Pass `map-style` to use others: the URL of a style document, a style object, or one of each per color scheme as `{ light, dark }`. Set `color-mode` to pin the scheme.

```vue
<Map
  :map-style="{
    light: 'https://tiles.openfreemap.org/styles/liberty',
    dark: 'https://tiles.openfreemap.org/styles/dark',
  }"
/>
```

Set `projection="globe"` to draw the world as a globe. Pass `options` for any other maplibre-gl map option, such as `maxBounds`. The map reads them once, when it's created.

### Colors

Every `color` prop takes a theme color (`default`, `accent`, `success`, `warning` or `danger`) or any CSS color, including `oklch()`, `color-mix()` and `var(--my-color)`. The map resolves variables in its own color scheme, and again when the scheme changes.

## Anatomy

Each part is a component you place inside `Map`:

```vue
<Map :center="[-9.14, 38.71]" :zoom="13">
  <MapMarker :position="[-9.14, 38.71]">
    <MapMarkerDot />
    <MapMarkerLabel />
    <MapMarkerTooltip />
    <MapMarkerPopup />
  </MapMarker>
  <MapPopup :position="[-9.13, 38.71]" />
  <MapRoute :points="points" />
  <MapArc :from="lisbon" :to="tokyo" />
  <MapPolygon :points="ring" />
  <MapHeatmap :points="points" />
  <MapClusterLayer :points="points" />
  <MapControls>
    <MapZoomControl />
    <MapCompassControl />
    <MapLocateControl />
    <MapFullscreenControl />
    <MapControlGroup>
      <MapControlButton />
    </MapControlGroup>
  </MapControls>
</Map>
```

For data that lives in arrays, pass `markers`, `routes`, `arcs` or `polygons` to `Map` instead. Each item takes the props of its part. The `#marker`, `#tooltip` and `#popup` slots fill every marker of `markers`. Give an item a `slot` name to fill only its own, such as `#cafe-marker`.

```vue
<Map :markers="cafes" :routes="[{ points, color: 'accent' }]">
  <template #popup="{ marker }">{{ marker.label }}</template>
</Map>
```

## Markers

`MapMarker` places its content at `position`. With no content it shows a dot, and its `label` under it. Fill it with `MapMarkerDot` and `MapMarkerLabel` to style them, or with any element of your own. `label` also names the marker for screen readers.

`MapMarkerTooltip` shows while the pointer is over the marker or it has focus. `@hover` reports the pointer moving on and off it, for highlighting a matching list row.

<ComponentPreview name="map/bike-docks" />

### Draggable markers

Set `draggable` and bind `v-model:position` to let users move a marker. `@dragend` reports where it was dropped.

<ComponentPreview name="map/address-picker" />

### Moving markers

A marker follows its `position` as it changes, without being redrawn. Update it every frame to animate it.

<ComponentPreview name="map/live-courier" />

## Popups

`MapMarkerPopup` opens when its marker is pressed. `MapPopup` stands on its own at any `position`: show it with `v-if`, and hide it again on `@close`. Both close on `Escape` and on a press outside them. Set `close-button` to add a close button.

<ComponentPreview name="map/coffee-guide" />

## Routes

`MapRoute` draws a line through `points`. `color`, `width` and `opacity` style it, and `type` makes it `dashed` or `dotted`.

<ComponentPreview name="map/old-town-walk" />

Listen to `@click` to make a route selectable. A route with a `@click` or `@hover` listener grows under the pointer. Routes drawn later sit on top.

<ComponentPreview name="map/airport-rides" />

## Arcs

`MapArc` draws a curved line from one position to another, such as a flight path. `curvature` sets how far it bows out.

<ComponentPreview name="map/remote-team" />

## Polygons

`MapPolygon` fills the area inside `points` and outlines it. `opacity` sets the fill, and the outline stays solid. `@hover` and `@click` work as on routes.

<ComponentPreview name="map/cafe-density" />

## Heatmaps and clusters

`MapHeatmap` shades how dense `points` are. Give an item a `weight` to make it count for more.

`MapClusterLayer` groups nearby `points` into counted circles that split as the map zooms in. Pressing a group zooms in until it splits. `@point-click` returns the item you passed, with all its fields.

<ComponentPreview name="map/earthquakes" />

## Controls

Set `controls` on `Map` to show zoom buttons. Pass an object to pick the buttons and their corner:

- `zoom`: zoom in and zoom out buttons (default `true`).
- `compass`: a compass that turns with the map. Pressing it points the map north and flattens it.
- `locate`: centers the map on the user's position.
- `fullscreen`: toggles fullscreen.
- `position`: `top-left`, `top-right`, `bottom-left` or `bottom-right` (default).

For your own buttons, place `MapControls` in the map and fill it with control parts. `MapControlButton` takes an `icon` and a `label`, and `active` shows it pressed.

## Camera

Bind `v-model:center`, `v-model:zoom`, `v-model:bearing` and `v-model:pitch` to follow the camera and move it from outside. A template ref, or `useMap()` inside a part of your own, gives you:

- `flyTo(viewport, options)`: moves the camera, animated unless `duration` is 0.
- `fitPoints(points, options)`: frames a list of positions. `padding` keeps them clear of a card over the map.
- `map`: the maplibre-gl map, for anything the parts don't cover.

```vue
<script setup lang="ts">
const map = useTemplateRef('map')

const showAll = () => map.value?.fitPoints(points, { padding: { left: 320 } })
</script>

<template>
  <Map ref="map" @load="showAll" />
</template>
```

`@load` passes the maplibre-gl map once it has drawn its first frame.

## Loading

The map shows a loader until it first draws. Set `loading` to show it while your own data is on its way.

## Customization

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      mapMarker: {
        slots: { dot: 'size-5' },
      },
    },
  }),
)
```

The map's colors come from CSS variables. Set them on any ancestor to restyle every map inside it:

```css
.my-maps {
  --map-route-color: var(--success);
  --map-cluster-small: var(--accent);
}
```

## Styling Reference

| Component     | `ui` key        | `data-slot`          | Description                                                                         |
| ------------- | --------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `Map`         | `base`          | `map`                | The root. Carries `data-loaded` once the map loads and `data-loading` while loading |
| `Map`         | `canvas`        | `map-canvas`         | The element maplibre-gl draws in. Also styles the attribution                       |
| `Map`         | `loader`        | `map-loader`         | The overlay shown while loading                                                     |
| `Map`         | `loaderSpinner` | `spinner`            | The loader's spinner                                                                |
| `MapMarker`   | `base`          | `map-marker`         | One marker. Carries `data-open` while its popup is open                             |
| `MapMarker`   | `dot`           | `map-marker-dot`     | The dot                                                                             |
| `MapMarker`   | `label`         | `map-marker-label`   | The label                                                                           |
| `MapMarker`   | `tooltip`       | `map-marker-tooltip` | The tooltip                                                                         |
| `MapPopup`    | `base`          | `map-popup`          | The popup card                                                                      |
| `MapPopup`    | `close`         | `map-popup-close`    | The popup's close button                                                            |
| `MapControls` | `base`          | `map-controls`       | Holds the control groups in a corner                                                |
| `MapControls` | `group`         | `map-control-group`  | One group of buttons                                                                |
| `MapControls` | `button`        | `map-control-button` | One button. Carries `data-active` while pressed                                     |
| `MapControls` | `icon`          | -                    | A button's icon                                                                     |
| `MapControls` | `spinner`       | -                    | The spinner the locate button shows while it waits for the position                 |
| `MapControls` | `compassIcon`   | -                    | The compass, turned and tilted with the map                                         |

## API Reference

### Map

<ApiTable component="Map" kind="props" />

<ApiTable component="Map" kind="slots" />

<ApiTable component="Map" kind="emits" />

### MapMarker

<ApiTable component="MapMarker" kind="props" />

<ApiTable component="MapMarker" kind="emits" />

### MapMarkerDot

<ApiTable component="MapMarkerDot" kind="props" />

### MapMarkerLabel

<ApiTable component="MapMarkerLabel" kind="props" />

### MapMarkerTooltip

<ApiTable component="MapMarkerTooltip" kind="props" />

### MapMarkerPopup

<ApiTable component="MapMarkerPopup" kind="props" />

<ApiTable component="MapMarkerPopup" kind="slots" />

### MapPopup

<ApiTable component="MapPopup" kind="props" />

<ApiTable component="MapPopup" kind="emits" />

### MapRoute

<ApiTable component="MapRoute" kind="props" />

<ApiTable component="MapRoute" kind="emits" />

### MapArc

<ApiTable component="MapArc" kind="props" />

<ApiTable component="MapArc" kind="emits" />

### MapPolygon

<ApiTable component="MapPolygon" kind="props" />

<ApiTable component="MapPolygon" kind="emits" />

### MapHeatmap

<ApiTable component="MapHeatmap" kind="props" />

### MapClusterLayer

<ApiTable component="MapClusterLayer" kind="props" />

<ApiTable component="MapClusterLayer" kind="emits" />

### MapControls

<ApiTable component="MapControls" kind="props" />

### MapControlButton

<ApiTable component="MapControlButton" kind="props" />

<ApiTable component="MapControlButton" kind="emits" />

### MapLocateControl

<ApiTable component="MapLocateControl" kind="props" />

<ApiTable component="MapLocateControl" kind="emits" />

## Theme

<ApiTheme component="Map" />

<ApiTheme component="MapMarker" />

<ApiTheme component="MapPopup" />

<ApiTheme component="MapControls" />

## Accessibility

- A marker with a `@click` listener, a popup or `draggable` is a button: `Tab` reaches it, and `Enter` or `Space` presses it. Other markers are images named by their `label`.
- A marker's tooltip describes it to screen readers while it shows.
- Popups are dialogs named by `label`, or by their marker's label. Focus moves into a popup opened from the keyboard, and `Escape` returns it to the marker.
- Control buttons are named by their `label` and carry a tooltip with it.
- Lines, areas, heatmaps and clusters are drawn on the canvas, so screen readers don't see them. Show the same data in a list or legend beside the map.

## Related Components

<RelatedComponents :components="['popover', 'card']" />
