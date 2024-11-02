export abstract class Collector<T> {
  public abstract getData(): T | Promise<T>
}
