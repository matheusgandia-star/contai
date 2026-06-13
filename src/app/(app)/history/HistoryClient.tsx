'use client'

import { useState, useMemo } from 'react'
import { getCycle, brl, prettyDate } from '@/lib/cycle'
import type { Category, Settings, Expense } from '@/lib/types'
import AppShell from '@/components/AppShell'
import CategoryIcon from '@/components/CategoryIcon'
import { UI_ICONS } from '@/lib/categoryIcons'

interface Props { categories: Category[]; settings: Settings; expenses: Expense[] }

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const ESSENTIAL_IDS = new Set(['groceries','food','transportation','fuel','health','home','education','family_and_children','debts_and_loans','car','motorcycle'])

function delta(curr: number, prev: number) {
  if (prev === 0) return null
  return Math.round(((curr - prev) / prev) * 100)
}

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null
  const up = pct > 0
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 100, background: up ? 'rgba(198,40,40,.1)' : 'rgba(46,125,50,.1)', color: up ? '#C62828' : '#2E7D32', flexShrink: 0 }}>
      {up ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )
}

function ScoreRing({ score }: { score: number }) {
  const r = 36, c = 2 * Math.PI * r
  const fill = (score / 100) * c
  const color = score >= 80 ? '#2E7D32' : score >= 60 ? '#0F3D3E' : score >= 40 ? '#D4A373' : '#C62828'
  const label = score >= 80 ? 'Ótimo' : score >= 60 ? 'Bom' : score >= 40 ? 'Regular' : 'Atenção'
  return (
    <div style={{ position: 'relative', width: 92, height: 92, flexShrink: 0 }}>
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r={r} fill="none" stroke="var(--card2)" strokeWidth="8" />
        <circle cx="46" cy="46" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
          transform="rotate(-90 46 46)" style={{ transition: 'stroke-dasharray .8s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</span>
      </div>
    </div>
  )
}

export default function HistoryClient({ categories, settings, expenses: initialExpenses }: Props) {
  const [offset, setOffset] = useState(0)
  const [filter, setFilter] = useState('all')
  const [expenses, setExpenses] = useState(initialExpenses)
  const [tab, setTab] = useState<'resumo' | 'lista'>('resumo')

  const cycle     = getCycle(settings.cycle_mode, settings.invoice_day, offset)
  const prevCycle = getCycle(settings.cycle_mode, settings.invoice_day, offset - 1)

  const cycleExps = useMemo(() => expenses.filter(e => e.date >= cycle.startStr && e.date <= cycle.endStr), [expenses, cycle])
  const prevExps  = useMemo(() => expenses.filter(e => e.date >= prevCycle.startStr && e.date <= prevCycle.endStr), [expenses, prevCycle])

  const totalSpent = cycleExps.reduce((s, e) => s + e.amount, 0)
  const prevTotal  = prevExps.reduce((s, e) => s + e.amount, 0)
  const activeDays = new Set(cycleExps.map(e => e.date)).size
  const avgDay     = activeDays > 0 ? totalSpent / activeDays : 0
  const pixExps    = cycleExps.filter(e => e.pay_method === 'pix')
  const pixTotal   = pixExps.reduce((s, e) => s + e.amount, 0)
  const pixPct     = totalSpent > 0 ? Math.round((pixTotal / totalSpent) * 100) : 0

  const lim      = settings.monthly_limit || 0
  const rest     = lim - totalSpent
  const now      = new Date()
  const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const cycleEnd = new Date(cycle.endStr)
  const cycleEndMidnight = new Date(cycleEnd.getFullYear(), cycleEnd.getMonth(), cycleEnd.getDate())
  const daysLeft = Math.max(0, Math.round((cycleEndMidnight.getTime() - today.getTime()) / 86400000))
  const projected = totalSpent + avgDay * daysLeft

  const catSums = useMemo(() =>
    categories.map(c => ({
      ...c,
      sum:     cycleExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0),
      prevSum: prevExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0),
    })).filter(c => c.sum > 0).sort((a, b) => b.sum - a.sum),
    [cycleExps, prevExps, categories])

  const biggestExp = cycleExps.length > 0 ? cycleExps.reduce((a, b) => b.amount > a.amount ? b : a) : null
  const biggestCat = biggestExp ? categories.find(c => c.id === biggestExp.category_id) : null

  const dayTotals = useMemo(() => {
    const t = Array(7).fill(0); const cnt = Array(7).fill(0)
    cycleExps.forEach(e => { const d = new Date(e.date + 'T12:00:00').getDay(); t[d] += e.amount; cnt[d]++ })
    return t.map((total, i) => ({ day: DAYS[i], total, count: cnt[i] }))
  }, [cycleExps])
  const maxDayTotal = Math.max(...dayTotals.map(d => d.total), 1)
  const hotDay = dayTotals.reduce((a, b) => b.total > a.total ? b : a, dayTotals[0])

  const biggestGrowth = useMemo(() =>
    categories.map(c => {
      const curr = cycleExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
      const prev = prevExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
      return { ...c, curr, prev, pct: delta(curr, prev) }
    }).filter(c => c.curr > 0 && c.pct !== null && c.pct > 0)
      .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0))[0] ?? null,
    [cycleExps, prevExps, categories])

  // ── Health score ──────────────────────────────────────────────────────────
  const score = useMemo(() => {
    if (cycleExps.length === 0) return 100
    let s = 100
    if (lim > 0) {
      if (totalSpent > lim)        s -= 30
      else if (totalSpent > lim * .8) s -= 15
      if (projected > lim)         s -= 10
    }
    if (prevTotal > 0 && totalSpent > prevTotal) s -= 10
    if (pixPct >= 50) s -= 10
    catSums.forEach(c => { if (totalSpent > 0 && c.sum / totalSpent > .35) s -= 8 })
    return Math.max(0, Math.min(100, s))
  }, [cycleExps, lim, totalSpent, projected, prevTotal, pixPct, catSums])

  const scoreFactors = useMemo(() => {
    const f: { text: string; ok: boolean }[] = []
    if (lim > 0) f.push({ text: totalSpent <= lim * .8 ? 'Dentro do orçamento' : totalSpent <= lim ? 'Próximo do limite' : 'Limite ultrapassado', ok: totalSpent <= lim * .8 })
    if (prevTotal > 0) f.push({ text: totalSpent <= prevTotal ? 'Gastou menos que no ciclo anterior' : 'Gastou mais que no ciclo anterior', ok: totalSpent <= prevTotal })
    f.push({ text: pixPct < 50 ? 'PIX/Débito equilibrado' : 'Alto uso de PIX/Débito', ok: pixPct < 50 })
    return f
  }, [lim, totalSpent, prevTotal, pixPct])

  // ── Heat map ──────────────────────────────────────────────────────────────
  const heatMap = useMemo(() => {
    const start = new Date(cycle.startStr + 'T12:00:00')
    const end   = new Date(cycle.endStr   + 'T12:00:00')
    const days: { date: string; total: number }[] = []
    const cur = new Date(start)
    while (cur <= end) {
      const d = cur.toISOString().slice(0, 10)
      days.push({ date: d, total: cycleExps.filter(e => e.date === d).reduce((s, e) => s + e.amount, 0) })
      cur.setDate(cur.getDate() + 1)
    }
    return days
  }, [cycle, cycleExps])
  const heatMax = Math.max(...heatMap.map(d => d.total), 1)

  // ── Savings opportunities (top 3 categories with biggest absolute increase) ──
  const opportunities = useMemo(() =>
    categories.map(c => {
      const curr = cycleExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
      const prev = prevExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
      return { ...c, curr, prev, diff: curr - prev }
    }).filter(c => c.curr > 0 && c.prev > 0 && c.diff > 0)
      .sort((a, b) => b.diff - a.diff).slice(0, 3),
    [cycleExps, prevExps, categories])

  // ── 6-cycle history ───────────────────────────────────────────────────────
  const history6 = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const c = getCycle(settings.cycle_mode, settings.invoice_day, offset - 5 + i)
      const total = expenses.filter(e => e.date >= c.startStr && e.date <= c.endStr).reduce((s, e) => s + e.amount, 0)
      return { label: c.label, total, isCurrent: i === 5 }
    })
  }, [expenses, settings, offset])
  const histMax = Math.max(...history6.map(h => h.total), 1)

  // ── Essential vs non-essential ────────────────────────────────────────────
  const essentialTotal = catSums.filter(c => ESSENTIAL_IDS.has(c.emoji)).reduce((s, c) => s + c.sum, 0)
  const nonEssentialTotal = totalSpent - essentialTotal
  const essentialPct = totalSpent > 0 ? Math.round((essentialTotal / totalSpent) * 100) : 0

  // ── Recurring expenses ────────────────────────────────────────────────────
  const recurring = useMemo(() =>
    categories.map(c => {
      const curr = cycleExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
      const prev = prevExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
      if (curr === 0 || prev === 0) return null
      const ratio = Math.abs(curr - prev) / Math.max(curr, prev)
      if (ratio > 0.4) return null // too different to be recurring
      return { ...c, curr, prev, avg: (curr + prev) / 2 }
    }).filter(Boolean) as (Category & { curr: number; prev: number; avg: number })[],
    [cycleExps, prevExps, categories])

  // ── Recommendations ───────────────────────────────────────────────────────
  const recs = useMemo(() => {
    const r: string[] = []
    if (lim > 0 && projected > lim)
      r.push(`No ritmo atual, você vai gastar ${brl(projected)} — ${brl(projected - lim)} acima do limite.`)
    catSums.forEach(c => { if (totalSpent > 0 && c.sum / totalSpent > .35) r.push(`${c.name} representa ${Math.round((c.sum / totalSpent) * 100)}% dos seus gastos.`) })
    if (pixPct >= 50) r.push(`${pixPct}% dos gastos são PIX/Débito. Considere um limite separado.`)
    if (biggestGrowth && (biggestGrowth.pct ?? 0) >= 50) r.push(`${biggestGrowth.name} subiu ${biggestGrowth.pct}% em relação ao ciclo anterior.`)
    if (cycleExps.length >= 3 && daysLeft > 0 && lim > 0 && rest > 0) r.push(`Pode gastar até ${brl(rest / daysLeft)}/dia para não ultrapassar o limite.`)
    return r
  }, [catSums, pixPct, lim, projected, biggestGrowth, daysLeft, rest, cycleExps, totalSpent])

  // ── List ──────────────────────────────────────────────────────────────────
  const usedCatIds = new Set(cycleExps.map(e => e.category_id))
  const hasPixExps = cycleExps.some(e => e.pay_method === 'pix')
  const filtered = useMemo(() => {
    const list = filter === 'all' ? cycleExps : filter === 'pix' ? cycleExps.filter(e => e.pay_method === 'pix') : cycleExps.filter(e => e.category_id === filter)
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

  const cs = { background: 'var(--card)', borderRadius: 16, padding: '14px 15px', border: '1px solid var(--border)', boxShadow: '0 1px 6px rgba(15,61,62,.05)' }
  const label = (t: string) => <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '.6px', marginBottom: 12 }}>{t}</div>

  return (
    <AppShell title="Análise">
      {/* Cycle nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...cs, marginBottom: 14 }}>
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
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700, background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? '#FAF7F0' : 'var(--muted)', cursor: 'pointer', transition: 'all .2s' }}>
            {t === 'resumo' ? 'Resumo & Métricas' : 'Lista de Gastos'}
          </button>
        ))}
      </div>

      {tab === 'resumo' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── Score de saúde ── */}
          {cycleExps.length > 0 && (
            <div style={{ ...cs, display: 'flex', gap: 16, alignItems: 'center' }}>
              <ScoreRing score={score} />
              <div style={{ flex: 1 }}>
                {label('Saúde financeira')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {scoreFactors.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <span style={{ width: 14, height: 14, borderRadius: '50%', background: f.ok ? 'rgba(46,125,50,.15)' : 'rgba(198,40,40,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg viewBox="0 0 24 24" width="9" height="9" fill={f.ok ? '#2E7D32' : '#C62828'}>
                          {f.ok ? <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/> : <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>}
                        </svg>
                      </span>
                      <span style={{ color: 'var(--text)', lineHeight: 1.3 }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Hero totals ── */}
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
            {catSums.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {catSums.map(cat => {
                  const p = totalSpent > 0 ? (cat.sum / totalSpent) * 100 : 0
                  return (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 20, flexShrink: 0, display: 'flex', alignItems: 'center' }}><CategoryIcon emoji={cat.emoji} color={cat.color} size={15} /></span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', width: 66, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,.14)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 100, width: `${p}%`, background: cat.color, transition: 'width .5s', filter: 'brightness(1.15)' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, width: 68, textAlign: 'right', flexShrink: 0, color: cat.color }}>{brl(cat.sum)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Projeção ── */}
          {lim > 0 && cycleExps.length >= 2 && (
            <div style={{ ...cs }}>
              {label('Projeção do ciclo')}
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
                <div style={{ height: '100%', borderRadius: 100, width: `${Math.min((projected / lim) * 100, 100)}%`, background: projected > lim ? 'linear-gradient(90deg,#B91C1C,#DC2626)' : 'linear-gradient(90deg,#0F3D3E,#D4A373)', transition: 'width .6s' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{daysLeft} dias restantes · média {brl(avgDay)}/dia</div>
            </div>
          )}

          {/* ── Sugestão diária/semanal ── */}
          {lim > 0 && daysLeft > 0 && rest > 0 && (
            <div style={{ ...cs }}>
              {label('Sugestão para não ultrapassar o limite')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { lbl: 'Por dia', val: brl(rest / daysLeft), sub: `${daysLeft} dias restantes` },
                  { lbl: 'Por semana', val: brl((rest / daysLeft) * 7), sub: `${Math.ceil(daysLeft / 7)} sem. restantes` },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(15,61,62,.06)', borderRadius: 13, padding: '13px', border: '1.5px solid rgba(15,61,62,.12)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>{item.lbl}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', letterSpacing: -0.5 }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              {avgDay > rest / daysLeft && (
                <div style={{ marginTop: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(198,40,40,.08)', border: '1px solid rgba(198,40,40,.15)', fontSize: 12, color: '#C62828', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="#C62828" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  Média atual ({brl(avgDay)}/dia) acima da sugestão. Reduza o ritmo para não estourar.
                </div>
              )}
            </div>
          )}

          {/* ── Histórico 6 ciclos ── */}
          {history6.some(h => h.total > 0) && (
            <div style={{ ...cs }}>
              {label('Histórico de gastos')}
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, marginBottom: 6 }}>
                {history6.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                    {h.total > 0 && <span style={{ fontSize: 8, color: h.isCurrent ? 'var(--accent)' : 'var(--muted)', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{brl(h.total).replace('R$ ','')}</span>}
                    <div style={{ width: '100%', borderRadius: '5px 5px 0 0', height: `${Math.round((h.total / histMax) * 56)}px`, minHeight: h.total > 0 ? 5 : 0, background: h.isCurrent ? 'var(--accent)' : 'var(--card2)', border: `1.5px solid ${h.isCurrent ? 'var(--accent)' : 'var(--border)'}`, transition: 'height .4s' }} />
                    <span style={{ fontSize: 8.5, color: h.isCurrent ? 'var(--accent)' : 'var(--muted)', fontWeight: h.isCurrent ? 700 : 500, textAlign: 'center', lineHeight: 1.2 }}>{h.label}</span>
                  </div>
                ))}
              </div>
              {lim > 0 && (
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 8, fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="var(--muted)"><path d="M19 13H5v-2h14v2z"/></svg>
                  Limite: {brl(lim)}
                </div>
              )}
            </div>
          )}

          {/* ── Mapa de calor ── */}
          {heatMap.length > 0 && cycleExps.length >= 3 && (
            <div style={{ ...cs }}>
              {label('Mapa de calor do ciclo')}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {heatMap.map(d => {
                  const intensity = d.total / heatMax
                  const isToday = d.date === today.toISOString().slice(0, 10)
                  const bg = d.total === 0
                    ? 'var(--card2)'
                    : intensity > .7 ? '#0F3D3E' : intensity > .4 ? 'rgba(15,61,62,.55)' : intensity > .15 ? 'rgba(15,61,62,.28)' : 'rgba(15,61,62,.12)'
                  return (
                    <div key={d.date} title={`${d.date}: ${brl(d.total)}`} style={{ width: 28, height: 28, borderRadius: 6, background: bg, border: isToday ? '2px solid var(--gold)' : '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default', transition: 'background .3s' }}>
                      <span style={{ fontSize: 8, color: intensity > .4 ? 'rgba(255,255,255,.8)' : 'var(--muted)', fontWeight: 600 }}>{new Date(d.date + 'T12:00:00').getDate()}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>Menos</span>
                {['rgba(15,61,62,.12)', 'rgba(15,61,62,.28)', 'rgba(15,61,62,.55)', '#0F3D3E'].map((c, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: '1px solid var(--border)' }} />
                ))}
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>Mais</span>
                <span style={{ fontSize: 10, color: 'var(--gold)', marginLeft: 8 }}>▣ hoje</span>
              </div>
            </div>
          )}

          {/* ── Essencial vs Supérfluo ── */}
          {totalSpent > 0 && catSums.length > 0 && (
            <div style={{ ...cs }}>
              {label('Essencial vs Supérfluo')}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Essencial</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{essentialPct}%</span>
                  </div>
                  <div style={{ background: 'var(--card2)', borderRadius: 100, height: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 100, width: `${essentialPct}%`, background: 'linear-gradient(90deg,#0F3D3E,#1a5c5e)', transition: 'width .6s' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{brl(essentialTotal)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Supérfluo</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#D4A373' }}>{100 - essentialPct}%</span>
                  </div>
                  <div style={{ background: 'var(--card2)', borderRadius: 100, height: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 100, width: `${100 - essentialPct}%`, background: 'linear-gradient(90deg,#D4A373,#9A6728)', transition: 'width .6s' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{brl(nonEssentialTotal)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {catSums.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 4, background: ESSENTIAL_IDS.has(c.emoji) ? 'rgba(15,61,62,.07)' : 'rgba(212,163,115,.1)', borderRadius: 100, padding: '3px 8px', border: `1px solid ${ESSENTIAL_IDS.has(c.emoji) ? 'rgba(15,61,62,.15)' : 'rgba(212,163,115,.25)'}` }}>
                    <CategoryIcon emoji={c.emoji} color={c.color} size={12} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Oportunidades de economia ── */}
          {opportunities.length > 0 && (
            <div style={{ ...cs }}>
              {label('Oportunidades de economia')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {opportunities.map((op, i) => (
                  <div key={op.id} style={{ display: 'flex', gap: 11, padding: '11px 12px', background: 'rgba(212,163,115,.06)', borderRadius: 12, border: '1px solid rgba(212,163,115,.2)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: op.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CategoryIcon emoji={op.emoji} color={op.color} size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{op.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        Atual: <strong style={{ color: '#C62828' }}>{brl(op.curr)}</strong> · Anterior: {brl(op.prev)}
                      </div>
                      <div style={{ fontSize: 11, color: '#2E7D32', fontWeight: 600, marginTop: 2 }}>
                        Economia potencial: {brl(op.diff)}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#C62828', alignSelf: 'flex-start' }}>+{brl(op.diff)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Gastos recorrentes ── */}
          {recurring.length > 0 && (
            <div style={{ ...cs }}>
              {label('Gastos recorrentes identificados')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recurring.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', background: 'var(--card2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CategoryIcon emoji={r.emoji} color={r.color} size={17} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>Apareceu nos 2 últimos ciclos</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>~{brl(r.avg)}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>média/ciclo</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Comparativo ── */}
          {prevTotal > 0 && (
            <div style={{ ...cs }}>
              {label('Comparativo de ciclos')}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categories.filter(c => {
                  const cur = cycleExps.filter(e => e.category_id === c.id).reduce((a, e) => a + e.amount, 0)
                  const prv = prevExps.filter(e => e.category_id === c.id).reduce((a, e) => a + e.amount, 0)
                  return cur > 0 || prv > 0
                }).map(cat => {
                  const curr = cycleExps.filter(e => e.category_id === cat.id).reduce((a, e) => a + e.amount, 0)
                  const prev = prevExps.filter(e => e.category_id === cat.id).reduce((a, e) => a + e.amount, 0)
                  const maxVal = Math.max(curr, prev, 1)
                  return (
                    <div key={cat.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                        <CategoryIcon emoji={cat.emoji} color={cat.color} size={14} />
                        <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{cat.name}</span>
                        <DeltaBadge pct={delta(curr, prev)} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', width: 64, textAlign: 'right' }}>{brl(curr)}</span>
                      </div>
                      {[{ val: curr, color: cat.color, lbl: 'Atual' }, { val: prev, color: 'var(--muted)', lbl: 'Anterior' }].map((row, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 9, color: 'var(--muted)', width: 32, flexShrink: 0 }}>{row.lbl}</span>
                          <div style={{ flex: 1, background: 'var(--card2)', borderRadius: 100, height: 5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 100, width: `${(row.val / maxVal) * 100}%`, background: row.color, opacity: i === 1 ? 0.5 : 1, transition: 'width .5s' }} />
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--muted)', width: 56, textAlign: 'right', flexShrink: 0 }}>{brl(row.val)}</span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Gráfico por dia da semana ── */}
          {cycleExps.length >= 3 && (
            <div style={{ ...cs }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>
                Gastos por dia da semana
                {hotDay.total > 0 && <span style={{ fontWeight: 400, textTransform: 'none', marginLeft: 6, color: 'var(--accent)' }}>· mais caro: {hotDay.day}</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 72 }}>
                {dayTotals.map(d => (
                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', borderRadius: '5px 5px 0 0', height: `${Math.round((d.total / maxDayTotal) * 60)}px`, background: d.total === hotDay.total && d.total > 0 ? 'var(--accent)' : 'var(--card2)', border: `1.5px solid ${d.total === hotDay.total && d.total > 0 ? 'var(--accent)' : 'var(--border)'}`, minHeight: d.total > 0 ? 6 : 0, transition: 'height .4s' }} />
                    <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 600 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Maior gasto único ── */}
          {biggestExp && (
            <div style={{ ...cs, display: 'flex', alignItems: 'center', gap: 12 }}>
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

          {/* ── Recomendações ── */}
          {recs.length > 0 && (
            <div style={{ ...cs }}>
              {label('Recomendações')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recs.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--card2)', borderRadius: 11, border: '1px solid var(--border)' }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.45 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 5, marginBottom: 11, scrollbarWidth: 'none' }}>
            {[
              { id: 'all', label: 'Todos' },
              ...(hasPixExps ? [{ id: 'pix', label: 'PIX', isPix: true }] : []),
              ...categories.filter(c => usedCatIds.has(c.id)).map(c => ({ id: c.id, label: c.name, cat: c }))
            ].map((pill: any) => (
              <button key={pill.id} onClick={() => setFilter(pill.id)} style={{ background: filter === pill.id ? '#0F3D3E' : 'var(--card)', border: `1.5px solid ${filter === pill.id ? '#0F3D3E' : 'var(--border)'}`, borderRadius: 100, padding: '6px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .18s', color: filter === pill.id ? '#FAF7F0' : 'var(--text)' }}>
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
                      <div style={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{brl(exp.amount)}</div>
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
