import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type {
  DashboardMetrics,
  SubscriptionByStatus,
  UsersByMonth,
  RevenueByMonth,
  LoginsByDay,
  TrialConversion,
  RecentPayment,
} from '../types'

export function useMetrics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [subscriptionsByStatus, setSubscriptionsByStatus] = useState<SubscriptionByStatus[]>([])
  const [usersByMonth, setUsersByMonth] = useState<UsersByMonth[]>([])
  const [revenueByMonth, setRevenueByMonth] = useState<RevenueByMonth[]>([])
  const [loginsByDay, setLoginsByDay] = useState<LoginsByDay[]>([])
  const [trialConversion, setTrialConversion] = useState<TrialConversion | null>(null)
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        { data: metricsData, error: metricsErr },
        { data: subsData, error: subsErr },
        { data: usersData, error: usersErr },
        { data: revenueData, error: revenueErr },
        { data: loginsData, error: loginsErr },
        { data: trialData, error: trialErr },
        { data: paymentsData, error: paymentsErr },
      ] = await Promise.all([
        supabase.rpc('get_dashboard_metrics'),
        supabase.rpc('get_subscriptions_by_status'),
        supabase.rpc('get_users_by_month'),
        supabase.rpc('get_revenue_by_month'),
        supabase.rpc('get_logins_by_day'),
        supabase.rpc('get_trial_conversion'),
        supabase.rpc('get_recent_payments'),
      ])

      if (metricsErr) throw metricsErr
      if (subsErr) throw subsErr
      if (usersErr) throw usersErr
      if (revenueErr) throw revenueErr
      if (loginsErr) throw loginsErr
      if (trialErr) throw trialErr
      if (paymentsErr) throw paymentsErr

      setMetrics(metricsData as DashboardMetrics)
      setSubscriptionsByStatus((subsData as SubscriptionByStatus[]) || [])
      setUsersByMonth(
        (usersData as { mes: string; cantidad: number }[] || []).map((r) => ({
          mes: r.mes,
          cantidad: Number(r.cantidad),
        }))
      )
      setRevenueByMonth(
        (revenueData as { mes: string; ingresos: number; primeros_pagos: number; renovaciones: number }[] || []).map(
          (r) => ({
            mes: r.mes,
            ingresos: Number(r.ingresos),
            primeros_pagos: Number(r.primeros_pagos),
            renovaciones: Number(r.renovaciones),
          })
        )
      )
      setLoginsByDay(
        (loginsData as { dia: string; logins: number; usuarios_unicos: number }[] || []).map((r) => ({
          dia: r.dia,
          logins: Number(r.logins),
          usuarios_unicos: Number(r.usuarios_unicos),
        }))
      )
      setTrialConversion(trialData as TrialConversion)
      setRecentPayments(
        (paymentsData as RecentPayment[] || []).map((p) => ({
          ...p,
          amount: Number(p.amount),
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar métricas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return {
    loading,
    error,
    metrics,
    subscriptionsByStatus,
    usersByMonth,
    revenueByMonth,
    loginsByDay,
    trialConversion,
    recentPayments,
    refetch: fetchAll,
  }
}
