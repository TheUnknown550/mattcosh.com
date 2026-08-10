import { GraphJourney } from "@/components/home/GraphJourney";
import { About } from "@/components/home/About";
import { Highlights } from "@/components/home/Highlights";
import { Testimonial } from "@/components/home/Testimonial";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";
import { CinematicSection } from "@/components/home/graph/CinematicSection";
import { GraphScrollFocusProvider } from "@/components/home/graph/useGraphScrollFocus";

export default function Home() {
  return (
    <GraphScrollFocusProvider>
      <GraphJourney />
      <PulseDivider />
      <CinematicSection sectionKey="about" mode="core">
        <About />
      </CinematicSection>
      <PulseDivider />
      <CinematicSection sectionKey="highlights">
        <Reveal>
          <Highlights />
        </Reveal>
      </CinematicSection>
      <PulseDivider />
      <CinematicSection sectionKey="testimonial">
        <Reveal>
          <Testimonial />
        </Reveal>
      </CinematicSection>
      <PulseDivider />
      <CinematicSection sectionKey="selected-work">
        <Reveal>
          <FeaturedWork />
        </Reveal>
      </CinematicSection>
      <PulseDivider />
      <CinematicSection sectionKey="closing">
        <Reveal>
          <ClosingCTA />
        </Reveal>
      </CinematicSection>
    </GraphScrollFocusProvider>
  );
}
