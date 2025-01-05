import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Message } from '../types/message';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

