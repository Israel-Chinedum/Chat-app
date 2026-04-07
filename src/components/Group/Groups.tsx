import "../../components_css/Group_CSS/groups.css";
import { useState, useRef } from "react";
import { useMessage } from "../../customHooks/useMessage";
import { AllGroups } from "./AllGroups";
import { MyGroups } from "./Mygroups";
import { NewGroup } from "./NewGroup";

export const Groups = ({
  setCurrentTab,
}: {
  setCurrentTab: (currentTab: string) => void;
}) => {
  const { showing, setShowing } = display();

  const [currTab, setCurrTab] = useState<string>("all-groups");

  // const mounted = useRef<boolean>(false);
  const msg = useRef<string>("");

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
        {currTab == "all-groups" && <AllGroups setSpace={setCurrentTab} />}

        {/* ====== MY GROUPS ====== */}
        {currTab == "my-groups" && <MyGroups />}

        {/* ===== NEW GROUP ===== */}
        {currTab == "new-group" && (
          <NewGroup setShowing={setShowing} msg={msg.current} />
        )}
      </div>
    </div>
  );
};
