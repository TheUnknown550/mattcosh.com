export interface ScreenPort {
  x: number;
  y: number;
}

export function areScreenPortsEqual(
  previous: Record<string, ScreenPort>,
  next: Record<string, ScreenPort>,
) {
  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);
  if (previousKeys.length !== nextKeys.length) return false;

  return nextKeys.every((key) => {
    const previousPort = previous[key];
    const nextPort = next[key];
    return (
      previousPort !== undefined &&
      Math.abs(previousPort.x - nextPort.x) < 0.25 &&
      Math.abs(previousPort.y - nextPort.y) < 0.25
    );
  });
}
