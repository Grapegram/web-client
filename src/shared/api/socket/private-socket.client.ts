import { EventEmitter } from '@/shared/lib';

import type { AuthMessage, AuthResponse, WebSocketEvent } from './socket.types';
import { isAuthResponse, isWebSocketEvent } from './socket.types';

export class PrivateSocketClient {
  private socket?: WebSocket;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private isAuthorized = false;

  public emitter: EventEmitter;

  constructor(
    private url: string,
    private token: string,
    private baseUrl = `${import.meta.env.VITE_SOCKET_URL}`
  ) {
    this.emitter = new EventEmitter();
  }

  connect(): void {
    const url = `${this.baseUrl}/${this.url}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.sendAuth();
      this.emitter.emit('connected');
    };

    this.socket.onmessage = event => {
      this.handleMessage(event.data);
    };

    this.socket.onerror = error => {
      this.emitter.emit('error', error);
    };

    this.socket.onclose = () => {
      this.isAuthorized = false;
      this.emitter.emit('disconnected');

      this.attemptReconnect();
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectTimeout) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emitter.emit('max_reconnect_reached');
      return;
    }

    // Exponential backoff with max delay of 30 seconds
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    this.emitter.emit('reconnecting', {
      attempt: this.reconnectAttempts,
      delay
    });

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }

  private sendAuth(): void {
    const message: AuthMessage = {
      action: 'authorize',
      token: this.token
    };

    this.socket?.send(JSON.stringify(message));
  }

  updateToken(token: string): void {
    this.token = token;

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.sendAuth();
    }
  }

  private handleMessage(raw: string): void {
    let message: unknown;

    try {
      message = JSON.parse(raw);
    } catch (_error) {
      this.emitter.emit('parse_error', raw);
      return;
    }

    // Handle authorization status
    if (isAuthResponse(message)) {
      this.handleAuthResponse(message);
      return;
    }

    // Handle WebSocket event
    if (isWebSocketEvent(message)) {
      this.handleEvent(message);
      return;
    }

    this.emitter.emit('unknown_message', message);
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response.status === 'authorized') {
      this.isAuthorized = true;
      this.emitter.emit('authorized');
    } else if (response.status === 'unauthorized') {
      this.isAuthorized = false;
      this.emitter.emit('unauthorized');
    }
  }

  private handleEvent(event: WebSocketEvent): void {
    const data = event.data;
    const eventName = event.event_type;

    // Emit specific event
    this.emitter.emit(eventName, data);

    // Emit general event for subscribers listening to all events
    this.emitter.emit('event', data);
  }

  getConnectionState(): number {
    return this.socket?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  isAuth(): boolean {
    return this.isAuthorized;
  }

  send(data: object): void {
    if (!this.isConnected()) {
      return;
    }

    if (!this.isAuthorized) {
      return;
    }

    try {
      this.socket?.send(JSON.stringify(data));
    } catch (error) {
      this.emitter.emit('send_error', error);
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.socket?.close();
  }
}
