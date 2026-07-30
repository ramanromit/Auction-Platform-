import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : `http://${window.location.hostname}:5000`;

export const socket = io(URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 3,
  timeout: 5000,
});
