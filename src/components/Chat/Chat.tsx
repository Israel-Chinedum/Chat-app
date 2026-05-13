import { ChatSpace } from "./ChatSpace";
import { ChatSelector } from "./ChatSelector";
import { chatListObj } from "../../types/types";
import { cn } from "../../utils/cn.util";

export const Chat = () => {
  return (
    <div className={cn("mx-auto mt-[10vh] flex max-w-max")}>
      <ChatSelector />
      <ChatSpace />
    </div>
  );
};
