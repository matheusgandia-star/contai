import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCycle, pcolorHero, pcls, brl } from '@/lib/cycle'
import type { Settings, Expense, Category, CategoryLimit } from '@/lib/types'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: settingsRow },
    { data: expenses },
    { data: categories },
    { data: catLimits },
  ] = await Promise.all([
    supabase.from('settings').select('*').eq('user_id', user.id).single(),
    supabase.from('expenses').select('*').eq('user_id', user.id),
    supabase.from('categories').select('*').eq('user_id', user.id).order('display_order'),
    supabase.from('category_limits').select('*').eq('user_id', user.id),
  ])

  const settings: Settings = settingsRow ?? {
    user_id: user.id,
    monthly_limit: 0,
    cycle_mode: 'standard',
    invoice_day: 1,
    sheets_url: null,
  }

  return (
    <DashboardClient
      settings={settings}
      expenses={(expenses ?? []) as Expense[]}
      categories={(categories ?? []) as Category[]}
      catLimits={(catLimits ?? []) as CategoryLimit[]}
    />
  )
}
