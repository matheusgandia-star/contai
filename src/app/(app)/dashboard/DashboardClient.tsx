'use client'

import { useMemo } from 'react'
import { getCycle, pcolorHero, pcolor, pcls, brl, prettyDate } from '@/lib/cycle'
import type { Settings, Expense, Category, CategoryLimit } from '@/lib/types'
import GaugeRing from '@/components/GaugeRing'
import AppShell from '@/components/AppShell'
import CategoryIcon from '@/components/CategoryIcon'
import { UI_ICONS } from '@/lib/categoryIcons'

interface Props {
  settings: Settings
  expenses: Expense[]
  categories: Category[]
  catLimits: CategoryLimit[]
}

export default function DashboardClient({ settings, expenses, categories, catLimits }: Props) {
  const cycle = getCycle(settings.cycle_mode, settings.invoice_day, 0)

  const cycleExps = useMemo(() =>
    expenses.filter(e => e.date >= cycle.startStr && e.date <= cycle.endStr),
    [expenses, cycle]
  )

  const spent = cycleExps.reduce((s, e) => s + e.amount, 0)
  const lim = settings.monthly_limit || 0
  const pct = lim > 0 ? (spent / lim) * 100 : 0
  const rest = lim - spent
  const heroColor = pcolorHero(pct)

  const limitsMap = useMemo(() => {
    const m: Record<string, number> = {}
    catLimits.forEach(cl => { m[cl.category_id] = cl.limit_amount })
    return m
  }, [catLimits])

  const pixExps = cycleExps.filter(e => e.pay_method === 'pix')
  const pixTotal = pixExps.reduce((s, e) => s + e.amount, 0)
  const pixPct = spent > 0 ? Math.round((pixTotal / spent) * 100) : 0

  const recent = [...cycleExps]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 5)

  const alertClass = pct >= 100 ? 'over' : pct >= 90 ? 'danger' : pct >= 70 ? 'warn' : ''
  const alertColor = alertClass === 'over' ? '#FCA5A5' : alertClass === 'danger' ? '#F09040' : '#F0C040'
  const alertText = pct >= 100 ? 'Limite do ciclo ultrapassado!'
    : pct >= 90 ? 'Você usou 90% do orçamento do ciclo'
    : pct >= 70 ? 'Atenção: 70% do orçamento utilizado'
    : ''

  const headerRight = (
    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'right', lineHeight: 1.3 }}>
      {cycle.label}
    </div>
  )

  return (
    <AppShell right={headerRight}>
      <div>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(145deg,#0F3D3E 0%,#0a2c2d 100%)',
          borderRadius: 22, padding: 18, marginBottom: 14,
          border: '1px solid rgba(212,163,115,.2)', boxShadow: '0 4px 24px rgba(15,61,62,.18)'
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: 14, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Ciclo atual</span>
            <span style={{ fontSize: 10, background: 'rgba(212,163,115,.2)', color: '#D4A373', padding: '3px 8px', borderRadius: 100, fontWeight: 700 }}>
              {cycle.badge}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flexShrink: 0 }}>
              <GaugeRing pct={pct} color={heroColor} size={120} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4, fontWeight: 600 }}>Restante</div>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: -1, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {rest >= 0 ? brl(rest) : '−' + brl(Math.abs(rest))}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Gasto</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FAF7F0' }}>{brl(spent)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Limite</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FAF7F0' }}>{brl(lim)}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#FAF7F0' }}>{cycle.daysLeft}</span>
                {cycle.daysLeft === 1 ? 'dia restante no ciclo' : 'dias restantes no ciclo'}
              </div>
            </div>
          </div>

          {alertText && (
            <div style={{
              marginTop: 12, padding: '9px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: alertClass === 'over' ? 'rgba(185,28,28,.25)' : alertClass === 'danger' ? 'rgba(176,74,16,.25)' : 'rgba(176,125,16,.25)',
              color: alertColor,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {UI_ICONS.warning(alertColor)}
              {alertText}
            </div>
          )}
        </div>

        {/* Categories */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', margin: '16px 0 9px' }}>
          Categorias
        </div>

        {categories.map(cat => {
          const s = cycleExps.filter(e => e.category_id === cat.id).reduce((sum, e) => sum + e.amount, 0)
          const lc = limitsMap[cat.id] || 0
          const p = lc > 0 ? (s / lc) * 100 : 0
          const pd = lc > 0 ? Math.round(p) : 0
          const rem = lc - s
          const cls = pcls(pd)

          return (
            <div key={cat.id} style={{
              display: 'flex', alignItems: 'center', gap: 11, background: 'var(--card)',
              borderRadius: 16, padding: '12px 13px', marginBottom: 8,
              border: '1px solid rgba(15,61,62,.08)', boxShadow: '0 1px 4px rgba(15,61,62,.05)'
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: cat.bg }}>
                <CategoryIcon emoji={cat.emoji} color={cat.color} size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {brl(s)} de {lc > 0 ? brl(lc) : 'sem limite'}
                </div>
                {lc > 0 && (
                  <>
                    <div style={{ background: 'rgba(15,61,62,0.08)', borderRadius: 100, height: 7, overflow: 'hidden', marginTop: 6 }}>
                      <div style={{
                        height: '100%', borderRadius: 100, width: `${Math.min(p, 100)}%`,
                        background: cls === 'over' ? 'linear-gradient(90deg,#B91C1C,#DC2626)'
                          : cls === 'danger' ? 'linear-gradient(90deg,#B04A10,#D4654A)'
                          : cls === 'warn' ? 'linear-gradient(90deg,#B07D10,#D4A373)'
                          : 'linear-gradient(90deg,#0F3D3E,#1a5c5e)',
                        transition: 'width .6s cubic-bezier(.4,0,.2,1)'
                      }} />
                    </div>
                    {pd >= 70 && (() => {
                      const bc = cls === 'over' ? '#991B1B' : cls === 'danger' ? '#8B3A0A' : '#7A5800'
                      const label = cls === 'over' ? 'Ultrapassado' : cls === 'danger' ? '90% do limite' : '70% do limite'
                      return (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 100, marginTop: 4,
                          background: cls === 'over' ? 'rgba(185,28,28,.12)' : cls === 'danger' ? 'rgba(176,74,16,.12)' : 'rgba(176,125,16,.12)',
                          color: bc,
                        }}>
                          {UI_ICONS.warning(bc)}
                          {label}
                        </span>
                      )
                    })()}
                  </>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: rem < 0 && lc > 0 ? 'var(--red)' : 'var(--text)' }}>
                  {lc > 0 ? (rem >= 0 ? brl(rem) : '−' + brl(Math.abs(rem))) : '—'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{lc > 0 ? pd + '%' : '—'}</div>
              </div>
            </div>
          )
        })}

        {/* PIX Card */}
        {pixExps.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', margin: '16px 0 9px' }}>
              PIX / Débito / Dinheiro
            </div>
            <div style={{
              background: 'linear-gradient(135deg,rgba(212,163,115,.12),rgba(212,163,115,.05))',
              borderRadius: 16, padding: '14px 15px', marginBottom: 8,
              border: '1px solid rgba(212,163,115,.3)', display: 'flex', alignItems: 'center', gap: 13
            }}>
              <div style={{ color: 'var(--gold)', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>PIX / Débito / Dinheiro</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#9A6728', marginTop: 2 }}>{brl(pixTotal)}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {pixExps.length} transaç{pixExps.length === 1 ? 'ão' : 'ões'} no ciclo · conta no limite total
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#9A6728' }}>{pixPct}%</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>dos gastos</div>
              </div>
            </div>
          </>
        )}

        {/* Recent expenses */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', margin: '16px 0 9px' }}>
          Últimos gastos
        </div>

        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              {UI_ICONS.inbox('var(--muted)')}
            </div>
            <p style={{ fontSize: 14 }}>Nenhum gasto ainda.<br />Toque em <strong>Adicionar</strong>.</p>
          </div>
        ) : (
          recent.map(exp => {
            const cat = categories.find(c => c.id === exp.category_id)
            return (
              <div key={exp.id} style={{
                display: 'flex', alignItems: 'center', gap: 11, background: 'var(--card)',
                borderRadius: 14, padding: 12, marginBottom: 7,
                border: '1px solid rgba(15,61,62,.08)', boxShadow: '0 1px 4px rgba(15,61,62,.05)'
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: cat?.bg ?? 'var(--card2)' }}>
                  <CategoryIcon emoji={cat?.emoji ?? 'groceries'} color={cat?.color ?? '#0F3D3E'} size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {exp.description || cat?.name || 'Gasto'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                    {cat?.name} · {prettyDate(exp.date)}
                    {exp.pay_method === 'pix' && (
                      <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: 'rgba(212,163,115,.15)', color: '#9A6728' }}>PIX</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{brl(exp.amount)}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </AppShell>
  )
}
