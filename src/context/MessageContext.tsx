import { createContext, ReactNode, useRef, useState } from "react";
import { cn } from "../utils/cn.util";

type msg = {
  text: string;
  duration?: number | false;
  status: "success" | "error" | "normal";
};

export const MessageContext = createContext<
  | {
      showMessage: (arg: msg) => void;
      clearMessage: () => void;
    }
  | undefined
>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<msg | null>(null);
  const timeout = useRef<number>(undefined);

  // ====== SHOW MESSAGE ======
  const showMessage = ({ text, duration = 3000, status }: msg) => {
    clearTimeout(timeout?.current);

    if (duration) {
      timeout.current = setTimeout(() => {
        setMessage(null);
      }, duration);
    }
    setMessage({ text, status });
  };

  // ====== CLEAR MESSAGE ======
  const clearMessage = () => setMessage(null);

  return (
    <MessageContext.Provider value={{ showMessage, clearMessage }}>
      {children}
      {message && (
        <div
          className={cn(
            "bg-light-bkg absolute top-10 left-[50%] w-max translate-x-[-50%]",
            "rounded-sm border border-gray-600 p-4 text-xl",
          )}
        >
          <p
            className={cn(
              message.status === "success" && "text-green-500",
              message.status === "error" && "text-red-500",
              message.status === "normal" && "text-gray-400",
            )}
          >
            {message.text}
          </p>
        </div>
      )}
    </MessageContext.Provider>
  );
};
