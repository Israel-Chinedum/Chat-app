// ====== CURRENT CHAT OBJECT TYPE ======
export type currChatObj = {
  username: string;
  id: string;
};

// ====== CHAT LIST OBJECT TYPE ======
export type chatListObj = {
  chat_name: string;
  img?: string;
} & (
  | { chat_id: string; groupId?: never }
  | { groupId: string; chat_id?: never }
);

// ====== NOTIFICATION TYPE ======
export type notification = {
  name: string;
  msg: string;
  senderId?: string;
  tag_id?: string;
  username?: string;
  type: string;
  actionNeeded?: boolean;
  date: Date;
};
