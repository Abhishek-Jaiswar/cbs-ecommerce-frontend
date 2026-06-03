"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

import { AppStore, makeStore } from "./store";

interface Props {
  children: ReactNode;
}

export function StoreProvider({ children }: Props) {
  const [store] = useState<AppStore>(makeStore);

  useEffect(() => {
    const unsubscribe = setupListeners(store.dispatch);

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
