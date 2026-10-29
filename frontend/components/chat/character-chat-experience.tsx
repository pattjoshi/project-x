"use client";

import { useState } from "react";

import { CafeScene } from "@/components/3d/cafe-scene";
import { ChatPanel } from "@/components/chat/chat-panel";
import type { RelationshipPublic } from "@/types/chat";

export function CharacterChatExperience({
  characterId,
  characterName,
  vrmUrl,
  initialRelationship,
}: {
  characterId: string;
  characterName: string;
  vrmUrl: string | null;
  initialRelationship: RelationshipPublic;
}) {
  const [emotion, setEmotion] = useState("neutral");

  return (
    <div className="flex flex-col gap-4">
      <CafeScene vrmUrl={vrmUrl} emotion={emotion} />
      <ChatPanel
        characterId={characterId}
        characterName={characterName}
        initialRelationship={initialRelationship}
        onEmotionChange={setEmotion}
      />
    </div>
  );
}
