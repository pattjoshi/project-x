"use client";

import { useState } from "react";

import { DateScene } from "@/components/3d/date-scene";
import { ChatPanel } from "@/components/chat/chat-panel";
import { LocationSwitcher } from "@/components/chat/location-switcher";
import type { RelationshipPublic } from "@/types/chat";
import type { DateLocation } from "@/types/location";

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
  const [location, setLocation] = useState<DateLocation>("cafe");

  return (
    <div className="flex flex-col gap-4">
      <LocationSwitcher location={location} onLocationChange={setLocation} />
      <DateScene vrmUrl={vrmUrl} emotion={emotion} location={location} />
      <ChatPanel
        characterId={characterId}
        characterName={characterName}
        initialRelationship={initialRelationship}
        onEmotionChange={setEmotion}
      />
    </div>
  );
}
