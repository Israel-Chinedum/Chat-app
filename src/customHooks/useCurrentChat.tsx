import { useContext } from "react";
import { CurrentChatContext } from "../context/CurrentChatContext";

export const useCurrentChat = () => {
  const context = useContext(CurrentChatContext);
  if (!context)
    throw new Error("useCurrentChat must be used within CurrentChatContext");
  return context;
};
