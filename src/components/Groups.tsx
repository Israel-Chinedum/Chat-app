import "../components_css/groups.css";
import { useState, useRef } from "react";

export const Groups = () => {
  const [currTab, setCurrTab] = useState<string>("all-groups");
  const [imgSrc, setImgSrc] = useState<string>();
  const file = useRef<HTMLInputElement>(null);

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
              <p id="img-name"></p>
              <input
                ref={file}
                type="file"
                accept=".jpg, .png, .jpeg, .jfif"
                style={{ display: "none" }}
                onChange={(e) => {
                  e.target.files &&
                    setImgSrc(`${URL.createObjectURL(e.target.files[0])}`);
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
              />
              <button className="btn">Create</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
