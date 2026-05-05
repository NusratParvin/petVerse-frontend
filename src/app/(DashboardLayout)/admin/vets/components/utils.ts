export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export function formatEmirate(emirate: string) {
  const emirateMap: Record<string, string> = {
    dubai: "Dubai",
    "abu-dhabi": "Abu Dhabi",
    sharjah: "Sharjah",
    ajman: "Ajman",
    "ras-al-khaimah": "Ras Al Khaimah",
    fujairah: "Fujairah",
    "umm-al-quwain": "Umm Al Quwain",
  };
  return emirateMap[emirate] || capitalize(emirate);
}

export function formatPriceRange(priceRange: {
  basePrice: number;
  maxPrice: number;
}) {
  if (!priceRange) return "N/A";
  const { basePrice, maxPrice } = priceRange;
  if (basePrice === maxPrice) {
    return `$${basePrice}`;
  }
  return `$${basePrice} - $${maxPrice}`;
}

export function getEmirateColor(emirate: string) {
  const colorMap: Record<string, string> = {
    dubai: "primary",
    "abu-dhabi": "success",
    sharjah: "warning",
    ajman: "secondary",
    "ras-al-khaimah": "danger",
    fujairah: "default",
    "umm-al-quwain": "default",
  };
  return colorMap[emirate] || "default";
}
