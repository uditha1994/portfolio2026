/**
 * Three marks, same initials:
 *  - "book": UL written across an open book (lecturing), the foot of the L as a cursor block
 *    (programming), and a small neural network rising from the spine (AI).
 *  - "bubble": UL inside a speech bubble (lecturing) with a cursor (programming) and a small network (AI).
 *  - "tag": the initials set as a <UL> code tag, with a spark for the AI work.
 * Letters and outlines take the current text colour; the accent is always amber.
 * Change ACTIVE to switch the mark used across the site.
 */
export type LogoVariant = 'book' | 'bubble' | 'tag'

const ACTIVE: LogoVariant = 'book'

export default function Logo({ className, variant = ACTIVE }: { className?: string; variant?: LogoVariant }) {
  if (variant === 'book') {
    return (
      <svg className={className} viewBox="0 0 140 120" fill="none" aria-hidden="true" focusable="false">
        <g stroke="currentColor">
          <path
            d="M70 42Q40 30 8 40v72q32-10 62 2 30-12 62-2V40q-32-10-62 2Zm0 0v72"
            strokeWidth="4.500"
            strokeLinejoin="round"
          />
          <path d="M26 56v22a12 12 0 0 0 24 0V56M92 56v40" strokeWidth="8.500" />
          <path d="M70 42 50 25l20-14 20 14Z" strokeWidth="2.500" strokeLinejoin="round" />
        </g>
        <g fill="currentColor">
          <circle cx="70" cy="42" r="5" />
          <circle cx="50" cy="25" r="5.500" />
          <circle cx="90" cy="25" r="5.500" />
        </g>
        <circle className="logo-spark" cx="70" cy="11" r="6.500" fill="#FFA51F" />
        <rect x="96.250" y="87.500" width="14" height="8.500" fill="#FFA51F" />
      </svg>
    )
  }
  if (variant === 'tag') {
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
  return (
    <svg className={className} viewBox="0 0 140 116" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor">
        <path
          d="M14 4h112a10 10 0 0 1 10 10v66a10 10 0 0 1-10 10H60l-22 22V90H14A10 10 0 0 1 4 80V14A10 10 0 0 1 14 4Z"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M32 26v22a14 14 0 0 0 28 0V26M78 26v40.500" strokeWidth="9" />
        <path d="m108 24 11 14-18 3Z" strokeWidth="2" />
      </g>
      <g fill="currentColor">
        <circle cx="108" cy="24" r="4.500" />
        <circle cx="119" cy="38" r="4.500" />
        <circle cx="101" cy="41" r="4.500" />
      </g>
      <rect className="logo-spark" x="86" y="57.500" width="18" height="9" fill="#FFA51F" />
    </svg>
  )
}
