// ====== CURRENT CHAT OBJECT TYPE ======
export type currChatObj = {
  username: string;
  id: string | undefined;
  type: "private" | "group";
};

// ====== CHAT LIST OBJECT TYPE ======
export type chatListObj = {
  chat_name: string;
  img?: string;
} & (
  | { chat_id: string; groupId?: never }
  | { groupId: string; chat_id?: never }
);

// ====== GROUP OBJECT TYPE ======
export type groupObjType = {
  groupName: string;
  groupId: string;
  member: boolean;
  hasImage: boolean;
};

// ====== NOTIFICATION TYPE ======
export type notification = {
  name: string;
  msg: string;
  senderId?: string;
  groupId?: string;
  notificationId?: string;
  username?: string;
  type: string;
  actionNeeded?: boolean;
  date: Date;
};

// ====== USER DETAILS ======
export type userProfile = {
  firstname?: string;
  lastname?: string;
  username: string;
  email: string;
  DOB?: string;
  age?: number;
};
