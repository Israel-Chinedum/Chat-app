import "../components_css/groups.css";
import { useState, useRef, useEffect, useContext } from "react";
import { display } from "../customHooks/useDisplay";
import {
  socketContext,
  CurrentSpace,
  ChatType,
  CurrentChat,
} from "./MyContext";
import { MiniLoadAnimation } from "./LoadAnimation";

export const Groups = () => {
  const { setSpace } = useContext(CurrentSpace);
  const { setChatType } = useContext(ChatType);
  const { setCurrChat } = useContext(CurrentChat);
  const socket = useContext(socketContext);

  type groupListObj = {
    groupName: string;
    groupImage: Blob;
    src?: string;
  };

  const allGroupsContainer = useRef<HTMLDivElement>(null);
  const myGroupsContainer = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const groupName = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const msg = useRef<HTMLParagraphElement>(null);

  const [imgSrc, setImgSrc] = useState<string>("");
  const [isPending, setPending] = useState(false);

  const [groups, setGroups] = useState<groupListObj[]>([]);
  const [myGroups, setMyGroups] = useState<groupListObj[]>([]);

  const [allGrpLoading, setAllGrpLoading] = useState(true);
  const [myGrpLoading, setMyGrpLoading] = useState(true);

  const { showing, setShowing, onDisplay, setDisplay } = display(3000);

  useEffect(() => {
    socket.emit("get-groups");
    socket.emit("get-myGroups");

    socket.on("groupList", (groupList: groupListObj[]) => {
      groupList.forEach((grp: any) => {
        const blob = new Blob([grp.groupImage], { type: "image/png" });
        grp["src"] = URL.createObjectURL(blob);
      });

      setAllGrpLoading(false);
      setGroups(groupList);
    });

    socket.on("myGroupList", (myGroupList: groupListObj[]) => {
      myGroupList.forEach((grp: any) => {
        const blob = new Blob([grp.groupImage], { type: "image/png" });
        grp["src"] = URL.createObjectURL(blob);
      });

      setMyGrpLoading(false);
      setMyGroups(myGroupList);
    });

    return () => {
      socket.off("groupList");
      socket.off("myGroupList");
    };
  }, []);

  useEffect(() => {
    if (isPending) {
      if (file.current?.files) {
        const reader = new FileReader();
        const currFile = file.current.files[0];

        reader.onload = () => {
          const image = {
            name: currFile.name,
            type: currFile.type,
            buffer: reader.result as ArrayBuffer,
          };

          socket.emit("new-group", {
            groupName: groupName.current?.value,
            image,
          });
        };
        reader.readAsArrayBuffer(currFile);
      }
    }

    socket.on("error", (error: string) => {
      msg.current && (msg.current.innerText = `${error}`);
      setDisplay(true);
    });

    socket.on("new-group", () => {
      msg.current && (msg.current.innerText = `Your group has been created!`);
      setDisplay(true);
    });

    return () => {
      socket.off("error");
      socket.off("new-group");
    };
  }, [isPending]);

  useEffect(() => {
    setPending(false);
  }, [onDisplay]);

  return (
    <>
      <div id="group-component-container">
        {onDisplay && <p id="grp-msg" ref={msg}></p>}
        <section id="search-box">
          <input type="text" placeholder="Search group" />
          <button>Search</button>
        </section>

        <section id="cover">
          <h1>All Groups</h1>
          <div
            className="groups-container"
            ref={allGroupsContainer}
            onWheel={(e) => {
              if (allGroupsContainer.current) {
                allGroupsContainer.current.scrollLeft += e.deltaY * 3;
              }
            }}
          >
            <MiniLoadAnimation
              loading={allGrpLoading}
              width={`${allGroupsContainer.current?.offsetWidth}px`}
              height={`${allGroupsContainer.current?.offsetHeight}px`}
            />
            {groups.map((group, index) => {
              return (
                <div
                  className="group"
                  key={index}
                  onClick={() => {
                    setChatType("group");
                    setCurrChat("my choice");
                    setSpace("chat");
                  }}
                >
                  <img
                    loading="lazy"
                    className="grp-image"
                    src={`${group.src}`}
                    alt=""
                  />
                  <p>{group.groupName}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="my-groups">
          <h1>My Groups</h1>
          <div
            className="groups-container"
            ref={myGroupsContainer}
            // onWheel={(e) => {
            //   if (myGroupsContainer.current) {
            //     myGroupsContainer.current.scrollLeft += e.deltaY * 3;
            //   }
            // }}
          >
            <MiniLoadAnimation
              loading={myGrpLoading}
              width={`${allGroupsContainer.current?.offsetWidth}px`}
              height={`${allGroupsContainer.current?.offsetHeight}px`}
            />
            {myGroups.map((myGroup, index) => {
              return (
                <div className="group" key={index}>
                  <img
                    loading="lazy"
                    className="grp-image"
                    src={`${myGroup.src}`}
                    alt=""
                  />
                  <p>{myGroup.groupName}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="groups-buttons">
          <button id="create-grp-popup-btn" onClick={() => setShowing(true)}>
            Create new group
          </button>
        </section>

        {showing && (
          <div id="popup">
            <button id="close-grp-popup-btn" onClick={() => setShowing(false)}>
              X
            </button>
            <h1>New Group</h1>
            <input
              ref={file}
              type="file"
              id="file"
              onChange={(e) => {
                e.target.files &&
                  setImgSrc(`${URL.createObjectURL(e.target.files[0])}`);
              }}
            />
            <div id="img-holder">
              {imgSrc && <img ref={image} src={imgSrc} alt="" />}
            </div>
            <button onClick={() => file.current?.click()}>Select image</button>
            <input type="text" ref={groupName} placeholder="Group name" />
            <button id="create-grp-btn" onClick={() => setPending(true)}>
              Create
            </button>
          </div>
        )}
      </div>
    </>
  );
};
