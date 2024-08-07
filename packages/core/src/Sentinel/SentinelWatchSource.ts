import { EventEmitter } from "typed-events";
import type Scheduler from "../Scheduler/Scheduler";

export type SentinelWatchSourceEvents<T> = {
  data: [data: T]
}

export default abstract class SentinelWatchSource<T> extends EventEmitter<SentinelWatchSourceEvents<T>> {
  constructor(protected scheduler: Scheduler) {
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
