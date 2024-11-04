# What is this?
Sentinel is a abstraction layer over time-based triggers and data collection.

It handles the scheduling of an effect over a customizable interval or routine.

## How to use it

```ts
import sentinel from "@sentinel/core"

// 1. Create a Collector
class BarkCollector extends sentinel.Collector<number> {
  protected barks = 0
  
  protected getTimesBarked() {
    return this.barks++
  }

  // You MUST implement this method
  public getData(): number {
    return this.getTimesBarked()
  }
}

// 2. Create the Scheduler
const barkScheduler = new sentinel.IntervalScheduler(1000) // bark every 1 second

// 3. Create the Watch Source
const barkWatchSource = new sentinel.SentinelWatchSource(
  barkScheduler,
  new BarkCollector()
)

// 4. Create the Watcher
const watcher = new sentinel.Sentinel([barkWatchSource])

// 5. Add event
watcher.on('watcherData', (payload) => {
  const [totalBarks] = payload.data
  console.log(`Barked ${totalBarks} times`)
})

// 6. Start the watcher
watcher.start()

// (optional) Stop the watcher
// watcher.stop()
```

## Non-isomorphic data
You can use `payload.source` to determine which watcher the current payload comes from.
This is useful when you want to react differently to each source's data.
For type safety, you can use the exported utility function `isPayloadFromSource(watchSource, payload)`.

For example:

```ts
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
    const [barks] = payload.data
    console.log(`Barked ${barks} times`)
  }

  if (sentinel.isPayloadFromSource(payload, availabilityStatusWatchSource)) {
    const [status] = payload.data
    console.log(`Current status: ${status}`)
  }
})

watcher.start()
```
