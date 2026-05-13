import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../customHooks/useSocket";
import { cn } from "../../utils/cn.util";
import { constructImageUrl } from "../../utils/constructImageUrl";
import { groupObjType } from "../../types/types";

export const MyGroups = ({
  setCurrTab,
}: {
  setCurrTab: (tab: string) => void;
}) => {
  const { socket } = useSocket();

  const [myGrpList, setMyGrpList] = useState<groupObjType[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");
  const mounted = useRef(false);

  useEffect(() => {
    const componentMounted = mounted.current;

    if (componentMounted) {
      socket.emit("get-myGroups");
    }

    //=====GET MY GROUPS LIST=====
    socket.on("myGroupList", async (groupList: groupObjType[]) => {
      console.log(groupList);
      setMyGrpList(groupList);
    });

    return () => {
      socket.off("myGroupList");
      mounted.current = true;
    };
  }, []);

  return (
    // ====== MY GROUP CONTAINER ======
    <section className={cn("mx-auto w-[80%]")}>
      {/* ====== GROUP LIST ====== */}
      <ul className="flex flex-col gap-2">
        {myGrpList.length !== 0 ? (
          myGrpList.map((grp, index) => (
            <li
              className={cn(
                "flex items-center justify-between",
                "bg-light-bkg-color rounded-xl border p-4",
              )}
              key={`${grp.groupId}${index}`}
            >
              <div className={cn("flex items-center gap-4")}>
                <div
                  className={cn(
                    "h-20 w-20 overflow-hidden rounded-full",
                    "border-4 border-dashed border-orange-700",
                  )}
                >
                  <img
                    className="h-full w-full"
                    src={
                      grp.hasImage
                        ? constructImageUrl({
                            chat_type: "group",
                            id: grp.groupId,
                          })
                        : imgSrc
                    }
                    // alt="No image"
                  />
                </div>
                <p className="grp-name">{grp.groupName}</p>
              </div>
              <div className={cn("flex gap-2")}>
                <button
                  className={cn(
                    "w-25 rounded-md bg-orange-700 px-6 py-2 text-gray-300",
                  )}
                >
                  edit
                </button>
                <button
                  className={cn(
                    "w-25 rounded-md bg-gray-700 px-6 py-2 text-gray-300",
                  )}
                >
                  delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <div>
            <h1 className={cn("mt-[20vh] text-center text-5xl text-gray-500")}>
              Create Your Own Group
            </h1>
            <button
              className={
                "mx-auto mt-10 block rounded-md bg-orange-700 px-6 py-3"
              }
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
