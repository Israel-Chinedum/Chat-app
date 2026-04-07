import "../../components_css/Chat_CSS/friends.css";
import { useState, useEffect, useContext, useRef } from "react";
import { useFetch } from "../../customHooks/useFetch";
import { MiniLoadAnimation } from "../Animation/LoadAnimation";
import { CurrentChat, socketContext } from "../MyContext";
import { chatListObj } from "../../types/types";
import { cn } from "../../lib/utils";

export const Spaces = () => {
  type people = {
    username: string;
    chat_id: string;
  };

  type endPointObj = {
    url: string;
    count: number;
  };

  // const [chats, setChats] = useState<chatListObj[]>([]);
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [peopleList, setPeopleList] = useState<people[]>([]);
  const [searchList, setSearchList] = useState<chatListObj[]>([]);
  const [chatList, setChatList] = useState<chatListObj[]>([]);

  const { currentChat, setCurrChat } = useContext(CurrentChat);
  const socket = useContext(socketContext);

  const chatSearch = useRef<HTMLInputElement>(null);

  // ====== SEARCH THROUGH CHAT LIST FOR CHATS ======
  const quickSearch = () => {
    const chat = chatList.filter((chat) => {
      const searchTerm = chatSearch.current?.value;
      if (!searchTerm) return false;
      return chat.chat_name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setSearchList(chat);
  };

  // ====== EMIT REQUES TO SERVER TO SEARCH FOR CHATS ======
  const search = () => {
    socket.emit("chat-search", { searchTerm: chatSearch.current?.value });
  };

  // ====== SEND FRIEND REQUEST ======
  const sendFriendRequest = (chat_id: string) => {
    socket.emit("friend-request", { recipientId: chat_id });
  };

  // ====== SEND GROUP REQUEST ======
  const sendGroupRequest = (groupId: string) => {
    socket.emit("join-group-request", { groupId });
  };

  // ====== CHECK IF USER ALREADY EXISTS IN CHATLIST ======
  const chatExists = (chat: chatListObj) => {
    return chatList.some((thisChat) => {
      console.log("got here");
      if (!thisChat.chat_id && thisChat.groupId) {
        console.log("this");
        return thisChat.groupId === chat.groupId;
      } else {
        console.log("here");
        return thisChat.chat_id === chat.chat_id;
      }
    });
  };

  // ====== LISTEN FOR RESPONSE FROM SERVER ON SEARCH REQUEST ======
  useEffect(() => {
    setLoading(true);

    // ====== GET LIST OF CHATS ======
    socket
      .timeout(20000)
      .emit("getChatList", (err: Error | null, response: chatListObj[]) => {
        if (err) {
          setLoading(false);
          console.log("Request failed or timed out!");
          return;
        } else if (response) {
          console.log("LISTOFCHATS: ", response);
          setChatList(response);
          setLoading(false);
        } else {
          console.log("Chats not found!");
        }
      });

    // ====== LISTEN FOR SEARCH RESULTS FROM SERVER ======
    socket.on("chat-search", (data: chatListObj[]) => {
      console.log("chatList: ", data);
      setSearchList(data);
      socket.off("chatList");
    });

    // ====== LISTEN FOR SERVER RESPONSE WHEN USER CLICKS ADD FRIEND ======
    socket.on("friend-request-server-response", {});

    return () => {
      socket.off("chat-search");
    };
  }, []);

  useEffect(() => {
    console.log(currentChat);
  }, [currentChat]);

  return (
    <div
      id="people-container"
      className={cn(
        "bg-split-bkg rounded-tl-xl rounded-bl-xl",
        "relative grid w-90 grid-rows-[10%_1fr] p-2",
      )}
    >
      <MiniLoadAnimation loading={loading} width={"100%"} height={"100%"} />
      <div
        id="people-search"
        className="grid grid-cols-[70%_1fr] gap-2 px-1 pb-2"
      >
        <input
          className={cn("bg-dark-bkg rounded-[5px] p-2 text-white outline-0")}
          ref={chatSearch}
          type="text"
          id="ppl-search-input"
          onChange={quickSearch}
          placeholder="Search chats..."
        />
        <button
          className="rounded-[5px] bg-orange-700 px-3"
          id="ppl-search-btn"
          onClick={() => {
            search();
          }}
        >
          Search
        </button>
      </div>

      <div
        id="people-box"
        className={cn(
          "border border-dashed border-orange-700",
          "rounded-xl p-2",
        )}
      >
        {!searchList.length &&
          chatList?.map((chat, index) => (
            <li
              className={cn(
                "list-none p-2 hover:bg-orange-700",
                "rounded-[5px]",
              )}
              key={index}
              onClick={() => {
                const type = chat.chat_id ? "private" : "group";
                setCurrChat({
                  username: chat.chat_name,
                  id: chat.chat_id || chat.groupId,
                  type,
                });

                socket.emit("fetch-messages", {
                  recipientId: type == "private" ? chat.chat_id : chat.groupId,
                  type,
                });
              }}
            >
              {chat.chat_name}
            </li>
          ))}

        {/* ====== SEARCH LIST ====== */}
        {searchList.length != 0 &&
          searchList.map((chat, index) => (
            <li
              className={cn(
                "list-none p-2 hover:bg-orange-700",
                "flex items-center rounded-[5px]",
              )}
              key={index}
            >
              <p className={cn("me-auto")}>{chat.chat_name}</p>
              {!chatExists(chat) && (
                <button
                  className="bg-dark-bkg rounded-[5px] p-1 text-gray-400"
                  onClick={() => {
                    if (chat.chat_id) {
                      sendFriendRequest(chat.chat_id);
                    } else if (chat.groupId) {
                      sendGroupRequest(chat.groupId);
                    }
                  }}
                >
                  {chat.chat_id ? "add friend" : "join group"}
                </button>
              )}
            </li>
          ))}
      </div>
    </div>
  );
};
