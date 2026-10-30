export type DateLocation = "cafe" | "park" | "rooftop";

export interface DateLocationMeta {
  id: DateLocation;
  label: string;
  emoji: string;
}

export const DATE_LOCATIONS: DateLocationMeta[] = [
  { id: "cafe", label: "Cafe", emoji: "☕" },
  { id: "park", label: "Park", emoji: "🌳" },
  { id: "rooftop", label: "Rooftop", emoji: "🌆" },
];
