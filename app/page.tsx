import CoreValues from "@/components/core-values";
import CoreBeliefs from "@/components/core-beliefs";
import Hero from "@/components/hero";
import Rundown from "@/components/rundown";
import Location from "@/components/location";
import GetInTouch from "@/components/get-in-touch";
import Faq from "@/components/faq";

export default function Home() {
  return (
    <div>
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
