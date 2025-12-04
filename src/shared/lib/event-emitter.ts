type EventHandler = (payload?: unknown) => void;

export class EventEmitter {
  private events: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    (this.events[event] ||= []).push(handler);
  }

  off(event: string, handler: EventHandler) {
    this.events[event] = (this.events[event] || []).filter(h => h !== handler);
  }

  emit(event: string, payload?: unknown) {
    (this.events[event] || []).forEach(handler => handler(payload));
  }

  proxyTo(other: EventEmitter, events: string[]) {
    for (const event of events)
      this.on(event, payload => other.emit(event, payload));
  }
}
