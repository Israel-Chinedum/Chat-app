import { Chat } from "./Chat/Chat";
import { Groups } from "./Group/Groups";
import { Notifications } from "./Notifications";
import "../components_css/home.css";
import { useCurrentTab } from "../customHooks/useCurrentTab";
import { NavBar } from "./NavBar";
import { Profile } from "./Profile";

export const Home = () => {
  const { currentTab } = useCurrentTab();

  return (
    <div className="text-gray-300">
      <NavBar />
      <div id="home-body">
        {currentTab == "chats" && <Chat />}
        {currentTab == "groups" && <Groups />}
        {currentTab == "notifications" && <Notifications />}
        {currentTab == "profile" && <Profile />}
      </div>
    </div>
  );
};
