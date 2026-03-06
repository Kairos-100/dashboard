interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
}

export function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span className="metric-card-title">{title}</span>
        {icon && <span className="metric-card-icon">{icon}</span>}
      </div>
      <div className="metric-card-value">{value}</div>
      {subtitle && <div className="metric-card-subtitle">{subtitle}</div>}
    </div>
  )
}
