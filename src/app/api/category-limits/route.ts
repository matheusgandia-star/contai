import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: { limits: Record<string, number> } = await request.json()

  const rows = Object.entries(body.limits)
    .filter(([, v]) => v > 0)
    .map(([category_id, limit_amount]) => ({ user_id: user.id, category_id, limit_amount }))

  // Remove all then re-insert
  await supabase.from('category_limits').delete().eq('user_id', user.id)

  if (rows.length > 0) {
    const { error } = await supabase.from('category_limits').insert(rows)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
