import { useEffect, useState, useRef } from "react";
import { socketContext } from "../MyContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// ====== TYPES ======

type groupArr = {
  groupName: string;
  member: Boolean;
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

type imgObj = {
  name: string;
  type: string;
  buffer: ArrayBuffer;
};

// ====== ALL GROUPS FUNCTION COMPONENT ======
export const AllGroups = ({
  setSpace,
}: {
  setSpace: (space: string) => void;
}) => {
  const navigate = useNavigate();
  const socket = useContext(socketContext);

  const [allGrpList, setAllGrpList] = useState<groupArr[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");

  const mounted = useRef<boolean>(false);

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
      socket.emit("get-groups");
    }

    //=====GET ALL GROUPS LIST=====
    socket.on("groupList", async (data: groupData[]) => {
      const allGrps = [];
      for (let i of data) {
        if (isObject(i.groupImage)) {
          // console.log("I :", i);
          const blob = await fetch(
            `data:${i.groupImage.type};base64,${i.groupImage.buffer}`,
          ).then((res) => res.blob());
          const src = URL.createObjectURL(blob);
          // console.log("SRC: ", src);
          allGrps.push({
            groupName: i.groupName,
            member: i.member,
            groupImage: src,
          });
        } else {
          allGrps.push({
            groupName: i.groupName,
            member: i.member,
            groupImage: imgSrc,
          });
        }
        console.log(i.member);
      }
      allGrps.sort((a: any, b: any) => a.groupName.localeCompare(b.groupName));
      setAllGrpList(allGrps);
    });

    return () => {
      socket.off("groupList");
      mounted.current = true;
    };
  }, []);

  return (
    <section id="all-groups">
      <ul className="groups">
        {allGrpList.length !== 0 &&
          allGrpList.map((grp, index) => (
            <li className="group" key={`${grp.groupName}${index}`}>
              <div>
                <div className="img-container">
                  <img
                    src={grp.groupImage}
                    className="grp-img"
                    // alt="No image"
                  />
                </div>
                <p className="grp-name">{grp.groupName}</p>
              </div>
              {!grp.member ? (
                <button className="join-btn">Join</button>
              ) : (
                <button
                  className="enter-btn"
                  onClick={() => {
                    console.log("im being clicked");
                    socket.emit("join-group", grp.groupName);
                    setSpace("chat");
                  }}
                >
                  Enter
                </button>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
};
