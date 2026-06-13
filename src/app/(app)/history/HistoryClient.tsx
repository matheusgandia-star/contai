'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getCycle, brl, prettyDate } from '@/lib/cycle'
import type { Category, Settings, Expense } from '@/lib/types'
import AppShell from '@/components/AppShell'
import CategoryIcon from '@/components/CategoryIcon'
import { UI_ICONS } from '@/lib/categoryIcons'

interface Props { categories: Category[]; settings: Settings; expenses: Expense[] }

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function delta(curr: number, prev: number) {
  if (prev === 0) return null
  return Math.round(((curr - prev) / prev) * 100)
}

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null
  const up = pct > 0
  const color = up ? '#C62828' : '#2E7D32'
  const bg = up ? 'rgba(198,40,40,.1)' : 'rgba(46,125,50,.1)'
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 100, background: bg, color, flexShrink: 0 }}>
      {up ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )
}

export default function HistoryClient({ categories, settings, expenses: initialExpenses }: Props) {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [filter, setFilter] = useState('all')
  const [expenses, setExpenses] = useState(initialExpenses)
  const [tab, setTab] = useState<'resumo' | 'lista'>('resumo')

  const cycle = getCycle(settings.cycle_mode, settings.invoice_day, offset)
  const prevCycle = getCycle(settings.cycle_mode, settings.invoice_day, offset - 1)

  const cycleExps = useMemo(() =>
    expenses.filter(e => e.date >= cycle.startStr && e.date <= cycle.endStr),
    [expenses, cycle])

  const prevExps = useMemo(() =>
    expenses.filter(e => e.date >= prevCycle.startStr && e.date <= prevCycle.endStr),
    [expenses, prevCycle])

  const totalSpent = cycleExps.reduce((s, e) => s + e.amount, 0)
  const prevTotal = prevExps.reduce((s, e) => s + e.amount, 0)
  const activeDays = new Set(cycleExps.map(e => e.date)).size
  const avgDay = activeDays > 0 ? totalSpent / activeDays : 0
  const pixExps = cycleExps.filter(e => e.pay_method === 'pix')
  const pixTotal = pixExps.reduce((s, e) => s + e.amount, 0)
  const pixPct = totalSpent > 0 ? Math.round((pixTotal / totalSpent) * 100) : 0

  // Projection
  const lim = settings.monthly_limit || 0
  const rest = lim - totalSpent
  const today = new Date()
  const cycleEnd = new Date(cycle.endStr)
  const daysLeft = Math.max(0, Math.ceil((cycleEnd.getTime() - today.getTime()) / 86400000))
  const projected = totalSpent + avgDay * daysLeft

  // Category sums
  const catSums = useMemo(() =>
    categories.map(c => ({
      ...c,
      sum: cycleExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0),
      prevSum: prevExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0),
    })).filter(c => c.sum > 0).sort((a, b) => b.sum - a.sum),
    [cycleExps, prevExps, categories])

  // Biggest single expense
  const biggestExp = cycleExps.length > 0
    ? cycleExps.reduce((a, b) => b.amount > a.amount ? b : a)
    : null
  const biggestCat = biggestExp ? categories.find(c => c.id === biggestExp.category_id) : null

  // Most expensive weekday
  const dayTotals = useMemo(() => {
    const t = Array(7).fill(0)
    const cnt = Array(7).fill(0)
    cycleExps.forEach(e => {
      const d = new Date(e.date + 'T12:00:00').getDay()
      t[d] += e.amount; cnt[d]++
    })
    return t.map((total, i) => ({ day: DAYS[i], total, count: cnt[i] }))
  }, [cycleExps])
  const maxDayTotal = Math.max(...dayTotals.map(d => d.total), 1)
  const hotDay = dayTotals.reduce((a, b) => b.total > a.total ? b : a, dayTotals[0])

  // Category with biggest growth
  const biggestGrowth = useMemo(() => {
    return categories
      .map(c => {
        const curr = cycleExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
        const prev = prevExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
        return { ...c, curr, prev, pct: delta(curr, prev) }
      })
      .filter(c => c.curr > 0 && c.pct !== null && c.pct > 0)
      .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0))[0] ?? null
  }, [cycleExps, prevExps, categories])

  // Recommendations
  const recs = useMemo(() => {
    const r: string[] = []
    if (lim > 0 && projected > lim)
      r.push(`No ritmo atual, você vai gastar ${brl(projected)} este ciclo — ${brl(projected - lim)} acima do limite.`)
    catSums.forEach(c => {
      if (totalSpent > 0 && c.sum / totalSpent > 0.35)
        r.push(`${c.name} representa ${Math.round((c.sum / totalSpent) * 100)}% dos seus gastos este ciclo.`)
    })
    if (pixPct >= 50)
      r.push(`${pixPct}% dos gastos são PIX/Débito. Considere definir um limite separado.`)
    if (biggestGrowth && (biggestGrowth.pct ?? 0) >= 50)
      r.push(`${biggestGrowth.name} subiu ${biggestGrowth.pct}% em relação ao ciclo anterior.`)
    if (cycleExps.length >= 3 && avgDay > 0 && daysLeft > 0 && lim > 0 && projected <= lim)
      r.push(`Você está dentro do orçamento. Pode gastar até ${brl(rest / daysLeft)} por dia até o fim do ciclo.`)
    return r
  }, [catSums, pixPct, lim, projected, biggestGrowth, avgDay, daysLeft, rest, cycleExps])

  // Filter / list
  const usedCatIds = new Set(cycleExps.map(e => e.category_id))
  const hasPixExps = cycleExps.some(e => e.pay_method === 'pix')

  const filtered = useMemo(() => {
    const list = filter === 'all' ? cycleExps
      : filter === 'pix' ? cycleExps.filter(e => e.pay_method === 'pix')
      : cycleExps.filter(e => e.category_id === filter)
    return [...list].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
  }, [cycleExps, filter])

  const groups = useMemo(() => {
    const g: Record<string, Expense[]> = {}
    filtered.forEach(e => { (g[e.date] = g[e.date] || []).push(e) })
    return g
  }, [filtered])

  async function deleteExpense(id: number) {
    if (!confirm('Excluir este gasto?')) return
    const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' })
    if (res.ok) setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const s = { card: { background: 'var(--card)', borderRadius: 16, padding: '14px 15px', border: '1px solid var(--border)', boxShadow: '0 1px 6px rgba(15,61,62,.05)' } }

  return (
    <AppShell title="Análise">
      {/* Cycle nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...s.card, marginBottom: 14 }}>
        <button onClick={() => { setOffset(o => o - 1); setFilter('all') }} style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 9, color: 'var(--text)', fontSize: 18, padding: '4px 12px', cursor: 'pointer' }}>‹</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{cycle.label}</div>
          {cycle.badge !== 'Mês corrido' && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{cycle.rangeStr}</div>}
        </div>
        <button onClick={() => { if (offset < 0) { setOffset(o => o + 1); setFilter('all') } }} disabled={offset >= 0}
          style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 9, color: 'var(--text)', fontSize: 18, padding: '4px 12px', cursor: offset >= 0 ? 'default' : 'pointer', opacity: offset >= 0 ? 0.25 : 1 }}>›</button>
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, background: 'var(--card2)', borderRadius: 13, padding: 4, marginBottom: 16, border: '1px solid var(--border)' }}>
        {(['resumo', 'lista'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? '#FAF7F0' : 'var(--muted)', cursor: 'pointer', transition: 'all .2s'
          }}>{t === 'resumo' ? 'Resumo & Métricas' : 'Lista de Gastos'}</button>
        ))}
      </div>

      {tab === 'resumo' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Hero totals */}
          <div style={{ background: 'linear-gradient(145deg,#0F3D3E,#0a2c2d)', borderRadius: 18, padding: 16, border: '1px solid rgba(212,163,115,.2)', boxShadow: '0 4px 20px rgba(15,61,62,.15)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 700, marginBottom: 14 }}>
              {cycle.badge === 'Mês corrido' ? cycle.label : 'Fatura ' + cycle.label}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {[
                { val: brl(totalSpent), lbl: 'Total gasto', d: delta(totalSpent, prevTotal) },
                { val: brl(avgDay), lbl: 'Média/dia ativo', d: null },
                { val: String(cycleExps.length), lbl: 'Transações', d: delta(cycleExps.length, prevExps.length) },
                { val: `${pixPct}%`, lbl: 'PIX / Débito', d: null, gold: true },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,.1)', borderRadius: 12, padding: '11px 13px', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: item.gold ? '#D4A373' : '#fff' }}>{item.val}</span>
                    <DeltaBadge pct={item.d ?? null} />
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.3px' }}>{item.lbl}</div>
                </div>
              ))}
            </div>

            {/* Category bars */}
            {catSums.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {catSums.map(cat => {
                  const p = totalSpent > 0 ? (cat.sum / totalSpent) * 100 : 0
                  return (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 20, flexShrink: 0, display: 'flex', alignItems: 'center' }}><CategoryIcon emoji={cat.emoji} color={cat.color} size={15} /></span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', width: 66, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,.14)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 100, width: `${p}%`, background: cat.color, transition: 'width .5s ease', filter: 'brightness(1.15)' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, width: 68, textAlign: 'right', flexShrink: 0, color: cat.color }}>{brl(cat.sum)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Projection */}
          {lim > 0 && cycleExps.length >= 2 && (
            <div style={{ ...s.card }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>Projeção do ciclo</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Projetado</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: projected > lim ? '#C62828' : 'var(--accent)' }}>{brl(projected)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Limite</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{brl(lim)}</div>
                </div>
              </div>
              <div style={{ background: 'var(--card2)', borderRadius: 100, height: 8, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{
                  height: '100%', borderRadius: 100,
                  width: `${Math.min((projected / lim) * 100, 100)}%`,
                  background: projected > lim ? 'linear-gradient(90deg,#B91C1C,#DC2626)' : 'linear-gradient(90deg,#0F3D3E,#D4A373)',
                  transition: 'width .6s'
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {daysLeft} dias restantes · média de {brl(avgDay)}/dia
              </div>
            </div>
          )}

          {/* Daily / weekly budget suggestion */}
          {lim > 0 && daysLeft > 0 && rest > 0 && (
            <div style={{ ...s.card }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>
                Sugestão para não ultrapassar o limite
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(15,61,62,.06)', borderRadius: 13, padding: '13px', border: '1.5px solid rgba(15,61,62,.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--accent)">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>
                    </svg>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Por dia</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', letterSpacing: -0.5 }}>{brl(rest / daysLeft)}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{daysLeft} dias restantes</div>
                </div>
                <div style={{ background: 'rgba(15,61,62,.06)', borderRadius: 13, padding: '13px', border: '1.5px solid rgba(15,61,62,.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--accent)">
                      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
                    </svg>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Por semana</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', letterSpacing: -0.5 }}>{brl((rest / daysLeft) * 7)}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{Math.ceil(daysLeft / 7)} semana{Math.ceil(daysLeft / 7) !== 1 ? 's' : ''} restante{Math.ceil(daysLeft / 7) !== 1 ? 's' : ''}</div>
                </div>
              </div>
              {avgDay > rest / daysLeft && (
                <div style={{ marginTop: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(198,40,40,.08)', border: '1px solid rgba(198,40,40,.15)', fontSize: 12, color: '#C62828', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="#C62828" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  Sua média atual ({brl(avgDay)}/dia) está acima da sugestão. Reduza os gastos diários para não estourar o limite.
                </div>
              )}
            </div>
          )}

          {/* vs previous cycle */}
          {prevTotal > 0 && (
            <div style={{ ...s.card }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>Comparativo</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: cycle.label, total: totalSpent, count: cycleExps.length, isCurrent: true },
                  { label: prevCycle.label, total: prevTotal, count: prevExps.length, isCurrent: false },
                ].map((col, i) => (
                  <div key={i} style={{ background: col.isCurrent ? 'rgba(15,61,62,.07)' : 'var(--card2)', borderRadius: 12, padding: '12px', border: `1.5px solid ${col.isCurrent ? 'var(--accent)' : 'transparent'}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>{col.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: col.isCurrent ? 'var(--accent)' : 'var(--text)', marginBottom: 2 }}>{brl(col.total)}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{col.count} transações</div>
                  </div>
                ))}
              </div>
              {/* Category comparison */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categories.filter(c => {
                  const s = cycleExps.filter(e => e.category_id === c.id).reduce((a, e) => a + e.amount, 0)
                  const p = prevExps.filter(e => e.category_id === c.id).reduce((a, e) => a + e.amount, 0)
                  return s > 0 || p > 0
                }).map(cat => {
                  const curr = cycleExps.filter(e => e.category_id === cat.id).reduce((a, e) => a + e.amount, 0)
                  const prev = prevExps.filter(e => e.category_id === cat.id).reduce((a, e) => a + e.amount, 0)
                  const maxVal = Math.max(curr, prev, 1)
                  const d = delta(curr, prev)
                  return (
                    <div key={cat.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                        <CategoryIcon emoji={cat.emoji} color={cat.color} size={14} />
                        <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{cat.name}</span>
                        <DeltaBadge pct={d} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', width: 64, textAlign: 'right' }}>{brl(curr)}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {[{ val: curr, color: cat.color, label: 'Atual' }, { val: prev, color: 'var(--muted)', label: 'Anterior' }].map((row, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 9, color: 'var(--muted)', width: 32, flexShrink: 0 }}>{row.label}</span>
                            <div style={{ flex: 1, background: 'var(--card2)', borderRadius: 100, height: 5, overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 100, width: `${(row.val / maxVal) * 100}%`, background: row.color, transition: 'width .5s', opacity: i === 1 ? 0.5 : 1 }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'var(--muted)', width: 56, textAlign: 'right', flexShrink: 0 }}>{brl(row.val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Weekday chart */}
          {cycleExps.length >= 3 && (
            <div style={{ ...s.card }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>
                Gastos por dia da semana
                {hotDay.total > 0 && <span style={{ fontWeight: 400, textTransform: 'none', marginLeft: 6, color: 'var(--accent)' }}>· mais caro: {hotDay.day}</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 72 }}>
                {dayTotals.map(d => (
                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{
                      width: '100%', borderRadius: '5px 5px 0 0',
                      height: `${Math.round((d.total / maxDayTotal) * 60)}px`,
                      background: d.total === hotDay.total && d.total > 0 ? 'var(--accent)' : 'var(--card2)',
                      border: `1.5px solid ${d.total === hotDay.total && d.total > 0 ? 'var(--accent)' : 'var(--border)'}`,
                      minHeight: d.total > 0 ? 6 : 0, transition: 'height .4s'
                    }} />
                    <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 600 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Biggest expense */}
          {biggestExp && (
            <div style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: biggestCat?.bg ?? 'var(--card2)', flexShrink: 0 }}>
                <CategoryIcon emoji={biggestCat?.emoji ?? 'shopping'} color={biggestCat?.color ?? '#0F3D3E'} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Maior gasto único</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{biggestExp.description || biggestCat?.name || 'Gasto'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{biggestCat?.name} · {prettyDate(biggestExp.date)}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>{brl(biggestExp.amount)}</div>
            </div>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <div style={{ ...s.card }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 10 }}>Recomendações</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recs.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--card2)', borderRadius: 11, border: '1px solid var(--border)' }}>
                    <div style={{ flexShrink: 0, marginTop: 1 }}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="var(--accent)">
                        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.45 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 5, marginBottom: 11, scrollbarWidth: 'none' }}>
            {[
              { id: 'all', label: 'Todos' },
              ...(hasPixExps ? [{ id: 'pix', label: 'PIX', isPix: true }] : []),
              ...categories.filter(c => usedCatIds.has(c.id)).map(c => ({ id: c.id, label: c.name, cat: c }))
            ].map((pill: any) => (
              <button key={pill.id} onClick={() => setFilter(pill.id)} style={{
                background: filter === pill.id ? '#0F3D3E' : 'var(--card)',
                border: `1.5px solid ${filter === pill.id ? '#0F3D3E' : 'var(--border)'}`,
                borderRadius: 100, padding: '6px 13px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .18s',
                color: filter === pill.id ? '#FAF7F0' : 'var(--text)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {pill.isPix && UI_ICONS.bolt(filter === pill.id ? '#FAF7F0' : '#D4A373')}
                  {pill.cat && <span style={{ display: 'flex', alignItems: 'center' }}><CategoryIcon emoji={pill.cat.emoji} color={filter === pill.id ? '#FAF7F0' : pill.cat.color} size={13} /></span>}
                  {pill.label}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>{UI_ICONS.inbox('var(--muted)')}</div>
              <p style={{ fontSize: 14 }}>Nenhum gasto neste ciclo</p>
            </div>
          ) : (
            Object.entries(groups).map(([dateStr, items]) => (
              <div key={dateStr}>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', margin: '13px 0 7px' }}>{prettyDate(dateStr)}</div>
                {items.map(exp => {
                  const cat = categories.find(c => c.id === exp.category_id)
                  return (
                    <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'var(--card)', borderRadius: 14, padding: 12, marginBottom: 7, border: '1px solid rgba(15,61,62,.08)', boxShadow: '0 1px 4px rgba(15,61,62,.05)' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: cat?.bg ?? 'var(--card2)' }}>
                        <CategoryIcon emoji={cat?.emoji ?? 'groceries'} color={cat?.color ?? '#0F3D3E'} size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description || cat?.name || 'Gasto'}</span>
                          {exp.pay_method === 'pix' && <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: 'rgba(212,163,115,.15)', color: '#9A6728', flexShrink: 0 }}>PIX</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{cat?.name}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{brl(exp.amount)}</div>
                      </div>
                      <button onClick={() => deleteExpense(exp.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 5, borderRadius: 7, display: 'flex', alignItems: 'center' }}>
                        {UI_ICONS.trash('var(--muted)')}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>
      )}
    </AppShell>
  )
}
