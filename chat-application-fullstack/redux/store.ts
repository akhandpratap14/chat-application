import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import suggestionReducer from "./suggestionSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    suggestions: suggestionReducer,
  },
});

// Types for components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
