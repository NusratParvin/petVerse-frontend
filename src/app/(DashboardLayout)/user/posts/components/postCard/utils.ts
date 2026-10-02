import { formatDistanceToNow } from "date-fns";

export const timeAgo = (date: string) =>
  `${formatDistanceToNow(new Date(date), { includeSeconds: true })} ago`;

export const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");
