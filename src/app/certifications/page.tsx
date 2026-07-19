import Link from "next/link";
import { certifications } from "@/data/certifications";
import { CertificationList } from "@/components/certifications/CertificationList";
import { Reveal } from "@/components/common/Reveal";

export default function CertificationsPage() {
  const authorityCount = new Set(certifications.map((cert) => cert.authority)).size;

  return (
    <div className="mx-auto max-w-3xl py-16 lg:py-24">
      <Link
        href="/experience"
        className="font-mono text-xs uppercase tracking-wide text-ink-muted transition-colors hover:text-ink"
      >
        ← Experience
      </Link>

      <Reveal className="mt-8">
        <p className="font-mono text-xs uppercase tracking-wide text-signal">
          {certifications.length} certifications · {authorityCount} issuers
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">
          Certifications
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          From Google and freeCodeCamp specializations to an IEEEXtreme
          competition and international AI workshops.
        </p>
      </Reveal>

      <Reveal className="mt-12">
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
