import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";
import { baseApi } from "@/services/api/base-api";

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
