import Link from "next/link";

import { Magnetic } from "@/components/cinematic/magnetic";
import { Reveal } from "@/components/cinematic/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="relative overflow-hidden px-6 py-36 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 blur-3xl"
        style={{ backgroundImage: "var(--gradient-romantic)" }}
        aria-hidden
      />
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <h2 className="text-display-2">
          Someone is waiting for{" "}
          <span className="gradient-romantic-text">you to say hi</span>
        </h2>
        <p className="max-w-md text-muted-foreground">
          18+. Romance, your way - chat, unlock stories, and build something that
          actually notices when things change.
        </p>
        <Magnetic>
          <Button asChild size="lg" data-cursor-hover>
            <Link href={signedIn ? "/characters" : "/signup"}>
              {signedIn ? "View characters" : "Start your story"}
            </Link>
          </Button>
        </Magnetic>
      </Reveal>
    </section>
  );
}
