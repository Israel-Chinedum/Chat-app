import { useState } from "react";
import { AllGroups } from "./AllGroups";
import { MyGroups } from "./Mygroups";
import { NewGroup } from "./NewGroup";
import { cn } from "../../utils/cn.util";

export const Groups = () => {
  const [currTab, setCurrTab] = useState<string>("all-groups");
  const tabList = [
    { name: "All Groups", value: "all-groups" },
    { name: "My Groups", value: "my-groups" },
    { name: "New Group", value: "new-group" },
  ];

  return (
    <div className={cn("mx-auto h-[70vh] w-[80%]")}>
      {/* ===== NAVIGATION BAR ===== */}
      <nav className={cn("px-4 py-8")}>
        <ul className={cn("flex justify-center gap-20")}>
          {tabList.map((tab, index) => (
            <li
              key={index}
              className={cn(
                currTab === tab.value && "bg-dark-bkg text-orange-700",
                "hover:bg-dark-bkg hover:text-orange-700",
                "cursor-pointer rounded-md p-3",
              )}
              onClick={() => setCurrTab(tab.value)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </nav>

      <div id="grp-container-sections">
        {/* ===== ALL GROUPS ===== */}
        {currTab == "all-groups" && <AllGroups setCurrTab={setCurrTab} />}

        {/* ====== MY GROUPS ====== */}
        {currTab == "my-groups" && <MyGroups setCurrTab={setCurrTab} />}

        {/* ===== NEW GROUP ===== */}
        {currTab == "new-group" && <NewGroup />}
      </div>
    </div>
  );
};
