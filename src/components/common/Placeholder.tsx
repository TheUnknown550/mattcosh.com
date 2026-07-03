interface PlaceholderProps {
  label: string;
}

/**
 * Generic marker for areas not yet implemented (final design, real content, etc.).
 */
export function Placeholder({ label }: PlaceholderProps) {
  return (
    <div className="border border-dashed border-gray-400 p-6 text-sm text-gray-500">
      {label}
    </div>
  );
}
