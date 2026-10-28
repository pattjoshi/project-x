import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-semibold">AI Dating Simulator</h1>
      <p className="max-w-md text-muted-foreground">
        Meet characters, build relationships, and unlock stories.
      </p>
      {session ? (
        <Button asChild>
          <Link href="/characters">View characters</Link>
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
