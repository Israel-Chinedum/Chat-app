import { useState, useRef } from "react";
import { useSocket } from "../../customHooks/useSocket";
import { useMessage } from "../../customHooks/useMessage";
import { cn } from "../../utils/cn.util";

type imgObj = {
  name: string;
  type: string;
  buffer: ArrayBuffer;
};

export const NewGroup = () => {
  const { socket } = useSocket();
  const { showMessage } = useMessage();

  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");
  const [fileName, setFileName] = useState<string>("No image selected");

  const file = useRef<HTMLInputElement>(null);
  const groupName = useRef<HTMLInputElement>(null);

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

  // ====== EMIT REQUEST TO CREATE NEW GROUP ======
  const emitRequest = (image?: imgObj) => {
    // ====== SHOW PENDING MESSAGE ======
    showMessage({ text: "Pending...", duration: false, status: "normal" });

    // ====== EMIT SOCKET REQUEST TO CREATE NEW GROUP ======
    socket.timeout(20000).emit(
      "new-group",
      {
        groupName: groupName.current?.value,
        image: image || "no image",
      },
      (err: Error, response: { msg: string; status: "success" | "error" }) => {
        if (err) {
          showMessage({ text: "Request failed or timedout!", status: "error" });
          return;
        }
        if (response.status === "error") {
          showMessage({ text: response.msg, status: response.status });
        } else if (response.status === "success") {
          showMessage({ text: response.msg, status: response.status });
          // ====== RESET IMAGE SRC TO DEFAULT AND FILENAME TO DEFAULT ======
          setImgSrc("/group_image.png");
          setFileName("No image selected");
        }
      },
    );
  };

  return (
    <section id="new-group">
      {/* ====== FORM CONTAINER DIV ====== */}
      <div>
        {/* ====== PROFILE PICTURE CONTAINER ====== */}
        <div
          className={cn(
            "mx-auto h-70 w-70 overflow-hidden rounded-full border-3 border-dashed border-orange-700 bg-red-50",
          )}
        >
          <img src={imgSrc} className="h-full w-full" alt="" />
        </div>

        {/* ====== FILE NAME ====== */}
        <p className="mt-4 text-center">{fileName}</p>

        {/* ====== FILE INPUT ====== */}
        <input
          ref={file}
          type="file"
          accept=".jpg, .png, .jpeg, .jfif"
          className="hidden"
          onChange={(e) => {
            console.log("changed");
            if (e.target.files) {
              setImgSrc(`${URL.createObjectURL(e.target.files[0])}`);
              setFileName(e.target.files[0].name);
            }
          }}
        />

        {/* ====== SELECT IMAGE BUTTON ====== */}
        <button
          className={cn("mx-auto mt-4 block rounded-md bg-orange-700 p-2")}
          onClick={() => {
            file.current?.click();
          }}
        >
          Select image
        </button>

        {/* ====== INPUT FOR GROUP NAME ====== */}
        <input
          className={cn(
            "bg-dark-bkg mx-auto mt-4 block rounded-md p-4 text-center outline-none",
          )}
          type="text"
          id="group-name"
          placeholder="Enter group name"
          ref={groupName}
        />

        {/* ====== CREATE GROUP BUTTON ====== */}
        <button
          className={cn(
            "mx-auto mt-[20vh] block w-70 rounded-md bg-orange-700 p-2",
          )}
          onClick={() => {
            if (groupName.current?.value != "") {
              console.log("clicked create!");
              file.current?.files?.length != 0 ? readFile() : emitRequest();
            } else {
              showMessage({
                text: "Please enter a name for your group!",
                status: "normal",
              });
            }
          }}
        >
          Create
        </button>
      </div>
    </section>
  );
};
