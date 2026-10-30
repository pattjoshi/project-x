"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Gift, SendGiftResponse } from "@/types/gift";

const AFFINITY_LABEL: Record<SendGiftResponse["affinity"], string> = {
  loved: "loved it! 💕",
  liked: "liked it.",
  disliked: "wasn't a fan...",
};

export function GiftPicker({
  characterId,
  characterName,
  gifts,
}: {
  characterId: string;
  characterName: string;
  gifts: Gift[];
}) {
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [result, setResult] = useState<SendGiftResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendGift = async (giftId: string) => {
    setSendingId(giftId);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/gifts/${characterId}/${giftId}`, { method: "POST" });
      const data: SendGiftResponse = await res.json();
      if (!res.ok) {
        setError("Something went wrong. Try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gifts.map((gift) => (
          <Card key={gift.id} className="py-4">
            <CardContent className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">{gift.emoji}</span>
              <p className="font-medium">{gift.name}</p>
              <p className="text-xs text-muted-foreground">{gift.description}</p>
              <Button
                size="sm"
                disabled={sendingId !== null}
                onClick={() => sendGift(gift.id)}
                className="mt-1 w-full"
              >
                {sendingId === gift.id ? "Sending..." : "Send"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {result && (
        <p className="text-sm">
          {characterName} {AFFINITY_LABEL[result.affinity]}
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
