import { format, isValid } from "date-fns";

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isValid(date)) return dateStr;
  return format(date, "MMM d, yyyy 'at' hh:mm a");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isValid(date)) return dateStr;
  return format(date, "EEEE, MMMM do, yyyy");
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isValid(date)) return dateStr;
  return format(date, "hh:mm a");
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isValid(date)) return dateStr;
  return format(date, "MMM d, hh:mm a");
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isValid(date)) return dateStr;
  return format(date, "MMMM yyyy");
}
