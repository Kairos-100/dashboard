export interface DashboardMetrics {
  total_users: number
  active_subscriptions: number
  trials_this_month: number
  revenue_this_month: number
  total_revenue: number
  mau: number
}

export interface SubscriptionByStatus {
  status: string
  cantidad: number
}

export interface UsersByMonth {
  mes: string
  cantidad: number
}

export interface RevenueByMonth {
  mes: string
  ingresos: number
  primeros_pagos: number
  renovaciones: number
}

export interface LoginsByDay {
  dia: string
  logins: number
  usuarios_unicos: number
}

export interface TrialConversion {
  total_trials: number
  converted: number
  conversion_rate: number | null
}

export interface RecentPayment {
  id: number
  user_id: string
  payment_type: string
  amount: number
  paid_at: string
}
