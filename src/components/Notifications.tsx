import { useContext, useEffect, useState } from "react";
import "../components_css/notifications.css";
import { socketContext } from "./MyContext";
import { notification } from "../types/types";
import { cn } from "../lib/utils";

export const Notifications = () => {
  const socket = useContext(socketContext);

  const [notifications, setNotifications] = useState<notification[]>([]);

  // ====== SEND FRIEND REQUEST RESPONSE ======
  const sendNotificationResponse = ({
    recipientId,
    tag_id,
    response,
    type,
  }: {
    recipientId: string;
    tag_id?: string;
    response: boolean;
    type: string;
  }) => {
    if (recipientId && (response === false || response === true)) {
      socket.emit("notification-response", {
        recipientId,
        response,
        type,
        tag_id: tag_id,
      });
    }
  };

  useEffect(() => {
    socket.emit("get-notifications");

    socket.on("all-notifications", (notifications: notification[]) => {
      setNotifications(notifications);
    });

    // ====== LISTEN FOR FRIEND REQUEST NOTIFICATION ======
    socket.on(
      "notification",
      ({
        name,
        username,
        senderId,
        tag_id,
        actionNeeded,
        msg,
        type,
        date,
      }: notification) => {
        setNotifications((prev) => [
          ...prev,
          {
            name,
            username,
            senderId,
            actionNeeded,
            tag_id,
            msg,
            type,
            date,
          },
        ]);
      },
    );

    return () => {
      socket.off("all-notifications");
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <>
      <div
        className={cn(
          "mx-auto h-[87vh] w-2xl overflow-y-scroll",
          "scroll-bar px-2 pt-1",
        )}
      >
        {/* ====== NOTIFICATIOINS CONTAINER (Contain's all notifications) ====== */}
        <div>
          {notifications.map((notification, index) => (
            // ====== NOTIFICATIOIN CONTAINER (Contain's a notification) ======
            <div
              key={index}
              className={cn("my-3 border border-gray-700 p-4", "rounded-lg")}
            >
              {/* ====== DATE ====== */}
              <p className="text-[14px] text-orange-700">
                {notification.date.toString()}
              </p>

              {/* ====== HEADER ====== */}
              <h1 className="font-bold">{notification.name}</h1>

              {/* ====== MESSAGE ====== */}
              <p className="mt-4">{notification.msg}</p>

              {/* ====== BUTTONS ====== */}
              <div className={cn("mt-4 flex items-end justify-between")}>
                <button className="rounded-sm bg-gray-800 p-2">
                  Read more
                </button>
                {notification.actionNeeded &&
                  (() => (
                    <div className="flex items-center gap-2">
                      {/* ====== DECLINE BUTTON ====== */}
                      <button
                        className="bg-dark-bkg w-20 rounded-sm p-2"
                        onClick={() => {
                          if (notification.senderId) {
                            sendNotificationResponse({
                              recipientId: notification.senderId,
                              response: false,
                              type: notification.type,
                              tag_id: notification.tag_id,
                            });
                          }
                        }}
                      >
                        Decline
                      </button>
                      {/* ====== ACCEPT BUTTON ====== */}
                      <button
                        className="w-20 rounded-sm bg-orange-700 p-2 text-gray-300"
                        onClick={() => {
                          if (notification.senderId) {
                            sendNotificationResponse({
                              recipientId: notification.senderId,
                              response: true,
                              type: notification.type,
                              tag_id: notification.tag_id,
                            });
                          }
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  ))()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
