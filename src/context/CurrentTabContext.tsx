import { createContext, ReactNode, useState } from "react";

export const CurrentTabContext = createContext<
  { currentTab: string; setCurrentTab: (arg: string) => void } | undefined
>(undefined);

export const CurrentTabProvider = ({ children }: { children: ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<string>("chats");

  return (
    <CurrentTabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </CurrentTabContext.Provider>
  );
};
