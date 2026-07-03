const UNITS = 8;
const UNIT_WIDTH = 150;
const HEIGHT = 40;
const VIEW_WIDTH = UNITS * UNIT_WIDTH;

function buildPulsePath() {
  const baseline = HEIGHT / 2;
  let d = `M0,${baseline}`;
  for (let i = 0; i < UNITS; i++) {
    const x = i * UNIT_WIDTH;
    d += ` L${x + 50},${baseline}`;
    d += ` L${x + 62},${baseline}`;
    d += ` L${x + 70},${baseline - HEIGHT * 0.3}`;
    d += ` L${x + 78},${baseline + HEIGHT * 0.6}`;
    d += ` L${x + 86},${baseline - HEIGHT * 0.1}`;
    d += ` L${x + 98},${baseline}`;
    d += ` L${x + UNIT_WIDTH},${baseline}`;
  }
  return d;
}

const PATH = buildPulsePath();

/**
 * Section divider styled as a heartbeat/EKG trace — a nod to CS-M, the
 * cardiac-monitoring flagship project. Static trace always shows; the
 * traveling highlight is CSS-driven and respects prefers-reduced-motion.
 */
export function PulseDivider() {
  return (
    <div aria-hidden="true" className="w-full overflow-hidden py-2">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-6 w-full text-line"
      >
        <path
          d={PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pulse-scan text-signal"
        />
      </svg>
    </div>
  );
}
