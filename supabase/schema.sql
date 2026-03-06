-- =========================
-- ESQUEMA BASE DE DATOS - Dashboard Métricas
-- Ejecutar en Supabase SQL Editor
-- =========================

-- 1) USERS
create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- 2) LOGIN EVENTS
create table if not exists public.login_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  login_at timestamptz not null default now()
);

create index if not exists idx_login_events_user_id on public.login_events(user_id);
create index if not exists idx_login_events_login_at on public.login_events(login_at);
create index if not exists idx_login_events_user_login_at on public.login_events(user_id, login_at desc);

-- 3) TRIAL EVENTS
create table if not exists public.trial_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  trial_started_at timestamptz not null default now(),
  trial_source text
);

create unique index if not exists ux_trial_events_user_id on public.trial_events(user_id);
create index if not exists idx_trial_events_trial_started_at on public.trial_events(trial_started_at);

-- 4) SUBSCRIPTIONS
create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  provider_subscription_id text unique,
  status text not null check (status in ('trialing', 'active', 'canceled', 'past_due', 'expired')),
  plan_name text,
  billing_interval text not null default 'monthly' check (billing_interval in ('monthly', 'yearly')),
  trial_started_at timestamptz,
  first_paid_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_subscriptions_current_period_end on public.subscriptions(current_period_end);
create index if not exists idx_subscriptions_first_paid_at on public.subscriptions(first_paid_at);
create index if not exists idx_subscriptions_ended_at on public.subscriptions(ended_at);

-- 5) PAYMENT EVENTS
create table if not exists public.payment_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id bigint references public.subscriptions(id) on delete set null,
  payment_type text not null check (payment_type in ('first_payment', 'renewal', 'refund')),
  amount numeric(10,2),
  currency text not null default 'eur',
  paid_at timestamptz not null default now(),
  provider_payment_id text unique
);

create index if not exists idx_payment_events_user_id on public.payment_events(user_id);
create index if not exists idx_payment_events_subscription_id on public.payment_events(subscription_id);
create index if not exists idx_payment_events_paid_at on public.payment_events(paid_at);
create index if not exists idx_payment_events_payment_type on public.payment_events(payment_type);

-- 6) AUTO-UPDATE updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- =========================
-- FUNCIONES RPC PARA DASHBOARD
-- =========================

-- Métricas principales (KPIs)
create or replace function get_dashboard_metrics()
returns json language plpgsql security definer as $$
declare result json;
begin
  select json_build_object(
    'total_users', (select count(*) from public.users),
    'active_subscriptions', (select count(*) from public.subscriptions where status in ('active', 'trialing')),
    'trials_this_month', (select count(*) from public.trial_events where trial_started_at >= date_trunc('month', now())),
    'revenue_this_month', (select coalesce(sum(amount), 0)::numeric from public.payment_events where payment_type != 'refund' and paid_at >= date_trunc('month', now())),
    'total_revenue', (select coalesce(sum(case when payment_type = 'refund' then -amount else amount end), 0)::numeric from public.payment_events),
    'mau', (select count(distinct user_id) from public.login_events where login_at >= now() - interval '30 days')
  ) into result;
  return result;
end;
$$;

-- Suscripciones por estado
create or replace function get_subscriptions_by_status()
returns table(status text, cantidad bigint) language sql security definer as $$
  select s.status::text, count(*)::bigint from public.subscriptions s group by s.status order by count(*) desc;
$$;

-- Usuarios nuevos por mes (últimos 12 meses)
create or replace function get_users_by_month()
returns table(mes date, cantidad bigint) language sql security definer as $$
  select date_trunc('month', created_at)::date as mes, count(*)::bigint
  from public.users
  where created_at >= now() - interval '12 months'
  group by 1 order by 1 asc;
$$;

-- Ingresos por mes (últimos 12 meses)
create or replace function get_revenue_by_month()
returns table(mes date, ingresos numeric, primeros_pagos bigint, renovaciones bigint) language sql security definer as $$
  select 
    date_trunc('month', paid_at)::date as mes,
    sum(case when payment_type = 'refund' then -amount else amount end)::numeric as ingresos,
    count(*) filter (where payment_type = 'first_payment')::bigint as primeros_pagos,
    count(*) filter (where payment_type = 'renewal')::bigint as renovaciones
  from public.payment_events
  where paid_at >= now() - interval '12 months'
  group by 1 order by 1 asc;
$$;

-- Logins por día (últimos 30 días)
create or replace function get_logins_by_day()
returns table(dia date, logins bigint, usuarios_unicos bigint) language sql security definer as $$
  select 
    login_at::date as dia,
    count(*)::bigint as logins,
    count(distinct user_id)::bigint as usuarios_unicos
  from public.login_events
  where login_at >= now() - interval '30 days'
  group by 1 order by 1 asc;
$$;

-- Tasa conversión trial → pago
create or replace function get_trial_conversion()
returns json language plpgsql security definer as $$
declare result json;
begin
  select json_build_object(
    'total_trials', (select count(*) from public.trial_events),
    'converted', (select count(distinct te.user_id) from public.trial_events te
      join public.subscriptions s on s.user_id = te.user_id
      where s.status in ('active', 'trialing')),
    'conversion_rate', round(100.0 * (select count(distinct te.user_id) from public.trial_events te
      join public.subscriptions s on s.user_id = te.user_id
      where s.status in ('active', 'trialing')) / nullif((select count(*) from public.trial_events), 0), 2)
  ) into result;
  return result;
end;
$$;

-- Pagos recientes (últimos 20)
create or replace function get_recent_payments()
returns table(id bigint, user_id uuid, payment_type text, amount numeric, paid_at timestamptz) language sql security definer as $$
  select id, user_id, payment_type, amount, paid_at
  from public.payment_events
  order by paid_at desc limit 20;
$$;

-- Permisos para las funciones
grant execute on function get_dashboard_metrics() to anon;
grant execute on function get_dashboard_metrics() to authenticated;
grant execute on function get_subscriptions_by_status() to anon;
grant execute on function get_subscriptions_by_status() to authenticated;
grant execute on function get_users_by_month() to anon;
grant execute on function get_users_by_month() to authenticated;
grant execute on function get_revenue_by_month() to anon;
grant execute on function get_revenue_by_month() to authenticated;
grant execute on function get_logins_by_day() to anon;
grant execute on function get_logins_by_day() to authenticated;
grant execute on function get_trial_conversion() to anon;
grant execute on function get_trial_conversion() to authenticated;
grant execute on function get_recent_payments() to anon;
grant execute on function get_recent_payments() to authenticated;
