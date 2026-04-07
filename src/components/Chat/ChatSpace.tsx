import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import { socketContext } from "../MyContext";
import "../../components_css/Chat_CSS/chatSpace.css";
import { useFetch } from "../../customHooks/useFetch";
import { CurrentChat } from "../MyContext";
import { cn } from "../../lib/utils";

export const ChatSpace = () => {
  const socket = useContext(socketContext);
  const { currentChat } = useContext(CurrentChat);

  type msgObj = {
    msg: string;
    recipientId: string;
    role?: string;
    type: "private" | "group";
    date?: any;
  };

  type endPointObj = {
    url: string;
    count: number;
  };

  const [messages, setMessages] = useState<msgObj[]>([]);
  const [message, setMessage] = useState<msgObj>();
  const [endPoint, setEndPoint] = useState<endPointObj>({ url: "", count: 0 });
  const chatBox = useRef<HTMLDivElement>(null);
  const effectRan = useRef(true);

  // ====== GET ALL MESSAGES WHEN COMPONENT MOUNTS ======
  const listenForAllMessages = () => {
    socket.on("messages", (messages: msgObj[]) => {
      console.log("got messages");
      messages.forEach((msg) => {
        msg.date && (msg.date = new Date(msg.date).getTime());
      });
      messages.sort((a: any, b: any) => a.date - b.date);
      setMessages(messages);
      console.log(messages);
    });
  };

  useEffect(() => {
    listenForAllMessages();

    return () => {
      socket.off("messages");
    };
  }, []);

  // ====== RECIEVE DIRECT MESSAGES ======
  const listenForDirectMessages = () => {
    socket.on("message", (message: any) => {
      message.status = "recieving";
      console.log(message);
      setMessages((prevMessages) => {
        return [...prevMessages, message];
      });
    });
  };

  useEffect(() => {
    listenForDirectMessages();
    return () => {
      socket.off("message");
    };
  }, []);

  useLayoutEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTo({
        top: chatBox.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const { error, response } = useFetch({
    method: "get",
    endPoint,
    loadAnimation: false,
  });

  useEffect(() => {
    error.message && console.log(error.message);

    if (response.message) {
      console.log(response.message);
    }
  }, [error, response]);

  // useEffect(() => {
  //   if (!effectRan.current) {
  //     socket.emit("fetch-messages");
  //     console.log("message emitted!");
  //     effectRan.current = true;
  //   }

  //   effectRan.current && (effectRan.current = false);
  // }, []);

  return (
    <div
      className={cn(
        "bg-dark-bkg grid h-[70vh] w-120 grid-rows-[10%_78%_12%]",
        "overflow-hidden rounded-tr-xl rounded-br-xl p-4",
      )}
    >
      {/* ====== DISPLAY CURRENT CHAT NAME ====== */}
      <div
        className={cn(
          "border-0 border-b border-dashed border-orange-700",
          "flex items-center rounded-full pl-5",
        )}
      >
        <p>{currentChat.username}</p>
      </div>

      {/* ====== MESSAGE BOX ====== */}
      <div
        className={cn("scroll-bar overflow-y-scroll px-2 py-5")}
        ref={chatBox}
      >
        {messages.map((currMsg, index) => (
          <div
            className={
              currMsg.role === "sender"
                ? cn(
                    "my-3 ml-auto w-max max-w-[70%] bg-orange-700 py-1 pr-4 pl-1 wrap-break-word",
                    "rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px]",
                    "[clip-path:polygon(0%_0%,calc(100%-10px)_0%,calc(100%-10px)_calc(100%-10px),100%_100%,0%_100%)]",
                  )
                : cn(
                    "bg-light-bkg my-3 w-max max-w-[70%] py-1 pr-1 pl-4",
                    "rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] wrap-break-word",
                    "[clip-path:polygon(0%_0%,10px_10px,10px_100%,100%_100%,100%_0%)]",
                  )
            }
            key={index}
          >
            <p>{currMsg.msg}</p>
          </div>
        ))}
      </div>

      {/* ====== MESSAGING TOOLS ====== */}
      <div
        className={cn(
          "grid grid-cols-[70%_1fr] gap-x-2",
          "bg-dark-bkg items-end",
        )}
      >
        {/* ====== TEXT AREA ====== */}
        <textarea
          className={cn(
            "resize-none rounded-lg border border-dashed border-orange-700",
            "p-2 outline-0",
            "bg-light-bkg",
          )}
          name=""
          value={message?.msg}
          id="chat-text-area"
          spellCheck="false"
          onChange={(e) => {
            setMessage({
              msg: e.target.value,
              recipientId: currentChat.id,
              role: "sender",
              type: currentChat.type,
            });
          }}
        ></textarea>
        <button
          className={cn("rounded-[5px] bg-orange-700 py-3 text-xl")}
          onClick={() => {
            setEndPoint({
              url: "http://localhost:2400/userList",
              count: endPoint.count + 1,
            });
            if (message?.msg) {
              setMessages((prevMessage) => {
                return [...prevMessage, message];
              });
              currentChat.type === "private"
                ? socket.emit("message", message)
                : socket.emit("group-msg", message);
              setMessage({
                msg: "",
                recipientId: currentChat.id,
                type: currentChat.type,
              });
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
