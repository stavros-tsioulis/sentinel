import { EventEmitter } from "typed-events";
import type { SentinelWatchSource, GetSentinelWatchSourceDataPayload } from "./SentinelWatchSource.js";
import type { Collector } from "../Collector/Collector.js";

export class SentinelDataEventPayload<WatchSource extends SentinelWatchSource<any, Collector<any>>> {
  source!: WatchSource
  data!: GetSentinelWatchSourceDataPayload<WatchSource>
}

export type SentinelEvents<WatchSource extends SentinelWatchSource<any, Collector<any>>> = {
  watcherData: [payload: SentinelDataEventPayload<WatchSource>]
}

export class Sentinel<WatchSource extends SentinelWatchSource<any, Collector<any>>> extends EventEmitter<SentinelEvents<WatchSource>> {
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
