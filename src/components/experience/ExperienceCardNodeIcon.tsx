interface ExperienceCardNodeIconProps {
  className?: string;
  "data-experience-card-node"?: true;
}

/** A local endpoint matching the orange nodes in the shared experience graph. */
export function ExperienceCardNodeIcon({
  className = "",
  "data-experience-card-node": graphEndpoint,
}: ExperienceCardNodeIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 72 72"
      className={`experience-card-node-icon pointer-events-none absolute h-16 w-16 ${className}`}
      data-experience-card-node={graphEndpoint || undefined}
    >
      <path d="M12 21 36 8l24 13v30L36 64 12 51Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 21 36 36 60 21M36 36v28" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.68" />
      <circle cx="36" cy="36" r="10" fill="currentColor" opacity="0.28" />
      <circle cx="36" cy="36" r="4" fill="currentColor" />
      <circle cx="12" cy="21" r="2.5" fill="currentColor" />
      <circle cx="60" cy="21" r="2.5" fill="currentColor" />
      <circle cx="36" cy="64" r="2.5" fill="currentColor" />
    </svg>
  );
}
