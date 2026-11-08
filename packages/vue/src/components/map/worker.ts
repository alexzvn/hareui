import type { HareUIConfig } from '@/config'

declare const __HAREUI_MAP_WORKER__: string | undefined

/** The URL of maplibre-gl's worker: `createHareUI({ map: { workerUrl } })`, else the one the `hareui()` Vite plugin defines. */
export const mapWorkerUrl = (config: HareUIConfig | undefined) => {
  if (config?.map?.workerUrl) return config.map.workerUrl

  return typeof __HAREUI_MAP_WORKER__ === 'string' ? __HAREUI_MAP_WORKER__ : undefined
}
