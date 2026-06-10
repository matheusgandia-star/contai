import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Category, Settings, CategoryLimit } from '@/lib/types'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: settingsRow }, { data: categories }, { data: catLimits }] = await Promise.all([
    supabase.from('settings').select('*').eq('user_id', user.id).single(),
    supabase.from('categories').select('*').eq('user_id', user.id).order('display_order'),
    supabase.from('category_limits').select('*').eq('user_id', user.id),
  ])

  const settings: Settings = settingsRow ?? {
    user_id: user.id, monthly_limit: 0, cycle_mode: 'standard', invoice_day: 1, sheets_url: null,
  }

  return (
    <SettingsClient
      settings={settings}
      categories={(categories ?? []) as Category[]}
      catLimits={(catLimits ?? []) as CategoryLimit[]}
      userEmail={user.email ?? ''}
    />
  )
}
