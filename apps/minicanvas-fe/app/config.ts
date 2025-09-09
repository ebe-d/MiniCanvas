export const HTTP_BACKEND = process.env.HTTP_BACKEND_URL
  ? `https://${process.env.HTTP_BACKEND_URL}`
  : "http://localhost:3001";

export const WS_URL = process.env.WS_BACKEND_URL
  ? `wss://${process.env.WS_BACKEND_URL}`
  : "ws://localhost:8080";
