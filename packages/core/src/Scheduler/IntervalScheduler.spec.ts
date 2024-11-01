import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { IntervalScheduler } from "./IntervalScheduler.js"

describe("IntervalScheduler", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should emit a trigger every certain duration', () => {
    const scheduler = new IntervalScheduler(1000)
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(1000)
    expect(spy).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1000)
    expect(spy).toHaveBeenCalledTimes(2)

    scheduler.stop()
  })

  it('should no longer emit a trigger if it is stopped', () => {
    const scheduler = new IntervalScheduler(1000)
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(1000)
    expect(spy).toHaveBeenCalledTimes(1)

    scheduler.stop()

    vi.advanceTimersByTime(1000)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
