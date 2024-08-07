import { EventEmitter } from "typed-events";

export default abstract class Scheduler extends EventEmitter<{ trigger: [] }> {
  public start() {}
  public stop() {}
}
