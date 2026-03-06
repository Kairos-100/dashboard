import { useMetrics } from './hooks/useMetrics'
import { MetricCard } from './components/MetricCard'
import { SubscriptionsChart, UsersChart, RevenueChart, LoginsChart } from './components/Charts'
import { RecentPaymentsTable } from './components/RecentPaymentsTable'
import { TrialConversionCard } from './components/TrialConversionCard'
import './App.css'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function App() {
  const {
    loading,
    error,
    metrics,
    subscriptionsByStatus,
    usersByMonth,
    revenueByMonth,
    loginsByDay,
    trialConversion,
    recentPayments,
    refetch,
  } = useMetrics()

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Dashboard Métricas</h1>
        </header>
        <div className="loading-state">
          <div className="spinner" />
          <p>Cargando métricas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1>Dashboard Métricas</h1>
        </header>
        <div className="error-state">
          <p className="error-message">{error}</p>
          <p className="error-hint">
            Verifica que hayas ejecutado el esquema SQL en Supabase y configurado las variables en .env
          </p>
          <button onClick={refetch} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Dashboard Métricas</h1>
          <button onClick={refetch} className="refresh-btn" title="Actualizar datos">
            Actualizar
          </button>
        </div>
      </header>

      <main className="main">
        {/* KPIs */}
        <section className="kpi-grid">
          <MetricCard
            title="Total usuarios"
            value={metrics?.total_users ?? 0}
            icon="👥"
          />
          <MetricCard
            title="Suscripciones activas"
            value={metrics?.active_subscriptions ?? 0}
            subtitle="active + trialing"
            icon="✓"
          />
          <MetricCard
            title="Trials este mes"
            value={metrics?.trials_this_month ?? 0}
            icon="🔄"
          />
          <MetricCard
            title="MAU"
            value={metrics?.mau ?? 0}
            subtitle="usuarios activos últimos 30 días"
            icon="📊"
          />
          <MetricCard
            title="Ingresos este mes"
            value={formatCurrency(metrics?.revenue_this_month ?? 0)}
            icon="€"
          />
          <MetricCard
            title="Ingresos totales"
            value={formatCurrency(metrics?.total_revenue ?? 0)}
            icon="💰"
          />
        </section>

        {/* Charts row 1 */}
        <section className="charts-grid">
          <SubscriptionsChart data={subscriptionsByStatus} />
          <UsersChart data={usersByMonth} />
          <TrialConversionCard data={trialConversion} />
        </section>

        {/* Charts row 2 - full width */}
        <section className="charts-row">
          <RevenueChart data={revenueByMonth} />
        </section>

        <section className="charts-row">
          <LoginsChart data={loginsByDay} />
        </section>

        {/* Table */}
        <section className="table-section">
          <RecentPaymentsTable payments={recentPayments} />
        </section>
      </main>
    </div>
  )
}

export default App
