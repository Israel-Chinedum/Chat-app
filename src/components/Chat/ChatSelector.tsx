import "../../components_css/Chat_CSS/friends.css";
import { useState, useEffect, useRef } from "react";
import { MiniLoadAnimation } from "../Animation/LoadAnimation";
import { useCurrentChat } from "../../customHooks/useCurrentChat";
import { chatListObj } from "../../types/types";
import { cn } from "../../utils/cn.util";
import { useMessage } from "../../customHooks/useMessage";
import { useSocket } from "../../customHooks/useSocket";

export const ChatSelector = () => {
  const { socket } = useSocket();
  const { currentChat, setCurrChat } = useCurrentChat();
  const { showMessage } = useMessage();

  // const [chats, setChats] = useState<chatListObj[]>([]);
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<chatListObj[]>([]);
  const [chatList, setChatList] = useState<chatListObj[]>([]);

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

  // ====== SEND REQUEST ======
  const sendRequest = ({
    recipientId,
    type,
  }: {
    recipientId: string;
    type: "groupId" | "chat_id";
  }) => {
    const id = type === "groupId" ? { groupId: recipientId } : { recipientId };
    socket
      .timeout(20000)
      .emit(
        type === "chat_id" ? "friend-request" : "join-group-request",
        id,
        (
          err: Error,
          response: { status: "success" | "error"; msg: string },
        ) => {
          if (err) {
            showMessage({
              text: "Request failed or timedout!",
              status: "error",
            });
          } else if (response.status === "error") {
            showMessage({ text: `${response.msg}`, status: "normal" });
          } else if (response.status === "success") {
            showMessage({ text: `${response.msg}`, status: response.status });
          }
        },
      );
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
          showMessage({ text: "Request failed or timedout!", status: "error" });
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
    // socket.on("friend-request-server-response", {});

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
                      sendRequest({
                        recipientId: chat.chat_id,
                        type: "chat_id",
                      });
                    } else if (chat.groupId) {
                      sendRequest({
                        recipientId: chat.groupId,
                        type: "groupId",
                      });
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
