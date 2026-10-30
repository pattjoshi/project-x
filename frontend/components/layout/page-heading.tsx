import { Reveal } from "@/components/cinematic/reveal";

export function PageHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <Reveal className="mb-8">
      {eyebrow && <p className="text-eyebrow text-muted-foreground">{eyebrow}</p>}
      <h1 className="text-display-2 mt-2">{title}</h1>
    </Reveal>
  );
}
