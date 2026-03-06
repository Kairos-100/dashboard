import type { TrialConversion } from '../types'

interface TrialConversionCardProps {
  data: TrialConversion | null
}

export function TrialConversionCard({ data }: TrialConversionCardProps) {
  if (!data) return null

  return (
    <div className="trial-conversion-card">
      <h3 className="chart-title">Conversión Trial → Pago</h3>
      <div className="trial-stats">
        <div className="trial-stat">
          <span className="trial-stat-value">{data.total_trials}</span>
          <span className="trial-stat-label">Trials totales</span>
        </div>
        <div className="trial-stat">
          <span className="trial-stat-value">{data.converted}</span>
          <span className="trial-stat-label">Convertidos</span>
        </div>
        <div className="trial-stat trial-stat-highlight">
          <span className="trial-stat-value">
            {data.conversion_rate != null ? `${data.conversion_rate}%` : '—'}
          </span>
          <span className="trial-stat-label">Tasa de conversión</span>
        </div>
      </div>
    </div>
  )
}
