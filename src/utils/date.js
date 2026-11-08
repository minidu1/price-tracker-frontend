import { parseISO, format, isToday, isYesterday, isValid } from "date-fns";

export function formatDate(dateString) {
   if (!dateString) return "No price data yet";
  const date = parseISO(dateString);

  if (!isValid(date)) return "No price data yet";

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "d MMM yyyy");
}