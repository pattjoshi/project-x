"use client";

import { useRef, useState } from "react";

export function SpeakButton({
  characterId,
  messageId,
}: {
  characterId: string;
  messageId: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = async () => {
    if (status === "loading") return;

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
      setStatus("playing");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`/api/chat/${characterId}/messages/${messageId}/speech`);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.onended = () => setStatus("idle");
      audioRef.current = audio;
      setStatus("playing");
      void audio.play();
    } catch {
      setStatus("error");
    }
  };

  return (
    <button
      type="button"
      onClick={play}
      disabled={status === "loading"}
      aria-label="Play message aloud"
      className="mt-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-60"
    >
      {status === "loading" && "Loading..."}
      {status === "playing" && "🔊 Playing..."}
      {status === "error" && "Couldn't play audio."}
      {status === "idle" && "🔊 Play"}
    </button>
  );
}
