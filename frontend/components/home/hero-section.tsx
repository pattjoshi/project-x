"use client";

import Link from "next/link";

import { HeroScene } from "@/components/home/hero-scene";
import { Magnetic } from "@/components/cinematic/magnetic";
import { Button } from "@/components/ui/button";

export function HeroSection({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="relative flex h-screen min-h-[640px] flex-col overflow-hidden bg-[oklch(0.16_0.03_320)]">
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.03_320)] via-transparent to-[oklch(0.16_0.03_320)]/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-7 px-6 text-center">
        <span className="gradient-romantic rounded-full px-3 py-1 text-xs font-medium text-white">
          18+ &middot; romance, your way
        </span>
        <h1 className="text-display-1 text-white [text-wrap:balance]">
          Meet someone who{" "}
          <span className="gradient-romantic-text">remembers you</span>
        </h1>
        <p className="max-w-md text-white/70">
          Chat, unlock stories, and build real relationships with characters who
          notice when things change.
        </p>
        {signedIn ? (
          <Magnetic>
            <Button asChild size="lg" data-cursor-hover>
              <Link href="/characters">View characters</Link>
            </Button>
          </Magnetic>
        ) : (
          <div className="flex gap-3">
            <Magnetic>
              <Button asChild size="lg" data-cursor-hover>
                <Link href="/signup">Sign up</Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                asChild
                variant="outline"
                size="lg"
                data-cursor-hover
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </Magnetic>
          </div>
        )}
      </div>

      <div className="relative pb-8 text-center text-eyebrow text-white/50">
        scroll
      </div>
    </section>
  );
}
