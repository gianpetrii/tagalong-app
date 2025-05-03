import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeToDisplay(time: string): string {
  // Check if time is in HH:MM format
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    return time
  }

  // If time is just hours (e.g., "8:00"), add leading zero
  if (/^\d:\d{2}$/.test(time)) {
    return `0${time}`
  }

  return time
}
