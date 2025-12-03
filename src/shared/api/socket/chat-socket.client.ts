import { EventEmitter } from '@/shared/lib';

import type {
  AuthMessage,
  AuthResponse,
  WebSocketMessage
} from './socket.types';
import { isAuthResponse, isWebSocketMessage } from './socket.types';

export class ChatSocketClient {
  private socket?: WebSocket;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private isAuthorized = false;

  public emitter = new EventEmitter();

  constructor(
    private chatId: string,
    private token: string,
    private baseUrl = `${import.meta.env.VITE_SOCKET_URL}/ws/chat`
  ) {}

  connect(): void {
    const url = `${this.baseUrl}/${this.chatId}`;
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
    if (isWebSocketMessage(message)) {
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

  private handleEvent(message: WebSocketMessage): void {
    const event = message.data;
    const eventName = event.event_name;

    // Emit specific event
    this.emitter.emit(eventName, event);

    // Emit general event for subscribers listening to all events
    this.emitter.emit('event', event);
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

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.socket?.close();
  }
}
