# Dashboard Métricas

Dashboard para visualizar métricas clave de tu proyecto SaaS (usuarios, suscripciones, ingresos, trials, logins).

## Requisitos previos

1. **Supabase**: Proyecto creado en [supabase.com](https://supabase.com)
2. **Base de datos**: Ejecutar el esquema SQL en el SQL Editor de Supabase

## Configuración

### 1. Variables de entorno

Copia `.env.example` a `.env` y rellena con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Obtén las credenciales en: **Supabase Dashboard → Settings → API**

### 2. Esquema de base de datos

Ejecuta el contenido de `supabase/schema.sql` en el **SQL Editor** de tu proyecto Supabase. Esto crea:

- Tablas: `users`, `login_events`, `trial_events`, `subscriptions`, `payment_events`
- Funciones RPC para las métricas del dashboard

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

## Métricas incluidas

- **KPIs**: Total usuarios, suscripciones activas, trials del mes, MAU, ingresos
- **Gráficas**: Suscripciones por estado, usuarios por mes, ingresos por mes, actividad (logins)
- **Conversión**: Trial → Pago
- **Tabla**: Pagos recientes
