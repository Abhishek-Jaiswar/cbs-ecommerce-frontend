import { baseApi } from "@/services/api/base-api";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});
