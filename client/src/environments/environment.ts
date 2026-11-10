export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  sseEndpoint: '/orders/events',
  wsReconnectInterval: 3000,
  maxReconnectAttempts: 5,
  eventBufferSize: 100,
  connectionTimeout: 10000
};