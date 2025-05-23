import "../components_css/groups.css";
import { useState, useRef, useContext, useEffect } from "react";
import { socketContext } from "./MyContext";
import { display } from "../customHooks/useDisplay";

export const Groups = () => {
  const socket = useContext(socketContext);
  const { onDisplay, setDisplay } = display(3000);

  const [currTab, setCurrTab] = useState<string>("all-groups");
  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");
  const [fileName, setFileName] = useState<string>("No image selected");
  const [isPending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const groupName = useRef<HTMLInputElement>(null);
  const msg = useRef<string>("");
  const file = useRef<HTMLInputElement>(null);

  const readFile = () => {
    if (file.current?.files) {
      const reader = new FileReader();
      const currFile = file.current.files[0];
      reader.onload = () => {
        const image = {
          name: currFile.name,
          type: currFile.type,
          buffer: reader.result as ArrayBuffer,
        };
        socket.emit(
          "new-group",
          {
            groupName: groupName.current?.value,
            image,
          },
          () => {
            msg.current = "Pending...";
            setPending(true);
          }
        );
        reader.readAsArrayBuffer(currFile);
      };
    }
  };

  // useEffect(() => {
  //   if (!isPending) {

  //   }
  // }, [isPending]);

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

      <div>
        {onDisplay && <p id="grp-msg">{msg.current}</p>}
        {/* ===== ALL GROUPS ===== */}
        {currTab == "all-groups" && (
          <section id="all-groups">
            <ul className="groups">
              <li className="group">
                <div className="img-container">
                  <img className="grp-img" alt="No image" />
                </div>
                <p className="grp-name">Group Name</p>
              </li>
            </ul>
          </section>
        )}

        {/* ===== USER/MY GROUPS ===== */}
        {currTab == "my-groups" && (
          <section id="my-groups">
            <ul className="groups">
              <li className="user-group">
                <div>
                  <div className="img-container">
                    <img className="grp-img" alt="No image" />
                  </div>
                  <p className="grp-name">Group Name</p>
                </div>
                <div>
                  <button className="edit-btn">edit</button>
                  <button className="delete-btn">delete</button>
                </div>
              </li>
            </ul>
          </section>
        )}

        {/* ===== NEW GROUP ===== */}
        {currTab == "new-group" && (
          <section id="new-group">
            <div id="new-grp-form">
              <div id="image-holder">
                <img src={imgSrc} alt="" />
              </div>
              <p id="img-name">{fileName}</p>
              <input
                ref={file}
                type="file"
                accept=".jpg, .png, .jpeg, .jfif"
                style={{ display: "none" }}
                onChange={(e) => {
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
                  if (groupName.current?.value != null) {
                    readFile();
                  } else {
                    setError(true);
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
