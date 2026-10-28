"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ChapterNodeResponse } from "@/types/chapter";

export function ChapterReader({
  characterId,
  chapterId,
  initialNode,
}: {
  characterId: string;
  chapterId: string;
  initialNode: ChapterNodeResponse;
}) {
  const [node, setNode] = useState(initialNode);
  const [stageNotice, setStageNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const choose = async (choiceIndex: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chapters/${characterId}/${chapterId}/choose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice_index: choiceIndex }),
      });
      const data: ChapterNodeResponse = await res.json();
      if (!res.ok) return;

      setNode(data);
      if (data.stage_changed) {
        setStageNotice(`Your relationship just changed to ${data.relationship.stage}!`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {stageNotice && (
        <p className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium">
          {stageNotice}
        </p>
      )}

      <Card>
        <CardContent className="flex flex-col gap-4 pt-2">
          <p className="leading-relaxed">{node.text}</p>

          {node.ending ? (
            <p className="text-sm font-medium text-muted-foreground">— The End —</p>
          ) : (
            <div className="flex flex-col gap-2">
              {node.choices.map((choice, index) => (
                <Button
                  key={choice}
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => choose(index)}
                  className="justify-start text-left whitespace-normal"
                >
                  {choice}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
