import * as sentinel from "./src/index.js"
export default sentinel

class BarkCollector extends sentinel.Collector<number> {
  protected barks = 0
  
  protected getTimesBarked() {
    return this.barks++
  }

  public getData(): number {
    return this.getTimesBarked()
  }
}

class AvailabilityStatusCollector extends sentinel.Collector<string> {
  protected status: 'available' | 'unavailable' = 'available'
  
  protected getAvailability() {
    return this.status
  }

  public getData(): string {
    return this.getAvailability()
  }
}

const barkWatchSource = new sentinel.SentinelWatchSource(
  new sentinel.IntervalScheduler(1000),
  new BarkCollector()
)

const availabilityStatusWatchSource = new sentinel.SentinelWatchSource(
  new sentinel.IntervalScheduler(5000),
  new AvailabilityStatusCollector()
)

const watcher = new sentinel.Sentinel([barkWatchSource, availabilityStatusWatchSource])

watcher.on('watcherData', (payload) => {
  if (sentinel.isPayloadFromSource(payload, barkWatchSource)) {
    const [data] = payload.data
  }
})

watcher.start()
