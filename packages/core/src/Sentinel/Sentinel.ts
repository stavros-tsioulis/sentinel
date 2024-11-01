import { EventEmitter } from "typed-events";
import type { SentinelWatchSource, GetSentinelWatchSourceDataPayload } from "./SentinelWatchSource.js";

export class SentinelDataEventPayload<WatchSource extends SentinelWatchSource<any>> {
  source!: WatchSource
  data!: GetSentinelWatchSourceDataPayload<WatchSource>
}

export type SentinelEvents<WatchSource extends SentinelWatchSource<any>> = {
  watcherData: [payload: SentinelDataEventPayload<WatchSource>]
}

export class Sentinel<WatchSource extends SentinelWatchSource<any>> extends EventEmitter<SentinelEvents<WatchSource>> {
  constructor(
    protected sources: WatchSource[] = []
  ) {
    super()
    this.sources.forEach(source => {
      source.on('data', (...data) => {
        this.emit('watcherData', { data, source })
      })
    })
  }

  public start() {
    this.sources.forEach(source => source.start())
    return this
  }

  public stop() {
    this.sources.forEach(source => source.stop())
    return this
  }
}
