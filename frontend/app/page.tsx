import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden p-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20 blur-3xl"
        style={{ backgroundImage: "var(--gradient-romantic)" }}
        aria-hidden
      />

      <span className="gradient-romantic rounded-full px-3 py-1 text-xs font-medium text-white">
        18+ · romance, your way
      </span>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Meet someone who{" "}
        <span className="gradient-romantic-text">remembers you</span>
      </h1>
      <p className="max-w-md text-muted-foreground">
        Chat, unlock stories, and build real relationships with characters who
        notice when things change.
      </p>
      {session ? (
        <Button asChild size="lg">
          <Link href="/characters">View characters</Link>
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
