export const REACTIONS = [
  { key: "like", emoji: "🐾", label: "Paw" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "haha", emoji: "😂", label: "Zoomies" },
  { key: "wow", emoji: "😮", label: "Woow" },
  { key: "sad", emoji: "😢", label: "Aww" },
  { key: "angry", emoji: "😠", label: "Grr" },
] as const;

export const MILESTONE_LABELS: Record<string, string> = {
  adoption: "🏠 Adoption",
  birthday: "🎂 Birthday",
  "vet-visit": "🩺 Vet visit",
  health: "💊 Health",
  other: "✨ Milestone",
};

export const MILESTONE_EMOJI: Record<string, string> = {
  adoption: "🏠",
  birthday: "🎂",
  "vet-visit": "🩺",
  health: "💊",
  other: "✨",
};
