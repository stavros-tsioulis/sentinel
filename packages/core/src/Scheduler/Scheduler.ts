import { EventEmitter } from "typed-events";

export abstract class Scheduler extends EventEmitter<{ trigger: [] }> {
  public abstract start(): void
  public abstract stop(): void
}
