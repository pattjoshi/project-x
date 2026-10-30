import Link from "next/link";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { auth } from "@/lib/auth";

const NAV_LINK_CLASS =
  "group relative px-1 py-1.5 text-[11px] font-medium tracking-[0.08em] text-nowrap uppercase text-muted-foreground transition-colors hover:text-foreground sm:text-xs sm:tracking-[0.15em]";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={NAV_LINK_CLASS} data-cursor-hover>
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="glass-panel sticky top-0 z-20 border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:gap-6 sm:px-6">
        <Link
          href="/characters"
          className="font-[family-name:var(--font-display)] text-xl tracking-tight sm:text-2xl"
          data-cursor-hover
        >
          <span className="gradient-romantic-text">heartfelt</span>
        </Link>

        <nav className="flex items-center gap-2.5 sm:gap-7">
          <NavLink href="/characters">Characters</NavLink>
          <NavLink href="/daily">Daily Quests</NavLink>
          {session?.user?.isAdmin && <NavLink href="/admin">Admin</NavLink>}
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
