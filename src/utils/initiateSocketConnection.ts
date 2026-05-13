import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initiateSocketConnection = () => {
  if (socket) {
    socket.disconnect();
  }

  socket = io("http://localhost:2400", {
    withCredentials: true,
  });
};

export const getSocket = () => {
  if (!socket) initiateSocketConnection();
  return socket;
};
