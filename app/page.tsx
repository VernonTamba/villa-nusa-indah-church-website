import dynamic from "next/dynamic";

import Hero from "@/components/hero";

// ── Section skeleton: a simple animated pulse placeholder ─────────────────────
// Keeps the layout from jumping while the chunk loads.
function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div
      className={`w-full ${height} animate-pulse rounded-2xl bg-foreground/5`}
      aria-hidden="true"
    />
  );
}

// ── Lazy-loaded below-the-fold sections ───────────────────────────────────────
// Only the hero is eagerly imported — everything else is split into its own
// chunk so the first screen renders as fast as possible.
const CoreValues = dynamic(() => import("@/components/core-values"), {
  loading: () => <SectionSkeleton height="h-80" />,
});
const CoreBeliefs = dynamic(() => import("@/components/core-beliefs"), {
  loading: () => <SectionSkeleton height="h-96" />,
});
const Rundown = dynamic(() => import("@/components/rundown"), {
  loading: () => <SectionSkeleton height="h-[600px]" />,
});
const Location = dynamic(() => import("@/components/location"), {
  loading: () => <SectionSkeleton height="h-72" />,
});
const GetInTouch = dynamic(() => import("@/components/get-in-touch"), {
  loading: () => <SectionSkeleton height="h-64" />,
});
const Faq = dynamic(() => import("@/components/faq"), {
  loading: () => <SectionSkeleton height="h-48" />,
});

export default function Home() {
  return (
    <div>
      {/* Hero is eagerly loaded — it IS the first screen */}
      <Hero />
      <CoreValues />
      <CoreBeliefs />
      <Rundown />
      <Location />
      <GetInTouch />
      <Faq />
    </div>
  );
}
