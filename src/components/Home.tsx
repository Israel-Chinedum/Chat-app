import { Chat } from "./Chat";
import { Groups } from "./Groups";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

export const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  type currChatObj = {
    username: string;
    id: string;
  };

  const [currentSpace, setSpace] = useState<string>("chat");
  const [chatType, setChatType] = useState<string>("private");
  const [currentChat, setCurrChat] = useState<currChatObj>({
    username: "",
    id: "",
  });
  const [user, setUser] = useState<currChatObj>({ username: "", id: "" });
  const [socket, setSocket] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>({ url: "", count: 0 });

  useEffect(() => {
    if (user.id && !socket) {
      setSocket(io("http://localhost:2400", { auth: { userId: user.id } }));
    }
    console.log(user);
  }, [user]);

  const { response } = useFetch({
    method: "get",
    loadAnimation: false,
    endPoint,
  });

  useEffect(() => {
    response.message.user && setUser(response.message.user);
  }, [response]);

  useEffect(() => {
    return () =>
      setEndPoint({
        url: "http://localhost:2400/userList",
        count: endPoint.count + 1,
      });
  }, []);

  return (
    socket && (
      <socketContext.Provider value={socket}>
        <User.Provider value={{ user, setUser }}>
          <CurrentSpace.Provider value={{ currentSpace, setSpace }}>
            <CurrentChat.Provider value={{ currentChat, setCurrChat }}>
              <ChatType.Provider value={{ chatType, setChatType }}>
                <div id="home-container">
                  <nav id="navigations">
                    <ul>
                      <li onClick={() => setSpace("chat")}>Chats</li>
                      <li onClick={() => setSpace("people")}>Profile</li>
                      <li onClick={() => setSpace("groups")}>Groups</li>
                    </ul>
                  </nav>
                  <div id="home-body">
                    {currentSpace == "chat" && <Chat />}
                    {currentSpace == "groups" && <Groups />}
                  </div>
                </div>
              </ChatType.Provider>
            </CurrentChat.Provider>
          </CurrentSpace.Provider>
        </User.Provider>
      </socketContext.Provider>
    )
  );
};
