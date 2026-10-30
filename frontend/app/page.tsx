import { CtaSection } from "@/components/home/cta-section";
import { FeatureGrid } from "@/components/home/feature-grid";
import { HeroSection } from "@/components/home/hero-section";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      <HeroSection signedIn={!!session} />
      <FeatureGrid />
      <CtaSection signedIn={!!session} />
    </main>
  );
}
