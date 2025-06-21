import "../../components_css/Group_CSS/groups.css";
import { getUserId } from "../UserId";
import { useState, useRef, useContext, useEffect } from "react";
import { socketContext } from "../MyContext";
import { display } from "../../customHooks/useDisplay";
import { MiniLoadAnimation } from "../Animation/LoadAnimation";

export const Groups = () => {
  const socket = useContext(socketContext);
  const { showing, setShowing } = display();

  type imgObj = {
    name: string;
    type: string;
    buffer: ArrayBuffer;
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

  type groupArr = {
    groupName: string;
    member: Boolean;
    groupImage: string;
  };

  type groupInfo = {
    groupName: string;
    groupImage: string;
  };

  const [allGrpList, setAllGrpList] = useState<groupArr[]>([]);
  const [myGrpList, setMyGrpList] = useState<groupInfo[]>([]);
  const [currTab, setCurrTab] = useState<string>("all-groups");
  const [updateKey, setUpdateKey] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");
  const [fileName, setFileName] = useState<string>("No image selected");
  const [isPending, setPending] = useState<boolean>(false);
  const mounted = useRef<boolean>(false);
  const groupName = useRef<HTMLInputElement>(null);
  const msg = useRef<string>("");
  const file = useRef<HTMLInputElement>(null);

  const isObject = (
    data: groupData["groupImage"]
  ): data is { type: string; buffer: Buffer } => {
    return (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      "buffer" in data
    );
  };

  const readFile = () => {
    if (file.current?.files) {
      const reader = new FileReader();
      const currFile = file.current.files[0];
      console.log(file.current.files);
      reader.onload = () => {
        const image = {
          name: currFile.name,
          type: currFile.type,
          buffer: reader.result as ArrayBuffer,
        };
        console.log("about to read");
        emitRequest(image);
      };
      reader.readAsArrayBuffer(currFile);
    }
  };

  const emitRequest = (image?: imgObj) => {
    setPending(true);
    socket.emit("new-group", {
      groupName: groupName.current?.value,
      image: image || "no image",
    });
  };

  useEffect(() => {
    const componentMounted = mounted.current;

    if (componentMounted) {
      socket.emit("get-groups");
      socket.emit("get-myGroups");
    }

    socket.on("new-group", () => {
      setPending(false);
      msg.current = "Group has been created!";
      setShowing(true);
      setUpdateKey((prevKey) => prevKey + 1);
      setImgSrc("/group_image.png");
      setFileName("No image selected");
      setTimeout(() => {
        setShowing(false);
      }, 3000);
    });

    socket.on("error", (errMsg: string) => {
      setPending(false);
      msg.current = errMsg;
      setShowing(true);
      setTimeout(() => {
        setShowing(false);
      }, 3000);
    });

    //=====GET ALL GROUPS LIST=====
    socket.on("groupList", async (data: groupData[]) => {
      // console.log(data);
      const allGrps = [];
      for (let i of data) {
        if (isObject(i.groupImage)) {
          // console.log("I :", i);
          const blob = await fetch(
            `data:${i.groupImage.type};base64,${i.groupImage.buffer}`
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

    //=====GET MY GROUPS LIST=====
    socket.on("myGroupList", async (data: groupData[]) => {
      console.log(data);
      const grpList = [];
      for (let i of data) {
        if (isObject(i.groupImage)) {
          // console.log("I :", i);
          const blob = await fetch(
            `data:${i.groupImage.type};base64,${i.groupImage.buffer}`
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
      socket.off("new-group");
      socket.off("error");
      socket.off("groupList");
      socket.off("myGroupList");
      mounted.current = true;
    };
  }, []);

  return (
    <div id="groups-container">
      {/* ===== NAVIGATION BAR ===== */}
      <nav id="nav-bar">
        <ul id="tabs">
          <li className="tab" onClick={() => setCurrTab("all-groups")}>
            All Groups
          </li>
          <li className="tab" onClick={() => setCurrTab("my-groups")}>
            My Groups
          </li>
          <li className="tab" onClick={() => setCurrTab("new-group")}>
            New Group
          </li>
        </ul>
      </nav>

      <div id="grp-container-sections">
        {showing && <p id="grp-msg">{msg.current}</p>}
        {/* ===== ALL GROUPS ===== */}
        {currTab == "all-groups" && (
          <section id="all-groups">
            <ul className="groups">
              {allGrpList.length !== 0 &&
                allGrpList.map((grp, index) => (
                  <li className="group" key={index}>
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
                      <button className="enter-btn">Enter</button>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* ===== USER/MY GROUPS ===== */}
        {currTab == "my-groups" && (
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
        )}

        {/* ===== NEW GROUP ===== */}
        {currTab == "new-group" && (
          <section id="new-group">
            <MiniLoadAnimation
              loading={isPending}
              width={"100%"}
              height={"100%"}
            />
            <div id="new-grp-form">
              <div id="image-holder">
                <img src={imgSrc} alt="" />
              </div>
              <p id="img-name">{fileName}</p>
              <input
                key={updateKey}
                ref={file}
                type="file"
                accept=".jpg, .png, .jpeg, .jfif"
                style={{ display: "none" }}
                onChange={(e) => {
                  console.log("changed");
                  if (e.target.files) {
                    setImgSrc(`${URL.createObjectURL(e.target.files[0])}`);
                    setFileName(e.target.files[0].name);
                  }
                }}
              />
              <button
                className="btn"
                onClick={() => {
                  file.current?.click();
                }}
              >
                Select image
              </button>
              <input
                type="text"
                id="group-name"
                placeholder="Enter group name"
                ref={groupName}
              />
              <button
                className="btn"
                onClick={() => {
                  if (groupName.current?.value != "") {
                    console.log("clicked create!");
                    file.current?.files?.length != 0
                      ? readFile()
                      : emitRequest();
                  } else {
                    msg.current = "Please enter group name!";
                    setShowing(true);
                    setTimeout(() => {
                      setShowing(false);
                    }, 3000);
                  }
                }}
              >
                Create
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
