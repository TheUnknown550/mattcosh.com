export function ProjectCardNodeIcon() {
  return (
    <svg
      aria-hidden="true"
      data-project-card-node
      viewBox="0 0 120 120"
      fill="none"
      className="project-card-node-icon pointer-events-none absolute -bottom-4 -right-4 z-0 h-32 w-32 text-signal sm:h-36 sm:w-36"
    >
      <path
        d="M12 72 31 57 49 70 67 47 87 55 109 35"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.38"
      />
      <path
        d="M23 20 51 28 78 17 104 35"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.22"
      />
      <path
        d="M60 39 84 53 84 80 60 94 36 80 36 53 60 39Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="m36 53 24 14 24-14M60 67v27" stroke="currentColor" strokeWidth="0.65" opacity="0.68" />
      <circle cx="60" cy="67" r="7" fill="currentColor" opacity="0.72" />
      <circle cx="60" cy="67" r="2.6" fill="#f4f6f8" opacity="0.96" />
      {[
        [29, 51],
        [91, 51],
        [30, 87],
        [90, 87],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <line x1="60" y1="67" x2={cx} y2={cy} stroke="currentColor" strokeWidth="0.65" opacity="0.42" />
          <circle cx={cx} cy={cy} r="2.7" fill="currentColor" opacity="0.62" />
        </g>
      ))}
    </svg>
  );
}
