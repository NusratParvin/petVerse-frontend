import { intervalToDuration } from "date-fns";

export const calcAge = (dob?: string | Date) => {
  if (!dob) return "";
  const duration = intervalToDuration({
    start: new Date(dob),
    end: new Date(),
  });

  const years = duration.years || 0;
  const months = duration.months || 0;

  if (years === 0) {
    return `${months} months`;
  }
  return `${years} yr${years > 1 ? "s" : ""} ${months > 0 ? `${months} mo` : ""}`;
};
