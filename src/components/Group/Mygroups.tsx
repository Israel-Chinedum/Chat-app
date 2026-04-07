import { useState, useEffect, useContext, useRef } from "react";
import { socketContext } from "../MyContext";

type groupInfo = {
  groupName: string;
  groupImage: string;
};

type groupData = {
  groupName: string;
  member: Boolean;
  groupImage:
    | {
        type: string;
        buffer: Buffer;
      }
    | string;
};

export const MyGroups = () => {
  const socket = useContext(socketContext);

  const [myGrpList, setMyGrpList] = useState<groupInfo[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");
  const mounted = useRef(false);

  const isObject = (
    data: groupData["groupImage"],
  ): data is { type: string; buffer: Buffer } => {
    return (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      "buffer" in data
    );
  };

  useEffect(() => {
    const componentMounted = mounted.current;

    if (componentMounted) {
      socket.emit("get-myGroups");
    }

    //=====GET MY GROUPS LIST=====
    socket.on("myGroupList", async (data: groupData[]) => {
      console.log(data);
      const grpList = [];
      for (let i of data) {
        if (isObject(i.groupImage)) {
          // console.log("I :", i);
          const blob = await fetch(
            `data:${i.groupImage.type};base64,${i.groupImage.buffer}`,
          ).then((res) => res.blob());
          const src = URL.createObjectURL(blob);
          // console.log("SRC: ", src);
          grpList.push({
            groupName: i.groupName,
            groupImage: src,
          });
        } else {
          grpList.push({
            groupName: i.groupName,
            groupImage: imgSrc,
          });
        }
      }
      grpList.sort((a: any, b: any) => a.groupName.localeCompare(b.groupName));
      console.log(grpList);
      setMyGrpList(grpList);
    });

    return () => {
      socket.off("myGroupList");
      mounted.current = true;
    };
  }, []);

  return (
    <section id="my-groups">
      <ul className="groups">
        {myGrpList.length !== 0 &&
          myGrpList.map((grp, index) => (
            <li className="user-group" key={index}>
              <div>
                <div className="img-container">
                  <img
                    className="grp-img"
                    src={grp.groupImage}
                    // alt="No image"
                  />
                </div>
                <p className="grp-name">{grp.groupName}</p>
              </div>
              <div>
                <button className="edit-btn">edit</button>
                <button className="delete-btn">delete</button>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
};
