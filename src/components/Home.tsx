import { Chat } from "./Chat/Chat";
import { Groups } from "./Group/Groups";
import { Notifications } from "./Notifications";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { initiateId } from "./UserId";
import {
  socketContext,
  CurrentChat,
  User,
  CurrentSpace,
  ChatType,
} from "./MyContext";
import { io } from "socket.io-client";
import { useFetch } from "../customHooks/useFetch";
import "../components_css/home.css";
import { currChatObj, chatListObj } from "../types/types";
import { cn } from "../lib/utils";

export const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<string>("chats");
  const [chatType, setChatType] = useState<string>("private");
  const [currentChat, setCurrChat] = useState<currChatObj>({
    username: "",
    id: "",
  });

  const [tabs, setTabs] = useState([
    "Chats",
    "Profile",
    "Groups",
    "Notifications",
  ]);

  const [socket, setSocket] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>({ url: "", count: 0 });

  const initiateSocketConnection = () => {
    setSocket(
      io("http://localhost:2400", {
        withCredentials: true,
      }),
    );
  };

  useEffect(() => {}, [socket]);

  useEffect(() => {
    initiateSocketConnection();
    console.log("mounted");
    return () => {
      setSocket(null);
    };
  }, []);

  return (
    socket && (
      <socketContext.Provider value={socket}>
        <CurrentSpace.Provider value={{ currentTab, setCurrentTab }}>
          <CurrentChat.Provider value={{ currentChat, setCurrChat }}>
            <ChatType.Provider value={{ chatType, setChatType }}>
              <div className="text-gray-400">
                <nav className={cn("border-b border-dashed border-orange-800")}>
                  <ul
                    className={cn(
                      "flex justify-center gap-10",
                      "pt-4 text-[1.1rem]",
                    )}
                  >
                    {tabs.map((tab, index) => (
                      <li
                        className={cn(
                          "hover:bg-dark-bkg cursor-pointer",
                          "rounded-tl-lg rounded-tr-lg px-4 py-2 hover:text-orange-700",

                          currentTab == tab.toLowerCase() &&
                            "bg-dark-bkg text-orange-700",
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
                <div id="home-body">
                  {currentTab == "chats" && <Chat />}
                  {currentTab == "groups" && (
                    <Groups setCurrentTab={setCurrentTab} />
                  )}
                  {currentTab == "notifications" && <Notifications />}
                </div>
              </div>
            </ChatType.Provider>
          </CurrentChat.Provider>
        </CurrentSpace.Provider>
      </socketContext.Provider>
    )
  );
};
