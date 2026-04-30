import { configureStore } from "@reduxjs/toolkit";
import candidateDetailsReducer from "./slices/candidatesSlice";

export const store = configureStore({
  reducer: {
    candidateForm: candidateDetailsReducer,
  },
});
