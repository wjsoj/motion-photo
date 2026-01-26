export class EventEmitter<TEvents extends Record<string, any>> {
  private listeners = new Map<keyof TEvents, Set<Function>>();

  on<TEventName extends keyof TEvents>(
    event: TEventName,
    callback: (payload: TEvents[TEventName]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => this.off(event, callback);
  }

  off<TEventName extends keyof TEvents>(
    event: TEventName,
    callback: (payload: TEvents[TEventName]) => void
  ): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit<TEventName extends keyof TEvents>(
    event: TEventName,
    payload: TEvents[TEventName]
  ): void {
    this.listeners.get(event)?.forEach((callback) => callback(payload));
  }

  clear(): void {
    this.listeners.clear();
  }
}
