import { cn } from "../utils/cn.util";
import { useRef } from "react";
import { useCurrentTab } from "../customHooks/useCurrentTab";

export const NavBar = () => {
  const { currentTab, setCurrentTab } = useCurrentTab();

  // ====== USEREF VARIABLE ======
  const tabs = useRef(["Chats", "Profile", "Groups", "Notifications"]);

  //   ====== TSX ======
  return (
    <nav className={cn("border-b border-dashed border-orange-800")}>
      <ul className={cn("flex justify-center gap-10", "pt-4 text-[1.1rem]")}>
        {tabs.current.map((tab, index) => (
          <li
            className={cn(
              "hover:bg-dark-bkg cursor-pointer",
              "rounded-tl-lg rounded-tr-lg px-4 py-2 hover:text-orange-700",

              currentTab == tab.toLowerCase() && "bg-dark-bkg text-orange-700",
            )}
            key={`${index}${tab}`}
            onClick={() => {
              setCurrentTab(tab.toLowerCase());
            }}
          >
            {tab}
          </li>
        ))}
      </ul>
    </nav>
  );
};
