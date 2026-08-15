import { certifications } from "@/data/certifications";
import { CertificationNetwork } from "@/components/certifications/CertificationNetwork";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function CertificationsPage() {
  return (
    <div className="certifications-page mx-auto w-full py-8 lg:py-12">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Certifications
        </h1>
      </Reveal>

      <PulseDivider />

      <Reveal className="mt-6">
        <CertificationNetwork certifications={certifications} />
      </Reveal>
    </div>
  );
}
