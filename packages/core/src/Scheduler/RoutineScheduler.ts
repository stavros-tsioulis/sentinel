import dayjs, { type Dayjs } from "dayjs"
import { Scheduler } from "./Scheduler.js";

export type SchedulerRepeatWellKnownTypes = "yearly" | "monthly" | "monthly@day" | "biweekly" | "weekly" | "daily" | "hourly"

export type SchedulerDateTime = {
  /** The pattern to follow */
  repeat: SchedulerRepeatWellKnownTypes
  /** The model by which the scheduler will conform for its repeated triggers */
  dateModel: Dayjs | Date
}

export type SchedulerDateTimeCustom = {
  /** The pattern to follow */
  repeat: {
    value: number
    unit: dayjs.ManipulateType
  }
}

export class RoutineScheduler extends Scheduler {
  protected breakNextLoop = false
  protected intervalId: NodeJS.Timeout | null = null
  protected timeoutId: NodeJS.Timeout | null = null

  constructor(
    protected schedulerDateTime: SchedulerDateTime | SchedulerDateTimeCustom
  ) {
    super()
  }

  public start() {
    this.intervalId = setInterval(() => {
      this.startNextTimer()
    }, 1000);
  }

  public stop() {
    if (this.intervalId !== null)
      clearInterval(this.intervalId)
    if (this.timeoutId !== null)
      clearTimeout(this.timeoutId)
  }

  protected startNextTimer() {
    // A timer is already running, abort
    if (this.timeoutId !== null) return

    this.timeoutId = setTimeout(() => {
      this.emit('trigger')
      clearTimeout(this.timeoutId!)
      this.timeoutId = null
    }, this.getNextWait());
  }

  protected getNextWait() {
    const now = dayjs()

    if (typeof this.schedulerDateTime.repeat === 'object') {
      const next = now.add(this.schedulerDateTime.repeat.value, this.schedulerDateTime.repeat.unit)
      return next.diff(now)
    }

    const dateModel = (this.schedulerDateTime.dateModel instanceof Date) ? dayjs(this.schedulerDateTime.dateModel) : this.schedulerDateTime.dateModel

    switch (this.schedulerDateTime.repeat) {
      case 'hourly': {
        const next = dayjs()
          .minute(dateModel.minute())
          .second(dateModel.second())
          .millisecond(dateModel.millisecond())
          .add(1, 'hour')

        return next.diff(now)
      }

      case 'daily': {
        const next = dayjs()
          .hour(dateModel.hour())
          .minute(dateModel.minute())
          .second(dateModel.second())
          .millisecond(dateModel.millisecond())
          .add(1, 'day')

        return next.diff(now)
      }

      case 'weekly': {
        const next = dayjs()
          .day(dateModel.day())
          .hour(dateModel.hour())
          .minute(dateModel.minute())
          .second(dateModel.second())
          .millisecond(dateModel.millisecond())
          .add(1, 'week')

        return next.diff(now)
      }

      case 'biweekly': {
        const next = dayjs()
          .day(dateModel.day())
          .hour(dateModel.hour())
          .minute(dateModel.minute())
          .second(dateModel.second())
          .millisecond(dateModel.millisecond())
          .add(2, 'weeks')

        return next.diff(now)
      }

      case 'monthly': {
        const next = dayjs()
          .date(dateModel.date())
          .hour(dateModel.hour())
          .minute(dateModel.minute())
          .second(dateModel.second())
          .millisecond(dateModel.millisecond())
          .add(1, 'month')

        return next.diff(now)
      }

      case 'monthly@day': {
        const next = dayjs()
          .day(dateModel.date())
          .hour(dateModel.hour())
          .minute(dateModel.minute())
          .second(dateModel.second())
          .millisecond(dateModel.millisecond())
          .add(1, 'month')

        return next.diff(now)
      }

      case 'yearly': {
        const next = dayjs()
          .month(dateModel.month())
          .date(dateModel.date())
          .hour(dateModel.hour())
          .minute(dateModel.minute())
          .second(dateModel.second())
          .millisecond(dateModel.millisecond())
          .add(1, 'year')

        return next.diff(now)
      }
    }
  }
}
