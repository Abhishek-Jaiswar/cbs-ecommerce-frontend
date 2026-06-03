import { baseApi } from "@/services/api/base-api";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});
