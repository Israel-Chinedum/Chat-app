import { createContext, ReactNode, useRef, useState } from "react";
import { cn } from "../lib/utils";

type msg = {
  text: string;
  duration?: number;
};

type status = "success" | "error" | "normal";

export const MessageContext = createContext<
  | {
      showMessage: (arg: msg) => void;
      status: status;
      setStatus: (arg: status) => void;
    }
  | undefined
>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<status>("normal");
  const timeout = useRef<number>(undefined);

  const showMessage = ({ text, duration }: msg) => {
    clearTimeout(timeout?.current);

    // if (duration) {
    //   timeout.current = setTimeout(() => {
    //     setMessage(null);
    //   }, duration);
    // }
    setMessage(text);
  };

  return (
    <MessageContext.Provider value={{ showMessage, status, setStatus }}>
      {children}
      {message && (
        <div
          className={cn(
            "absolute top-10 left-[50%] w-max translate-x-[-50%] bg-white",
            "rounded-sm p-4 text-xl",
          )}
        >
          <p
            className={cn(
              status === "success" && "text-green-500",
              status === "error" && "text-red-500",
              status === "normal" && "text-gray-400",
            )}
          >
            {message}
          </p>
        </div>
      )}
    </MessageContext.Provider>
  );
};
