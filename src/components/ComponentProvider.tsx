import { Home } from "./Home";
import { CurrentChatProvider } from "../context/CurrentChatContext";
import { CurrentTabProvider } from "../context/CurrentTabContext";
import { SocketProvider } from "../context/SocketContext";

import "../components_css/home.css";

export const ComponentProvider = () => {
  return (
    <SocketProvider>
      <CurrentChatProvider>
        <CurrentTabProvider>
          <Home />
        </CurrentTabProvider>
      </CurrentChatProvider>
    </SocketProvider>
  );
};
