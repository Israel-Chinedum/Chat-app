let userId: string;

export const initiateId = (id: string) => {
  userId = id;
};

export const getUserId = () => userId;
