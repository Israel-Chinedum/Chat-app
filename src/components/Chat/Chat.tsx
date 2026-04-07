import { ChatSpace } from "./ChatSpace";
import { Spaces } from "./Spaces";
import { chatListObj } from "../../types/types";
import { cn } from "../../lib/utils";

export const Chat = () => {
  return (
    <div className={cn("mx-auto mt-[10vh] flex max-w-max")}>
      <Spaces />
      <ChatSpace />
    </div>
  );
};
