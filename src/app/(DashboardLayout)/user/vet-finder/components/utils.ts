/*  helpers  */
export const formatEmirateName = (e: string) =>
  e
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
