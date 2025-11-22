import { RootState } from "./store";

export const selectMessagesForRoom = (roomId: string) =>
  (state: RootState) => state.chat.messagesByRoom[roomId] || [];
