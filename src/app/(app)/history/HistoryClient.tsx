'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getCycle, brl, prettyDate } from '@/lib/cycle'
import type { Category, Settings, Expense } from '@/lib/types'
import AppShell from '@/components/AppShell'

interface Props { categories: Category[]; settings: Settings; expenses: Expense[] }

export default function HistoryClient({ categories, settings, expenses: initialExpenses }: Props) {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [filter, setFilter] = useState('all')
  const [expenses, setExpenses] = useState(initialExpenses)

  const cycle = getCycle(settings.cycle_mode, settings.invoice_day, offset)

  const cycleExps = useMemo(() =>
    expenses.filter(e => e.date >= cycle.startStr && e.date <= cycle.endStr),
    [expenses, cycle]
  )

  const totalSpent = cycleExps.reduce((s, e) => s + e.amount, 0)
  const activeDays = new Set(cycleExps.map(e => e.date)).size
  const avgDay = activeDays > 0 ? totalSpent / activeDays : 0
  const pixExps = cycleExps.filter(e => e.pay_method === 'pix')
  const pixTotal = pixExps.reduce((s, e) => s + e.amount, 0)
  const pixPct = totalSpent > 0 ? Math.round((pixTotal / totalSpent) * 100) : 0

  const catSums = useMemo(() =>
    categories.map(c => ({
      ...c,
      sum: cycleExps.filter(e => e.category_id === c.id).reduce((s, e) => s + e.amount, 0)
    })).filter(c => c.sum > 0).sort((a, b) => b.sum - a.sum),
    [cycleExps, categories]
  )

  const usedCatIds = new Set(cycleExps.map(e => e.category_id))
  const hasPixExps = cycleExps.some(e => e.pay_method === 'pix')

  const filtered = useMemo(() => {
    let list = filter === 'all' ? cycleExps
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
    if (res.ok) {
      setExpenses(prev => prev.filter(e => e.id !== id))
    }
  }

  return (
    <AppShell title="Análise">
      <div>
        {/* Navegação de ciclo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--card)', borderRadius: 14, padding: '11px 14px', marginBottom: 12,
          border: '1px solid var(--border)'
        }}>
          <button onClick={() => { setOffset(o => o - 1); setFilter('all') }} style={{
            background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 9,
            color: 'var(--text)', fontSize: 18, padding: '4px 12px', cursor: 'pointer'
          }}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{cycle.label}</div>
            {cycle.badge !== 'Mês corrido' && (
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{cycle.rangeStr}</div>
            )}
          </div>
          <button
            onClick={() => { if (offset < 0) { setOffset(o => o + 1); setFilter('all') } }}
            disabled={offset >= 0}
            style={{
              background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 9,
              color: 'var(--text)', fontSize: 18, padding: '4px 12px',
              cursor: offset >= 0 ? 'default' : 'pointer', opacity: offset >= 0 ? 0.25 : 1
            }}
          >›</button>
        </div>

        {/* Card resumo */}
        <div style={{
          background: 'linear-gradient(145deg,#0F3D3E 0%,#0a2c2d 100%)',
          borderRadius: 18, padding: 16, marginBottom: 14,
          border: '1px solid rgba(212,163,115,.2)', boxShadow: '0 4px 20px rgba(15,61,62,.15)'
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 700, marginBottom: 12 }}>
            {cycle.badge === 'Mês corrido' ? cycle.label : 'Fatura ' + cycle.label} — Resumo
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { val: brl(totalSpent), lbl: 'Total gasto' },
              { val: brl(avgDay), lbl: 'Média/dia ativo' },
              { val: String(cycleExps.length), lbl: 'Registros' },
              { val: brl(pixTotal), lbl: `PIX / Débito (${pixPct}%)`, gold: true },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.11)', borderRadius: 12, padding: 12, border: '1px solid rgba(255,255,255,.07)' }}>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 3, color: item.gold ? '#D4A373' : '#fff' }}>{item.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.62)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.3px' }}>{item.lbl}</div>
              </div>
            ))}
          </div>

          {catSums.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {catSums.map(cat => {
                const p = totalSpent > 0 ? (cat.sum / totalSpent) * 100 : 0
                return (
                  <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, width: 22, flexShrink: 0 }}>{cat.emoji}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', width: 70, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,.14)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 100, width: `${p}%`, background: cat.color, transition: 'width .5s ease', filter: 'brightness(1.15)' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, width: 72, textAlign: 'right', flexShrink: 0, color: cat.color }}>{brl(cat.sum)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pills filtro */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 5, marginBottom: 11, scrollbarWidth: 'none' }}>
          {[
            { id: 'all', label: 'Todos' },
            ...(hasPixExps ? [{ id: 'pix', label: '⚡ PIX' }] : []),
            ...categories.filter(c => usedCatIds.has(c.id)).map(c => ({ id: c.id, label: c.emoji + ' ' + c.name }))
          ].map(pill => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id)}
              style={{
                background: filter === pill.id ? '#0F3D3E' : 'var(--card)',
                border: `1.5px solid ${filter === pill.id ? '#0F3D3E' : 'var(--border)'}`,
                borderRadius: 100, padding: '6px 13px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .18s',
                color: filter === pill.id ? '#FAF7F0' : 'var(--text)'
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Lista de gastos */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
            <p style={{ fontSize: 14 }}>Nenhum gasto neste ciclo</p>
          </div>
        ) : (
          Object.entries(groups).map(([dateStr, items]) => (
            <div key={dateStr}>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', margin: '13px 0 7px' }}>
                {prettyDate(dateStr)}
              </div>
              {items.map(exp => {
                const cat = categories.find(c => c.id === exp.category_id)
                return (
                  <div key={exp.id} style={{
                    display: 'flex', alignItems: 'center', gap: 11, background: 'var(--card)',
                    borderRadius: 14, padding: 12, marginBottom: 7,
                    border: '1px solid rgba(15,61,62,.08)', boxShadow: '0 1px 4px rgba(15,61,62,.05)'
                  }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, background: cat?.bg ?? 'var(--card2)' }}>
                      {cat?.emoji ?? '💸'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exp.description || cat?.name || 'Gasto'}
                        </span>
                        {exp.pay_method === 'pix' && (
                          <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: 'rgba(212,163,115,.15)', color: '#9A6728', flexShrink: 0 }}>PIX</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{cat?.name}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{brl(exp.amount)}</div>
                    </div>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 5, borderRadius: 7 }}
                    >🗑️</button>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
    </AppShell>
  )
}
