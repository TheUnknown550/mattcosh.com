import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Highlights } from "@/components/home/Highlights";
import { Testimonial } from "@/components/home/Testimonial";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
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
    </>
  );
}
