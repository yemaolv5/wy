import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLunarDate(date: Date) {
  // Simplified mock for lunar date as real lunar calculation is complex
  // In a real app, we'd use a library like 'lunar-javascript'
  return "二月初十"; 
}

export function getWeekday(date: Date) {
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return weekdays[date.getDay()];
}
