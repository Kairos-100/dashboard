import type { RecentPayment } from '../types'

interface RecentPaymentsTableProps {
  payments: RecentPayment[]
}

const PAYMENT_LABELS: Record<string, string> = {
  first_payment: 'Primer pago',
  renewal: 'Renovación',
  refund: 'Reembolso',
}

export function RecentPaymentsTable({ payments }: RecentPaymentsTableProps) {
  return (
    <div className="table-container">
      <h3 className="chart-title">Pagos recientes</h3>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Importe</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={3} className="table-empty">
                  No hay pagos recientes
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className={`badge badge-${p.payment_type}`}>
                      {PAYMENT_LABELS[p.payment_type] || p.payment_type}
                    </span>
                  </td>
                  <td className={p.payment_type === 'refund' ? 'amount-negative' : 'amount-positive'}>
                    {p.payment_type === 'refund' ? '-' : ''}€{Number(p.amount).toFixed(2)}
                  </td>
                  <td>{new Date(p.paid_at).toLocaleString('es-ES')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
