/** Gentle turn. Keep this geometry aligned with public/brand/symbol-light.svg. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`brand-symbol ${className}`}
      viewBox="0 0 256 256"
      width="36"
      height="36"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="brand-symbol-body"
        d="M100 48 A16 16 0 0 1 132 48 V88 H164 A16 16 0 0 1 164 120 H132 V156 Q132 180 156 180 H164 A16 16 0 0 1 164 212 H156 Q100 212 100 156 V120 H44 A16 16 0 0 1 44 88 H100 Z"
      />
      <circle className="brand-symbol-moment" cx="212" cy="104" r="16" />
    </svg>
  );
}
