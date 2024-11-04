import type { Collector } from "../Collector/Collector.js"
import type { SentinelDataEventPayload } from "./Sentinel.js"
import type { SentinelWatchSource } from "./SentinelWatchSource.js"

export * from "./Sentinel.js"
export * from "./SentinelWatchSource.js"

export function isPayloadFromSource<WatchSource extends SentinelWatchSource<any, Collector<any>>>(
  payload: SentinelDataEventPayload<any>,
  watchSource: WatchSource,
): payload is SentinelDataEventPayload<WatchSource> {
  return payload.source === watchSource
}
