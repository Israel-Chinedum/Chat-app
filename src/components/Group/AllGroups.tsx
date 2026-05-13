import { useEffect, useState, useRef } from "react";
import { useSocket } from "../../customHooks/useSocket";
import { cn } from "../../utils/cn.util";
import { groupObjType } from "../../types/types";
import { constructImageUrl } from "../../utils/constructImageUrl";

// ====== ALL GROUPS FUNCTION COMPONENT ======
export const AllGroups = ({
  setCurrTab,
}: {
  setCurrTab: (tab: string) => void;
}) => {
  const { socket } = useSocket();

  const [allGrpList, setAllGrpList] = useState<groupObjType[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");

  const mounted = useRef<boolean>(false);

  useEffect(() => {
    const componentMounted = mounted.current;

    if (componentMounted) {
      socket.emit("get-groups");
    }

    //=====GET ALL GROUPS LIST=====
    socket.on("groupList", async (groupList: groupObjType[]) => {
      setAllGrpList(groupList);
    });

    return () => {
      socket.off("groupList");
      mounted.current = true;
    };
  }, []);

  return (
    <section
      className={cn(
        "mx-auto h-[75vh] w-[90%]",
        "scroll-bar overflow-y-scroll px-4",
      )}
    >
      <ul className={cn("flex flex-col gap-2")}>
        {allGrpList.length !== 0 ? (
          allGrpList.map((grp, index) => (
            <li
              className={cn(
                "flex items-center justify-between",
                "bg-light-bkg-color rounded-xl border p-4",
              )}
              key={`${grp.groupName}${index}`}
            >
              <div className={cn("flex items-center gap-4")}>
                <div
                  className={cn(
                    "h-20 w-20 overflow-hidden rounded-full",
                    "border-4 border-dashed border-orange-700",
                  )}
                >
                  <img
                    src={
                      grp.hasImage
                        ? constructImageUrl({
                            chat_type: "group",
                            id: grp.groupId,
                          })
                        : imgSrc
                    }
                    className="h-full w-full"
                    // alt="No image"
                  />
                </div>
                <p className="grp-name">{grp.groupName}</p>
              </div>
              {!grp.member ? (
                <button
                  className={cn(
                    "rounded-md bg-orange-700 px-6 py-2 text-gray-300",
                  )}
                >
                  Join
                </button>
              ) : (
                <button
                  className={cn(
                    "rounded-md bg-gray-700 px-6 py-2 text-gray-300",
                  )}
                  onClick={() => {
                    console.log("im being clicked");
                    socket.emit("join-group", grp.groupName);
                    setCurrTab("chat");
                  }}
                >
                  Enter
                </button>
              )}
            </li>
          ))
        ) : (
          <div>
            <h1 className={cn("mt-[20vh] text-center text-5xl text-gray-500")}>
              Be the first to create a group
            </h1>
            <button
              className={cn(
                "mx-auto mt-10 block rounded-md bg-orange-700 px-6 py-3",
              )}
              onClick={() => setCurrTab("new-group")}
            >
              Create group
            </button>
          </div>
        )}
      </ul>
    </section>
  );
};
