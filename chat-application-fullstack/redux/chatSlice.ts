import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Token {
  type: "text" | "tag";
  value?: string;
  label?: string;
  id?: string;
  trigger?: string;
}


interface Message {
  id: string;
  roomId: string;
  senderId: string;
  tokens: Token[];
  createdAt: string;
}

interface ChatState {
  tokens: Token[];
  messagesByRoom: Record<string, Message[]>;
}

const initialState: ChatState = {
  tokens: [{ type: "text", value: "" }],
  messagesByRoom: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<Token[]>) {
      state.tokens = action.payload;
    },
    setRoomMessages(
      state,
      action: PayloadAction<{ roomId: string; messages: Message[] }>
    ) {
      state.messagesByRoom[action.payload.roomId] = action.payload.messages;
    },

    addRoomMessage(state, action: PayloadAction<Message>) {
      const msg = action.payload;

      if (!state.messagesByRoom[msg.roomId]) {
        state.messagesByRoom[msg.roomId] = [];
      }

      const exists = state.messagesByRoom[msg.roomId].some(
        (m) => m.id === msg.id
      );
      if (!exists) {
        state.messagesByRoom[msg.roomId].push(msg);
      }
    },
  },
});

export const { setTokens, setRoomMessages, addRoomMessage } = chatSlice.actions;
export default chatSlice.reducer;
