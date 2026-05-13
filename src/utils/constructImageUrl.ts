export const constructImageUrl = ({
  chat_type,
  id,
}: {
  chat_type: string;
  id: string;
}) => {
  if (chat_type && id) {
    return `http://localhost:2400/media/${chat_type}/${id}`;
  }
};
