interface CertificationCardNodeIconProps {
  className?: string;
}

/** The purple terminal used to connect a credential card to its graph node. */
export function CertificationCardNodeIcon({
  className = "",
}: CertificationCardNodeIconProps) {
  return (
    <svg
      aria-hidden="true"
      data-certification-card-node
      viewBox="0 0 64 64"
      className={`certification-card-node-icon pointer-events-none absolute h-10 w-10 ${className}`}
    >
      <path
        d="m32 5 23 13v28L32 59 9 46V18Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m9 18 23 14 23-14M32 32v27" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="32" cy="32" r="9" fill="currentColor" opacity="0.3" />
      <circle cx="32" cy="32" r="3.5" fill="currentColor" />
    </svg>
  );
}
