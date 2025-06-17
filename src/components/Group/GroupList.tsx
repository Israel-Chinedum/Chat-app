import "../components_css/friends.css";
import { useState, useEffect, useContext } from "react";
import { useFetch } from "../../customHooks/useFetch";
import { MiniLoadAnimation } from "../Animation/LoadAnimation";
import { CurrentChat, User, ChatType } from "../MyContext";

export const GroupList = () => {
  type people = {
    username: string;
    id: string;
  };

  type endPointObj = {
    url: string;
    count: number;
  };

  const [endPoint, setEndPoint] = useState<endPointObj>({ url: "", count: 0 });
  const [loading, setLoading] = useState(false);
  const [peopleList, setPeopleList] = useState<people[]>([]);

  const { currentChat, setCurrChat } = useContext(CurrentChat);
  const { chatType } = useContext(ChatType);
  const { setUser } = useContext(User);

  const { error, response } = useFetch({
    method: "get",
    endPoint,
    loadAnimation: false,
  });

  useEffect(() => {
    if (response.message) {
      if (typeof response.message != "string") {
        setPeopleList(response.message.userList);
        setUser(response.message.user);
        setLoading(false);
      }
    }
  }, [error, response]);

  useEffect(() => {
    setLoading(true);
    setEndPoint({
      url:
        chatType == "private"
          ? "http://localhost:2400/userList"
          : "nothing yet",
      count: endPoint.count + 1,
    });
  }, []);

  useEffect(() => {
    console.log(currentChat);
  }, [currentChat]);

  return (
    <div id="people-container">
      <MiniLoadAnimation loading={loading} width={"100%"} height={"100%"} />
      <div id="people-search">
        <input type="text" id="ppl-search-input" />
        <button id="ppl-search-btn" onClick={() => {}}>
          Search
        </button>
      </div>

      <div id="people-box">
        {peopleList.map((person, index) => (
          <li
            className="person"
            key={index}
            onClick={() => {
              setCurrChat({ username: person.username, id: person.id });
            }}
          >
            {person.username}
          </li>
        ))}
      </div>
    </div>
  );
};
