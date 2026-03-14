import { Server } from 'socket.io';
import http from 'http';
import { env } from '@packages/shared-config/env';

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}
