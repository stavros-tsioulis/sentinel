import { Scheduler } from "./Scheduler.js";

export class IntervalScheduler extends Scheduler {
  protected intervalId: NodeJS.Timeout | null = null

  constructor(
    /** The number in milliseconds for each trigger on this scheduler */
    protected interval: number
  ) {
    super()
  }

  public start() {
    if (this.intervalId !== null) this.stop()
    this.intervalId = setInterval(() => {
      this.emit('trigger')
    }, this.interval);
  }

  public stop() {
    if (this.intervalId === null) return
    clearInterval(this.intervalId)
  }
}
