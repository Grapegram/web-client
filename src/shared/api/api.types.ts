export interface ApiError {
  status_code: number;
  detail: string;
  extra?: Record<string, unknown>;
}

export type ChatSocket = {
  ws: WebSocket;
  chatId: string;
  authorized: boolean;
};
