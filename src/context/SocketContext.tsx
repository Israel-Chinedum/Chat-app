import { createContext, ReactNode, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../utils/initiateSocketConnection";

export const SocketContext = createContext<{ socket: Socket } | undefined>(
  undefined,
);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = getSocket();

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
