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
  active: '#22c55e',
  trialing: '#3b82f6',
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
              <Cell key={i} fill={STATUS_COLORS[entry.name] || '#64748b'} />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Bar dataKey="usuarios" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `€${v}`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            formatter={(value: number) => [value, '']}
            labelFormatter={(label) => label}
          />
          <Legend />
          <Line type="monotone" dataKey="ingresos" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Ingresos (€)" />
          <Line type="monotone" dataKey="primeros_pagos" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Primeros pagos" />
          <Line type="monotone" dataKey="renovaciones" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa' }} name="Renovaciones" />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="dia" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
          />
          <Bar dataKey="logins" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Logins" />
          <Bar dataKey="usuarios" fill="#22c55e" radius={[4, 4, 0, 0]} name="Usuarios únicos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
