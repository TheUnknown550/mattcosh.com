import { About } from "@/components/home/About";
import { Highlights } from "@/components/home/Highlights";
import { Testimonial } from "@/components/home/Testimonial";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { Reveal } from "@/components/common/Reveal";
import { CinematicSection } from "@/components/home/graph/CinematicSection";

export default function Home() {
  return (
    <>
      <CinematicSection sectionKey="about" mode="core">
        <About />
      </CinematicSection>
      <CinematicSection sectionKey="highlights">
        <Reveal className="w-full">
          <Highlights />
        </Reveal>
      </CinematicSection>
      <CinematicSection sectionKey="testimonial" revealScale={false}>
        <Reveal className="w-full">
          <Testimonial />
        </Reveal>
      </CinematicSection>
      <CinematicSection sectionKey="selected-work">
        <Reveal>
          <FeaturedWork />
        </Reveal>
      </CinematicSection>
      <CinematicSection sectionKey="closing">
        <Reveal>
          <ClosingCTA />
        </Reveal>
      </CinematicSection>
    </>
  );
}
