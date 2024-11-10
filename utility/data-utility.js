// NOTE: Maintain this wrapper file for wrapping all the date and time relared transformations.

import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

const convertDateFormat = (unixEpoch, formatInString) => {
  // formatInString -> yyyy-MM-dd hh:mm -> refer date-fns docs

  const formattedDate = format(new Date(unixEpoch), formatInString);

  return formattedDate;
};

const humanizeSeconds = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hrs > 0 ? `${hrs} hour${hrs !== 1 ? "s" : ""}` : null,
    mins > 0 ? `${mins} minute${mins !== 1 ? "s" : ""}` : null,
    secs > 0 ? `${secs} second${secs !== 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean) // Remove null values
    .join(", ");
};

function humanizeUnixTimestamp(unixEpoch) {
  // Convert Unix timestamp (seconds) to JavaScript Date object
  const date = new Date(unixEpoch); // Multiply by 1000 to convert seconds to milliseconds
  return formatDistanceToNow(date, { addSuffix: true });
};

export { convertDateFormat, humanizeSeconds, humanizeUnixTimestamp };
