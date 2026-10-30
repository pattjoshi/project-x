"use client";

import { cn } from "@/lib/utils";
import { DATE_LOCATIONS, type DateLocation } from "@/types/location";

export function LocationSwitcher({
  location,
  onLocationChange,
}: {
  location: DateLocation;
  onLocationChange: (location: DateLocation) => void;
}) {
  return (
    <div className="flex gap-2">
      {DATE_LOCATIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onLocationChange(option.id)}
          aria-pressed={location === option.id}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            location === option.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="mr-1">{option.emoji}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
