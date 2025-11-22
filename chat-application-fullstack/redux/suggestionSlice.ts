import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Suggestion {
  id: string;
  label: string;
}

interface SuggestionState {
  list: Suggestion[];
  isOpen: boolean;
}

const initialState: SuggestionState = {
  list: [],
  isOpen: false,
};

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    setSuggestions: (state, action: PayloadAction<Suggestion[]>) => {
      state.list = action.payload;
    },
    openSuggestions: (state) => {
      state.isOpen = true;
    },
    closeSuggestions: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  setSuggestions,
  openSuggestions,
  closeSuggestions,
} = suggestionSlice.actions;
export default suggestionSlice.reducer;
