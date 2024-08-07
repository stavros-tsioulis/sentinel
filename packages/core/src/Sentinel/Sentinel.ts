import { EventEmitter } from "typed-events";
import SentinelWatchSource from "./SentinelWatchSource";

export class SentinelDataEventPayload<WatchSource extends SentinelWatchSource<any>> {
  source!: WatchSource
  data!: WatchSource extends SentinelWatchSource<infer V> ? V : never
}

export type SentinelEvents = {
  data: [payload: any]
}

export default class Sentinel<WatchSource extends SentinelWatchSource<any>> extends EventEmitter<SentinelEvents> {
  constructor(
    protected sources: WatchSource[] = []
  ) {
    super()
  }

  public start() {
    this.sources.forEach(source => source.start())
    return this
  }

  public stop() {
    this.sources.forEach(source => source.stop())
    return this
  }

  public isPayloadInstanceOf<T>(payload: SentinelDataEventPayload<SentinelWatchSource<any>>, source: typeof SentinelWatchSource<T>): payload is SentinelDataEventPayload<SentinelWatchSource<T>> {
    return payload.source instanceof source
  }
}
