import type { Certification } from "@/types/certification";

interface CertificationListProps {
  certifications: Certification[];
}

export function CertificationList({ certifications }: CertificationListProps) {
  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
      {certifications.map((cert) => (
        <li
          key={cert.id}
          className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            {cert.url ? (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink transition-colors hover:text-signal"
              >
                {cert.name} ↗
              </a>
            ) : (
              <p className="text-sm font-medium text-ink">{cert.name}</p>
            )}
            <p className="mt-1 text-xs text-ink-muted">{cert.authority}</p>
          </div>
          <p className="shrink-0 font-mono text-xs uppercase tracking-wide text-ink-muted">
            {cert.issuedLabel}
          </p>
        </li>
      ))}
    </ul>
  );
}
