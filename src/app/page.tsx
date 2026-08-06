import { GraphJourney } from "@/components/home/GraphJourney";
import { About } from "@/components/home/About";
import { Highlights } from "@/components/home/Highlights";
import { Testimonial } from "@/components/home/Testimonial";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function Home() {
  return (
    <>
      <GraphJourney />
      <PulseDivider />
      <Reveal>
        <About />
      </Reveal>
      <PulseDivider />
      <Reveal>
        <Highlights />
      </Reveal>
      <PulseDivider />
      <Reveal>
        <Testimonial />
      </Reveal>
      <PulseDivider />
      <Reveal>
        <FeaturedWork />
      </Reveal>
      <PulseDivider />
      <Reveal>
        <ClosingCTA />
      </Reveal>
    </>
  );
}
