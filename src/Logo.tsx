/**
 * The <UL> tag monogram: the initials set as a code tag, with a spark for the AI work.
 * Letters and brackets take the current text colour; the spark is always amber.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 148 86" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor">
        <path d="M24 30 8 54l16 24M124 30l16 24-16 24" strokeWidth="6" />
        <path d="M38 28v32a16 16 0 0 0 32 0V28M86 28v48h26" strokeWidth="10" />
      </g>
      <path
        className="logo-spark"
        d="M114 3q1.7 11.300 13 13-11.300 1.700-13 13-1.700-11.300-13-13 11.300-1.700 13-13Z"
        fill="#FFA51F"
      />
    </svg>
  )
}
