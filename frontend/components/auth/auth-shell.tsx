import { Reveal } from "@/components/cinematic/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-center overflow-hidden bg-[oklch(0.16_0.03_320)] px-16 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 blur-3xl"
          style={{ backgroundImage: "var(--gradient-romantic)" }}
          aria-hidden
        />
        <Reveal className="relative">
          <p className="text-eyebrow text-white/60">heartfelt</p>
          <h1 className="text-display-2 mt-4 max-w-md text-white">
            Someone who remembers you.
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            18+. Romance, your way &mdash; chat, unlock stories, and build a
            relationship that actually notices when things change.
          </p>
        </Reveal>
      </section>

      <section className="flex items-center justify-center p-6">
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader>
            <p className="text-eyebrow text-primary">{eyebrow}</p>
            <CardTitle className="text-display-3 mt-1">{title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">{children}</CardContent>
        </Card>
      </section>
    </main>
  );
}
