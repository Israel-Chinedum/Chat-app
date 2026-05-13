import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn.util";
import { useSocket } from "../customHooks/useSocket";
import { useMessage } from "../customHooks/useMessage";
import { userProfile } from "../types/types";
import { useFetch } from "../customHooks/useFetch";

export const Profile = () => {
  const { socket } = useSocket();
  const { showMessage, clearMessage } = useMessage();

  const [edit, setEdit] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<userProfile | null>(null);

  const getUserDetails = () => {
    showMessage({
      text: "Fetching your profile...",
      status: "normal",
      duration: false,
    });

    socket.emit(
      "user-profile",
      (response: {
        msg: string | userProfile;
        status: "error" | "success";
      }) => {
        if (response.status === "error" && typeof response.msg === "string") {
          showMessage({ text: response.msg, status: response.status });
        } else if (
          response.status === "success" &&
          typeof response.msg === "object"
        ) {
          setUserProfile(response.msg);
          clearMessage();
        }
      },
    );
  };

  useEffect(() => {
    getUserDetails();

    return () => {
      clearMessage();
    };
  }, []);

  return (
    <section>
      <div className={cn("flex justify-center gap-30 p-4")}>
        {/* ====== PROFILE IMAGE ====== */}
        <div>
          <div
            className={cn("mt-[3vh] h-70 w-70 overflow-hidden rounded-full")}
          >
            <img src="./group_image.png" alt="" className="h-full w-full" />
          </div>

          <button
            className={cn(
              "mx-auto mt-10 block rounded-md bg-orange-700 px-6 py-3",
            )}
          >
            Select image
          </button>
        </div>

        {/* ====== USER DETAILS ====== */}
        <div>
          <form className={cn("mt-[5vh] flex flex-col gap-5")}>
            <input
              value={userProfile?.username}
              placeholder="Add username"
              type="text"
              disabled={edit ? false : true}
              className={cn(
                "w-90 rounded-md border border-gray-600 border-t-transparent border-r-transparent border-l-transparent px-4 py-3 text-[18px] transition-all duration-500 outline-none",
                edit && "border-t-gray-600 border-r-gray-600 border-l-gray-600",
              )}
            />
            <input
              type="text"
              value={userProfile?.firstname}
              placeholder="Add firstname"
              disabled={edit ? false : true}
              className={cn(
                "w-90 rounded-md border border-gray-600 border-t-transparent border-r-transparent border-l-transparent px-4 py-3 text-[18px] transition-all duration-500 outline-none",
                edit && "border-t-gray-600 border-r-gray-600 border-l-gray-600",
              )}
            />
            <input
              value={userProfile?.lastname}
              placeholder="Add lastname"
              type="text"
              disabled={edit ? false : true}
              className={cn(
                "w-90 rounded-md border border-gray-600 border-t-transparent border-r-transparent border-l-transparent px-4 py-3 text-[18px] transition-all duration-500 outline-none",
                edit && "border-t-gray-600 border-r-gray-600 border-l-gray-600",
              )}
            />
            <input
              value={userProfile?.email}
              placeholder="Add email"
              type="email"
              disabled={edit ? false : true}
              className={cn(
                "w-90 rounded-md border border-gray-600 border-t-transparent border-r-transparent border-l-transparent px-4 py-3 text-[18px] transition-all duration-500 outline-none",
                edit && "border-t-gray-600 border-r-gray-600 border-l-gray-600",
              )}
            />
            <input
              value={userProfile?.age}
              placeholder="Add age"
              type="number"
              disabled={edit ? false : true}
              className={cn(
                "w-90 rounded-md border border-gray-600 border-t-transparent border-r-transparent border-l-transparent px-4 py-3 text-[18px] transition-all duration-500 outline-none",
                edit && "border-t-gray-600 border-r-gray-600 border-l-gray-600",
              )}
            />
          </form>

          {/* ====== SAVE/EDIT BUTTONS ====== */}
          <div className={cn("mt-15 flex gap-2")}>
            <button
              className={cn("w-full rounded-md bg-orange-700 px-6 py-3")}
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
            {edit && (
              <button
                className={cn("w-full rounded-md bg-gray-700 px-6 py-3")}
                onClick={() => setEdit(false)}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
