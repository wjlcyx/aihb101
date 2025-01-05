import { Chat } from "./chat";
import { Message } from "./message";

export interface ContextProviderValue {
  [propName: string]: any;
}

export interface ContextProviderProps {
  children: ReactNode;
}