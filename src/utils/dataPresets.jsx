// src/pages/Reports/utils/datePresets.js
import { startOfToday, endOfToday, subDays, format } from "date-fns";

export const DATE_PRESETS = {
  Today: {
    label: "Today",
    range: () => ({ startDate: startOfToday(), endDate: endOfToday() }),
  },
  "Last 7 Days": {
    label: "Last 7 Days",
    range: () => ({ startDate: subDays(new Date(), 6), endDate: endOfToday() }),
  },
  "Last 30 Days": {
    label: "Last 30 Days",
    range: () => ({ startDate: subDays(new Date(), 29), endDate: endOfToday() }),
  },
};

/**
 * Helper: converts Date -> YYYY-MM-DD (string)
 * Backend controllers in your project expect this format.
 */
export const toYYYYMMDD = (d) => {
  if (!d) return "";
  return format(d, "yyyy-MM-dd");
};
