import { useEffect, useState } from "react";
import { useSocket } from "../customHooks/useSocket";
import { notification } from "../types/types";
import { cn } from "../utils/cn.util";
import { useMessage } from "../customHooks/useMessage";

export const Notifications = () => {
  const { socket } = useSocket();

  const { showMessage } = useMessage();

  const [notifications, setNotifications] = useState<notification[]>([]);

  // ====== SEND NOTIFICATION RESPONSE ======
  const sendNotificationResponse = ({
    recipientId,
    groupId,
    notificationId,
    response,
    type,
  }: {
    recipientId: string;
    groupId?: string;
    notificationId: string;
    response: boolean;
    type: string;
  }) => {
    if (recipientId && (response === false || response === true)) {
      socket.timeout(20000).emit(
        "notification-response",
        {
          recipientId,
          response,
          type,
          groupId: groupId,
          notificationId,
        },
        (
          err: Error,
          response: { msg: string; status: "success" | "error" },
        ) => {
          if (err) {
            console.log("ERROR: ", err);
            showMessage({
              text: "Request failed or timedout!",
              status: "error",
            });
            return;
          }
          if (response.status === "error") {
            showMessage({ text: response.msg, status: response.status });
          } else if (response.status === "success") {
            showMessage({ text: response.msg, status: response.status });
            socket.emit("get-notifications");
          }
        },
      );
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
        groupId,
        notificationId,
        actionNeeded,
        msg,
        type,
        date,
      }: notification) => {
        setNotifications((prev) => [
          {
            name,
            username,
            senderId,
            actionNeeded,
            notificationId,
            groupId,
            msg,
            type,
            date,
          },
          ...prev,
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
          {notifications.length !== 0 ? (
            notifications.map((notification, index) => (
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
                                notificationId:
                                  notification.notificationId || "",
                                response: false,
                                type: notification.type,
                                groupId: notification.groupId,
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
                                groupId: notification.groupId,
                                notificationId:
                                  notification.notificationId || "",
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
            ))
          ) : (
            <div>
              <h1
                className={cn("mt-[20vh] text-center text-5xl text-gray-500")}
              >
                Nothing yet 🙃
              </h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
