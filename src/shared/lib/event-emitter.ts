type EventHandler = (payload?: unknown) => void;

export class EventEmitter {
  private events: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    console.log(`Subscribed to event: ${event}`);
    (this.events[event] ||= []).push(handler);
  }

  off(event: string, handler: EventHandler) {
    console.log(`Unsubscribed from event: ${event}`);
    this.events[event] = (this.events[event] || []).filter(h => h !== handler);
  }

  emit(event: string, payload?: unknown) {
    console.log(`Emitting event: ${event}`);
    (this.events[event] || []).forEach(handler => handler(payload));
  }
}
