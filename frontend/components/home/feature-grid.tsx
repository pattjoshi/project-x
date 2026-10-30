import { Reveal } from "@/components/cinematic/reveal";

const FEATURES = [
  {
    title: "Conversations that remember",
    body: "Every chat is held by a real memory of you - what you said last week, how you take your chai, what made them laugh.",
  },
  {
    title: "Stories you steer",
    body: "Branching chapters react to the relationship you've actually built, not a script that plays the same for everyone.",
  },
  {
    title: "Dates, gifts, a world that reacts",
    body: "Send a gift, pick a place to meet, watch affection and trust move in real time - cafe, park, rooftop, your call.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <Reveal>
        <p className="text-eyebrow text-muted-foreground">What&apos;s different</p>
        <h2 className="text-display-2 mt-3 max-w-xl">Not a chatbot. A relationship.</h2>
      </Reveal>

      <div className="mt-16 grid gap-10 sm:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.1}>
            <span className="text-eyebrow text-primary">0{i + 1}</span>
            <h3 className="text-display-3 mt-3">{feature.title}</h3>
            <p className="mt-3 text-muted-foreground">{feature.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
