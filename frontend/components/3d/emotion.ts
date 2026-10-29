// Our app's emotion set (see backend/app/chains/chat_chain.py) mapped to
// VRM 1.0 standard expression presets (https://vrm.dev) and to a simple
// placeholder look (color tint + emoji badge) for characters that don't
// have a VRM model yet.

export const EMOTION_TO_VRM_PRESET: Record<string, string> = {
  happy: "happy",
  flirty: "relaxed",
  neutral: "neutral",
  sad: "sad",
  surprised: "surprised",
  annoyed: "angry",
};

export const EMOTION_TO_EMOJI: Record<string, string> = {
  happy: "😊",
  flirty: "😉",
  neutral: "🙂",
  sad: "😔",
  surprised: "😮",
  annoyed: "😒",
};

export const EMOTION_TO_COLOR: Record<string, string> = {
  happy: "#f6c667",
  flirty: "#f08aae",
  neutral: "#c9b8a3",
  sad: "#8fa8c9",
  surprised: "#f3e37c",
  annoyed: "#c97b7b",
};

export function emojiForEmotion(emotion: string): string {
  return EMOTION_TO_EMOJI[emotion] ?? EMOTION_TO_EMOJI.neutral;
}

export function colorForEmotion(emotion: string): string {
  return EMOTION_TO_COLOR[emotion] ?? EMOTION_TO_COLOR.neutral;
}

export function vrmPresetForEmotion(emotion: string): string {
  return EMOTION_TO_VRM_PRESET[emotion] ?? EMOTION_TO_VRM_PRESET.neutral;
}
