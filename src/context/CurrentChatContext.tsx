import { createContext, ReactNode, useState } from "react";
import { currChatObj, chatListObj } from "../types/types";

// ====== CURRENT CHAT CONTEXT ======
export const CurrentChatContext = createContext<
  | {
      currentChat: currChatObj | undefined;
      setCurrChat: (arg: currChatObj) => void;
    }
  | undefined
>(undefined);

// ====== CURRENT CHAT PROVIDER FUNCTION ======
export const CurrentChatProvider = ({ children }: { children: ReactNode }) => {
  const [currentChat, setCurrChat] = useState<currChatObj | undefined>(
    undefined,
  );

  return (
    <CurrentChatContext.Provider value={{ currentChat, setCurrChat }}>
      {children}
    </CurrentChatContext.Provider>
  );
};
