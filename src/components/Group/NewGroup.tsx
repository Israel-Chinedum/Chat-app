import { MiniLoadAnimation } from "../Animation/LoadAnimation";
import { useState, useRef, useContext, useEffect } from "react";
import { display } from "../../customHooks/useMessage";
import { socketContext } from "../MyContext";

type imgObj = {
  name: string;
  type: string;
  buffer: ArrayBuffer;
};

export const NewGroup = ({
  setShowing,
  msg,
}: {
  setShowing: (showing: boolean) => void;
  msg: string;
}) => {
  const socket = useContext(socketContext);
  //   const { showing, setShowing } = display();

  const [isPending, setPending] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>("/group_image.png");
  const [fileName, setFileName] = useState<string>("No image selected");
  const [updateKey, setUpdateKey] = useState<number>(0);

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

  const emitRequest = (image?: imgObj) => {
    setPending(true);
    socket.emit("new-group", {
      groupName: groupName.current?.value,
      image: image || "no image",
    });
  };

  useEffect(() => {
    socket.on("new-group", () => {
      setPending(false);
      msg = "Group has been created!";
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
      msg = errMsg;
      setShowing(true);
      setTimeout(() => {
        setShowing(false);
      }, 3000);
    });

    return () => {
      socket.off("new-group");
      socket.off("error");
    };
  }, []);

  return (
    <section id="new-group">
      <MiniLoadAnimation loading={isPending} width={"100%"} height={"100%"} />
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
              file.current?.files?.length != 0 ? readFile() : emitRequest();
            } else {
              msg = "Please enter group name!";
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
  );
};
