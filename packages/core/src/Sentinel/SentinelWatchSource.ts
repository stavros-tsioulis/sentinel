import { EventEmitter } from "typed-events";
import type { Scheduler } from "../Scheduler/Scheduler.js";

export type SentinelWatchSourceEvents<T> = {
  data: [data: T]
}

export type GetSentinelWatchSourceDataPayload<WatchSource extends SentinelWatchSource<any>> =
  Parameters<WatchSource["_dataEvnt"]>[0]["data"]

export class SentinelWatchSource<T> extends EventEmitter<SentinelWatchSourceEvents<T>> {
  public _dataEvnt = (_: SentinelWatchSourceEvents<T>) => {}

  protected constructor(protected scheduler: Scheduler) {
    super()
    this.scheduler.on('trigger', this.onTrigger.bind(this))
  }

  public start() {
    this.scheduler.start()
  }

  public stop() {
    this.scheduler.stop()
  }

  public onTrigger() {}
}
