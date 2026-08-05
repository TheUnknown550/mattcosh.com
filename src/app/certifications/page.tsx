import Link from "next/link";
import { certifications } from "@/data/certifications";
import { CertificationList } from "@/components/certifications/CertificationList";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function CertificationsPage() {
  return (
    <div className="mx-auto max-w-3xl py-8 lg:py-12">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Certifications
        </h1>
      </Reveal>

      <PulseDivider />

      <Reveal className="mt-6">
        <CertificationList certifications={certifications} />
      </Reveal>

      <p className="mt-16 font-mono text-xs uppercase tracking-wide text-ink-muted">
        <Link href="/skills" className="transition-colors hover:text-ink">
          View skills →
        </Link>
      </p>
    </div>
  );
}
