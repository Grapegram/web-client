// WebSocket types based on backend API documentation

// WebSocket message structure
export interface WebSocketEvent {
  event_type: string;
  data: object;
}

// Authorization messages
export interface AuthMessage {
  action: 'authorize';
  token: string;
}

export interface AuthResponse {
  status: 'authorized' | 'unauthorized';
}

// Type guards
export function isAuthResponse(message: unknown): message is AuthResponse {
  return (
    typeof message === 'object' &&
    message !== null &&
    'status' in message &&
    (message.status === 'authorized' || message.status === 'unauthorized')
  );
}

export function isWebSocketEvent(message: unknown): message is WebSocketEvent {
  return (
    typeof message === 'object' &&
    message !== null &&
    'event_type' in message &&
    'data' in message &&
    typeof (message.event_type === 'string') &&
    typeof (message as WebSocketEvent).data === 'object'
  );
}
