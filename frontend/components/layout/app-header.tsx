import Link from "next/link";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { auth } from "@/lib/auth";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="glass-panel sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/characters" className="text-lg font-semibold tracking-tight">
          <span className="gradient-romantic-text">heartfelt</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/characters"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Characters
          </Link>
          <Link
            href="/daily"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Daily Quests
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user?.name && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.name}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
