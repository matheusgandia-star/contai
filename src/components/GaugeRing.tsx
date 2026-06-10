'use client'

interface Props {
  pct: number
  color: string
  size?: number
}

export default function GaugeRing({ pct, color, size = 120 }: Props) {
  const r = 44, cx = 50, cy = 50
  const circ = parseFloat((2 * Math.PI * r).toFixed(2))
  const off = parseFloat((circ * (1 - Math.min(pct, 100) / 100)).toFixed(2))

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="9"
        strokeDasharray={circ} strokeDashoffset={off}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)' }}
      />
      <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="15" fontWeight="800"
        fontFamily="-apple-system,BlinkMacSystemFont,sans-serif">
        {Math.round(pct)}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.35)" fontSize="8.5"
        fontFamily="-apple-system,BlinkMacSystemFont,sans-serif">
        usado
      </text>
    </svg>
  )
}
