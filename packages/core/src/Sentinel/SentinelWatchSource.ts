import { EventEmitter } from "typed-events";
import type { Scheduler } from "../Scheduler/Scheduler.js";
import type { Collector } from "../Collector/Collector.js";

export type SentinelWatchSourceEvents<T> = {
  data: [data: T]
}

export type GetSentinelWatchSourceDataPayload<WatchSource extends SentinelWatchSource<any, Collector<any>>> =
  [data: Awaited<ReturnType<WatchSource["collector"]["getData"]>>]
export class SentinelWatchSource<T, ThisCollector extends Collector<T>> extends EventEmitter<SentinelWatchSourceEvents<T>> {
  public _dataEvnt = (_: SentinelWatchSourceEvents<T>) => {}

  constructor(
    protected scheduler: Scheduler,
    public collector: ThisCollector
  ) {
    super()
    this.scheduler.on('trigger', this.onTrigger.bind(this))
  }

  public start() {
    this.scheduler.start()
  }

  public stop() {
    this.scheduler.stop()
  }

  protected async onTrigger() {
    const data = await this.collector.getData()
    this.emit('data', data)
  }
}
