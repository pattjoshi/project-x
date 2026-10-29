"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RelationshipMeters } from "@/components/chat/relationship-meters";
import type { ChatMessage, ChatResponse, RelationshipPublic } from "@/types/chat";

export function ChatPanel({
  characterId,
  characterName,
  initialRelationship,
  onEmotionChange,
}: {
  characterId: string;
  characterName: string;
  initialRelationship: RelationshipPublic;
  onEmotionChange?: (emotion: string) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [relationship, setRelationship] = useState(initialRelationship);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stageChangeNotice, setStageChangeNotice] = useState<string | null>(null);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    setInput("");
    setError(null);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content },
    ]);
    setIsSending(true);

    try {
      const res = await fetch(`/api/chat/${characterId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data: ChatResponse = await res.json();

      if (!res.ok) {
        setError("Something went wrong. Try again.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.message_id,
          role: "assistant",
          content: data.reply,
          emotion: data.emotion,
        },
      ]);
      setRelationship(data.relationship);
      onEmotionChange?.(data.emotion);
      if (data.stage_changed) {
        setStageChangeNotice(`You're now ${data.relationship.stage} with ${characterName}!`);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <RelationshipMeters relationship={relationship} />

      {stageChangeNotice && (
        <p className="gradient-romantic rounded-lg px-3 py-2 text-center text-sm font-medium text-white">
          {stageChangeNotice}
        </p>
      )}

      <div className="flex min-h-80 flex-col gap-2.5 overflow-y-auto rounded-lg border bg-card p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Say hello to {characterName}.
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? "self-end text-right" : "self-start"
            }
          >
            <p
              className={
                message.role === "user"
                  ? "gradient-romantic inline-block rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white"
                  : "inline-block rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2 text-sm text-secondary-foreground"
              }
            >
              {message.content}
            </p>
          </div>
        ))}
        {isSending && (
          <div className="self-start">
            <p className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2.5">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage();
        }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message..."
          disabled={isSending}
        />
        <Button type="submit" disabled={isSending || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
