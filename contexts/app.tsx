"use client";

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useContext, useState } from "react";

const AppContext = createContext({} as ContextProviderValue);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [showSidePanel, setShowSidePanel] = useState(false);

  return (
    <AppContext.Provider value={{ showSidePanel, setShowSidePanel }}>
      {children}
    </AppContext.Provider>
  );
};