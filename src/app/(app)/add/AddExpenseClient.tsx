'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Settings, CategoryLimit } from '@/lib/types'
import { getCycle, brl } from '@/lib/cycle'
import AppShell from '@/components/AppShell'

interface Props {
  categories: Category[]
  settings: Settings
  catLimits: CategoryLimit[]
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function AddExpenseClient({ categories, settings, catLimits }: Props) {
  const router = useRouter()
  const [selCat, setSelCat] = useState(categories[0]?.id ?? '')
  const [payMethod, setPayMethod] = useState<'credit' | 'pix'>('credit')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayStr())
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const limitsMap = Object.fromEntries(catLimits.map(cl => [cl.category_id, cl.limit_amount]))

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = parseFloat(amount.replace(',', '.'))
    if (!val || val <= 0) { showToast('⚠️ Informe um valor válido'); return }
    if (!date) { showToast('⚠️ Informe a data'); return }

    setLoading(true)
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id: selCat, amount: val, description, date, pay_method: payMethod }),
    })

    if (!res.ok) {
      showToast('⚠️ Erro ao salvar gasto')
      setLoading(false)
      return
    }

    // Feedback de limite
    const catLimit = limitsMap[selCat] || 0
    const cat = categories.find(c => c.id === selCat)
    let msg = '✅ Gasto registrado!'
    if (catLimit > 0) {
      // We can't know total without fetching, just show success
    }
    showToast(msg)
    setAmount('')
    setDescription('')
    setPayMethod('credit')
    setLoading(false)

    setTimeout(() => router.push('/'), 800)
    router.refresh()
  }

  return (
    <AppShell title="Novo Gasto">
      <form onSubmit={handleSubmit}>
        {/* Valor */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>
            Valor
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0,00"
            step="0.01"
            min="0"
            autoFocus
            style={{
              width: '100%', background: 'var(--card2)', border: '2px solid var(--border)',
              borderRadius: 16, padding: '18px', color: 'var(--text)',
              fontSize: 30, fontWeight: 800, textAlign: 'center', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Categoria */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>
            Categoria
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelCat(cat.id)}
                style={{
                  background: selCat === cat.id ? 'rgba(15,61,62,.09)' : 'var(--card)',
                  border: `2px solid ${selCat === cat.id ? '#0F3D3E' : 'var(--border)'}`,
                  borderRadius: 12, padding: '9px 4px', textAlign: 'center', cursor: 'pointer',
                  transition: 'all .18s'
                }}
              >
                <span style={{ fontSize: 21, display: 'block' }}>{cat.emoji}</span>
                <span style={{ fontSize: 8, color: selCat === cat.id ? '#0F3D3E' : 'var(--muted)', marginTop: 3, display: 'block', lineHeight: 1.2 }}>
                  {cat.name.length > 7 ? cat.name.slice(0, 7) + '…' : cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Forma de pagamento */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>
            Forma de pagamento
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setPayMethod('credit')}
              style={{
                background: payMethod === 'credit' ? 'rgba(15,61,62,.08)' : 'var(--card)',
                border: `2px solid ${payMethod === 'credit' ? '#0F3D3E' : 'var(--border)'}`,
                borderRadius: 13, padding: '12px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .18s'
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={payMethod === 'credit' ? '#0F3D3E' : 'var(--muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: payMethod === 'credit' ? '#0F3D3E' : 'var(--muted)' }}>Crédito</span>
            </button>
            <button
              type="button"
              onClick={() => setPayMethod('pix')}
              style={{
                background: payMethod === 'pix' ? 'rgba(212,163,115,.12)' : 'var(--card)',
                border: `2px solid ${payMethod === 'pix' ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 13, padding: '12px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .18s'
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={payMethod === 'pix' ? 'var(--gold)' : 'var(--muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: payMethod === 'pix' ? '#9A6728' : 'var(--muted)' }}>PIX / Débito</span>
            </button>
          </div>
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>
            Descrição (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ex: Carrefour, iFood..."
            maxLength={60}
            style={{
              width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)',
              borderRadius: 13, padding: '13px 15px', color: 'var(--text)', fontSize: 16, outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Data */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{
              width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)',
              borderRadius: 13, padding: '13px 15px', color: 'var(--text)', fontSize: 16, outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: 15, borderRadius: 13, border: 'none',
            background: 'var(--accent)', color: '#FAF7F0', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            transition: 'opacity .2s'
          }}
        >
          {loading ? 'Salvando...' : 'Registrar Gasto'}
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: '#fff', padding: '10px 20px', borderRadius: 100,
          fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,.3)', animation: 'fi .2s ease'
        }}>
          {toast}
        </div>
      )}
    </AppShell>
  )
}
