import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import type { SubscriptionByStatus, UsersByMonth, RevenueByMonth, LoginsByDay } from '../types'

const STATUS_COLORS: Record<string, string> = {
  active: '#00c853',
  trialing: '#00e676',
  canceled: '#ef4444',
  past_due: '#f59e0b',
  expired: '#6b7280',
}

interface SubscriptionsChartProps {
  data: SubscriptionByStatus[]
}

export function SubscriptionsChart({ data }: SubscriptionsChartProps) {
  const chartData = data.map((d) => ({ name: d.status, value: d.cantidad }))

  return (
    <div className="chart-container">
      <h3 className="chart-title">Suscripciones por estado</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, 'Suscripciones']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface UsersChartProps {
  data: UsersByMonth[]
}

export function UsersChart({ data }: UsersChartProps) {
  const chartData = data.map((d) => ({
    mes: new Date(d.mes).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
    usuarios: d.cantidad,
  }))

  return (
    <div className="chart-container">
      <h3 className="chart-title">Usuarios nuevos por mes</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="mes" stroke="#475569" fontSize={12} />
          <YAxis stroke="#475569" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
            labelStyle={{ color: '#475569' }}
          />
          <Bar dataKey="usuarios" fill="#00c853" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface RevenueChartProps {
  data: RevenueByMonth[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    mes: new Date(d.mes).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
    ingresos: Number(d.ingresos),
    primeros_pagos: d.primeros_pagos,
    renovaciones: d.renovaciones,
  }))

  return (
    <div className="chart-container chart-wide">
      <h3 className="chart-title">Ingresos por mes</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="mes" stroke="#475569" fontSize={12} />
          <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `€${v}`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
            formatter={(value: number) => [value, '']}
            labelFormatter={(label) => label}
          />
          <Legend />
          <Line type="monotone" dataKey="ingresos" stroke="#00c853" strokeWidth={2} dot={{ fill: '#00c853' }} name="Ingresos (€)" />
          <Line type="monotone" dataKey="primeros_pagos" stroke="#00a843" strokeWidth={2} dot={{ fill: '#00a843' }} name="Primeros pagos" />
          <Line type="monotone" dataKey="renovaciones" stroke="#00e676" strokeWidth={2} dot={{ fill: '#00e676' }} name="Renovaciones" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface LoginsChartProps {
  data: LoginsByDay[]
}

export function LoginsChart({ data }: LoginsChartProps) {
  const chartData = data.map((d) => ({
    dia: new Date(d.dia).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    logins: d.logins,
    usuarios: d.usuarios_unicos,
  }))

  return (
    <div className="chart-container chart-wide">
      <h3 className="chart-title">Actividad (últimos 30 días)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="dia" stroke="#475569" fontSize={11} />
          <YAxis stroke="#475569" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
          />
          <Bar dataKey="logins" fill="#00c853" radius={[4, 4, 0, 0]} name="Logins" />
          <Bar dataKey="usuarios" fill="#00a843" radius={[4, 4, 0, 0]} name="Usuarios únicos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
