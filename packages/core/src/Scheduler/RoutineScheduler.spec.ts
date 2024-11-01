import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import dayjs from "dayjs"
import { RoutineScheduler } from "./RoutineScheduler.js"

describe("RoutineScheduler", () => {
  const startDate = dayjs("2024-08-07T14:12:49.249Z")

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(startDate.valueOf())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should emit a trigger at every fixed date matching a pattern', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'hourly',
      dateModel: dayjs().minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    const firstTimerShouldFireAt = dayjs("2024-08-07T15:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)

    const secondTimerShouldFireAt = dayjs("2024-08-07T16:05:00.000Z")
    vi.advanceTimersByTime(secondTimerShouldFireAt.diff(firstTimerShouldFireAt))

    expect(spy).toHaveBeenCalledTimes(2)

    const thirdTimerShouldNotFireAt = dayjs("2024-08-07T16:07:00.000Z")
    vi.advanceTimersByTime(thirdTimerShouldNotFireAt.diff(secondTimerShouldFireAt))

    expect(spy).toHaveBeenCalledTimes(2)
    
    scheduler.stop()
  })

  it('should no longer emit a trigger if it is stopped', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'hourly',
      dateModel: dayjs().minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    const firstTimerShouldFireAt = dayjs("2024-08-07T15:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)

    const secondTimerShouldFireAt = dayjs("2024-08-07T16:05:00.000Z")
    vi.advanceTimersByTime(secondTimerShouldFireAt.diff(firstTimerShouldFireAt))

    expect(spy).toHaveBeenCalledTimes(2)

    scheduler.stop()

    const withSchedulerStopped_thirdTimerShouldNotFireAt = dayjs("2024-08-07T17:05:00.000Z")
    vi.advanceTimersByTime(withSchedulerStopped_thirdTimerShouldNotFireAt.diff(secondTimerShouldFireAt))

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should respect time units smaller than hours with hourly interval', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'hourly',
      dateModel: dayjs().minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    const firstTimerShouldFireAt = dayjs("2024-08-07T15:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)
    scheduler.stop()
  })

  it('should respect time units smaller than days with daily interval', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'daily',
      dateModel: dayjs().hour(2).minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    const firstTimerShouldFireAt = dayjs("2024-08-08T02:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)
    scheduler.stop()
  })

  it('should respect time units smaller than weeks with weekly interval', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'weekly',
      dateModel: dayjs().day(3).hour(2).minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    // next wednesday (day(3)) is 14 august 2024
    const firstTimerShouldFireAt = dayjs("2024-08-14T02:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)
    scheduler.stop()
  })

  it('should respect time units smaller than weeks with biweekly interval', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'biweekly',
      dateModel: dayjs().day(3).hour(2).minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    // second-next wednesday (day(3)) is 21 august 2024
    const firstTimerShouldFireAt = dayjs("2024-08-21T02:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)
    scheduler.stop()
  })

  it.skip('should respect time units smaller than months with monthly interval', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'monthly',
      dateModel: dayjs().date(5).hour(2).minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    const firstTimerShouldFireAt = dayjs("2024-09-05T02:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)
    scheduler.stop()
  })

  it.skip('should respect time units smaller than years with yearly interval', () => {
    const scheduler = new RoutineScheduler({
      repeat: 'monthly',
      dateModel: dayjs().month(7).date(5).hour(2).minute(5).second(0).millisecond(0)
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    const firstTimerShouldFireAt = dayjs("2025-07-05T02:05:00.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)
    scheduler.stop()
  })

  it('should emit a trigger for every custom repeat pattern', () => {
    const scheduler = new RoutineScheduler({
      repeat: {
        value: 4,
        unit: 'minutes',
      }
    })
    const spy = vi.fn()
    scheduler.on('trigger', spy)
    scheduler.start()

    expect(spy).toHaveBeenCalledTimes(0)

    const firstTimerShouldFireAt = dayjs("2024-08-07T14:16:51.000Z")
    vi.advanceTimersByTime(firstTimerShouldFireAt.diff(startDate))

    expect(spy).toHaveBeenCalledTimes(1)
    scheduler.stop()
  })
})
