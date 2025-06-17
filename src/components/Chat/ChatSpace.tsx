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

export const ChatSpace = () => {
  const socket = useContext(socketContext);
  const { currentChat } = useContext(CurrentChat);

  type msgObj = {
    status: string;
    msg: string;
    recipientId: string;
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

  useEffect(() => {
    socket.on("message", (message: any) => {
      message.status = "recieving";
      setMessages((prevMessages) => {
        return [...prevMessages, message];
      });
    });

    socket.on("messages", (messages: msgObj[]) => {
      console.log("got messages");
      messages.forEach((msg) => {
        msg.date && (msg.date = new Date(msg.date).getTime());
      });
      messages.sort((a: any, b: any) => a.date - b.date);
      setMessages(messages);
      console.log(messages);
    });

    return () => {
      socket.off("message");
      socket.off("messages");
    };
  }, [messages]);

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

  useEffect(() => {
    if (!effectRan.current) {
      socket.emit("fetch-messages");
      console.log("message emitted!");
      effectRan.current = true;
    }

    effectRan.current && (effectRan.current = false);
  }, []);

  return (
    <div id="chat-space-container">
      <div id="current-chat">
        <p>{currentChat.username}</p>
      </div>
      <div id="message-box" ref={chatBox}>
        {messages.map(
          (currMsg, index) =>
            currentChat.id == currMsg.recipientId && (
              <div
                className={
                  currMsg.status == "sending" ? "sent-msg" : "recieved-msg"
                }
                key={index}
              >
                <p>{currMsg.msg}</p>
              </div>
            )
        )}
      </div>
      <div id="messaging-tools">
        <textarea
          name=""
          value={message?.msg}
          id="chat-text-area"
          spellCheck="false"
          onChange={(e) => {
            setMessage({
              status: "sending",
              msg: e.target.value,
              recipientId: currentChat.id,
            });
          }}
        ></textarea>
        <button
          id="chat-send-btn"
          onClick={() => {
            setEndPoint({
              url: "http://localhost:2400/userList",
              count: endPoint.count + 1,
            });
            if (message) {
              setMessages((prevMessage) => {
                return [...prevMessage, message];
              });
              socket.emit("message", message);
              setMessage({ status: "", msg: "", recipientId: currentChat.id });
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
