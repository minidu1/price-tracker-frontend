import { parseISO, format, isToday, isYesterday, isValid } from "date-fns";

export function formatDate(dateString) {
  const date = parseISO(dateString);

  if (!isValid(date)) return "N/A";

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "d MMM yyyy");
}