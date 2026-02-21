export class EventEmitter<TEvents extends { [K in keyof TEvents]: unknown }> {
  private listeners = new Map<keyof TEvents, Set<(payload: unknown) => void>>();

  on<TEventName extends keyof TEvents>(
    event: TEventName,
    callback: (payload: TEvents[TEventName]) => void
  ): () => void {
    const eventListeners = this.listeners.get(event) ?? new Set();
    if (!this.listeners.has(event)) {
      this.listeners.set(event, eventListeners);
    }
    eventListeners.add(callback as (payload: unknown) => void);

    return () => this.off(event, callback);
  }

  off<TEventName extends keyof TEvents>(
    event: TEventName,
    callback: (payload: TEvents[TEventName]) => void
  ): void {
    this.listeners.get(event)?.delete(callback as (payload: unknown) => void);
  }

  emit<TEventName extends keyof TEvents>(event: TEventName, payload: TEvents[TEventName]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const callback of eventListeners) {
        callback(payload);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
