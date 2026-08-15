"use client";

import Link from "next/link";
import type { Certification } from "@/types/certification";
import { CertificationCardNodeIcon } from "./CertificationCardNodeIcon";
import { CertificationGraphConnections } from "./CertificationGraphConnections";

type CardPosition = {
  slot: string;
  terminalClassName: string;
};

const CARD_POSITIONS: CardPosition[] = [
  { slot: "top-left", terminalClassName: "-right-5 top-1/2 -translate-y-1/2" },
  { slot: "top-right", terminalClassName: "-left-5 top-1/2 -translate-y-1/2" },
  { slot: "middle-left", terminalClassName: "-right-5 top-1/2 -translate-y-1/2" },
  { slot: "middle-right", terminalClassName: "-left-5 top-1/2 -translate-y-1/2" },
  { slot: "lower-left", terminalClassName: "-right-5 top-1/2 -translate-y-1/2" },
  { slot: "lower-right", terminalClassName: "-left-5 top-1/2 -translate-y-1/2" },
  { slot: "bottom-left", terminalClassName: "-right-5 top-1/2 -translate-y-1/2" },
  { slot: "bottom", terminalClassName: "-top-5 left-1/2 -translate-x-1/2" },
  { slot: "bottom-right", terminalClassName: "-left-5 top-1/2 -translate-y-1/2" },
];

interface CertificationNetworkProps {
  certifications: Certification[];
}

export function CertificationNetwork({ certifications }: CertificationNetworkProps) {
  return (
    <section className="certification-network" aria-label="Certification network">
      <CertificationGraphConnections />
      <ul className="certification-network-cards">
        {certifications.map((cert, index) => {
          const position = CARD_POSITIONS[index] ?? CARD_POSITIONS.at(-1)!;
          const title = (
            <>
              {cert.name}
              {cert.url ? " ↗" : ""}
            </>
          );

          return (
            <li
              key={cert.id}
              data-certification-card-node-id={`certification-${cert.id}`}
              className={`certification-network-card certification-network-card--${position.slot}`}
            >
              <CertificationCardNodeIcon
                className={`${position.terminalClassName} text-[#c792ea]`}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d9b4fb]">
                {cert.authority}
              </p>
              {cert.url ? (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block font-display text-base font-semibold leading-snug text-ink transition-colors hover:text-[#e6c8ff]"
                >
                  {title}
                </a>
              ) : (
                <h2 className="mt-2 font-display text-base font-semibold leading-snug text-ink">
                  {title}
                </h2>
              )}
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                Issued {cert.issuedLabel}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="certification-network-next font-mono text-xs uppercase tracking-wide text-ink-muted">
        <Link href="/skills" className="transition-colors hover:text-ink">
          View skills →
        </Link>
      </p>
    </section>
  );
}
