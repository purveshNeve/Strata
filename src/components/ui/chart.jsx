import { Tooltip } from 'recharts'

export function ChartContainer({ config, className, children }) {
  const style = Object.entries(config || {}).reduce((acc, [key, value]) => {
    const color = value?.color || value?.theme?.light || '#2563EB'
    acc[`--color-${key}`] = color
    acc[`--chart-${key}`] = color
    return acc
  }, {})

  return (
    <div
      className={
        'w-full rounded-xl border border-[#E7E5E4] bg-white p-4 ' +
        (className || '')
      }
      style={style}
    >
      {children}
    </div>
  )
}

export function ChartTooltip(props) {
  return <Tooltip {...props} />
}

export function ChartTooltipContent({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0]
  return (
    <div className="rounded-md border border-[#E7E5E4] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-[#57534E]">{label}</p>
      <p className="text-sm font-semibold text-[#1C1917]">
        {item.value}
        <span className="text-[11px] text-[#78716C] ml-1">%</span>
      </p>
    </div>
  )
}

