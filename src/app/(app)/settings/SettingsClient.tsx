'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCycle } from '@/lib/cycle'
import type { Category, Settings, CategoryLimit } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/AppShell'
import CategoryIcon from '@/components/CategoryIcon'
import { CATEGORY_ICONS } from '@/lib/categoryIcons'

interface Props {
  settings: Settings
  categories: Category[]
  catLimits: CategoryLimit[]
  userEmail: string
}

const PRESET_COLORS = [
  // Verdes
  { color: '#0F3D3E', bg: 'rgba(15,61,62,.15)' },
  { color: '#2E7D32', bg: 'rgba(46,125,50,.15)' },
  { color: '#1B5E20', bg: 'rgba(27,94,32,.15)' },
  { color: '#00695C', bg: 'rgba(0,105,92,.15)' },
  // Azuis
  { color: '#0277BD', bg: 'rgba(2,119,189,.15)' },
  { color: '#1E5FA8', bg: 'rgba(30,95,168,.15)' },
  { color: '#283593', bg: 'rgba(40,53,147,.15)' },
  { color: '#00838F', bg: 'rgba(0,131,143,.15)' },
  // Roxos e rosas
  { color: '#6A1B9A', bg: 'rgba(106,27,154,.15)' },
  { color: '#6D3A8E', bg: 'rgba(109,58,142,.15)' },
  { color: '#880E4F', bg: 'rgba(136,14,79,.15)' },
  { color: '#AD1457', bg: 'rgba(173,20,87,.15)' },
  // Vermelhos e laranjas
  { color: '#C62828', bg: 'rgba(198,40,40,.15)' },
  { color: '#B5384A', bg: 'rgba(181,56,74,.15)' },
  { color: '#E65100', bg: 'rgba(230,81,0,.15)' },
  { color: '#BF360C', bg: 'rgba(191,54,12,.15)' },
]

export default function SettingsClient({ settings, categories, catLimits, userEmail }: Props) {
  const router = useRouter()
  const [cycleMode, setCycleMode] = useState<'standard' | 'invoice'>(settings.cycle_mode)
  const [invoiceDay, setInvoiceDay] = useState(String(settings.invoice_day || 1))
  const [monthlyLimit, setMonthlyLimit] = useState(settings.monthly_limit ? String(settings.monthly_limit) : '')
  const [catLimitMap, setCatLimitMap] = useState<Record<string, string>>(
    Object.fromEntries(catLimits.map(cl => [cl.category_id, String(cl.limit_amount)]))
  )
  const [sheetsUrl, setSheetsUrl] = useState(settings.sheets_url ?? '')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [ncEmoji, setNcEmoji] = useState(CATEGORY_ICONS[0].id)
  const [ncColor, setNcColor] = useState(PRESET_COLORS[0])
  const [ncName, setNcName] = useState('')
  const [cats, setCats] = useState(categories)

  const supabase = createClient()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const invoiceDayNum = Math.max(1, Math.min(28, parseInt(invoiceDay) || 1))
  const previewCycle = getCycle(cycleMode, invoiceDayNum, 0)

  async function saveSettings() {
    setSaving(true)
    const limits: Record<string, number> = {}
    cats.forEach(c => {
      const v = parseFloat(catLimitMap[c.id] || '0') || 0
      if (v > 0) limits[c.id] = v
    })

    await Promise.all([
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_limit: parseFloat(monthlyLimit) || 0,
          cycle_mode: cycleMode,
          invoice_day: invoiceDayNum,
          sheets_url: sheetsUrl.trim() || null,
        }),
      }),
      fetch('/api/category-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limits }),
      }),
    ])

    setSaving(false)
    showToast('✅ Configurações salvas!')
    router.refresh()
  }

  async function createCat() {
    if (!ncName.trim()) { showToast('⚠️ Informe o nome'); return }
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: ncName.trim(), emoji: ncEmoji, color: ncColor.color, bg: ncColor.bg }),
    })
    if (res.ok) {
      const { category } = await res.json()
      setCats(prev => [...prev, category])
      setShowModal(false)
      setNcName('')
      showToast(`✅ Categoria "${ncName}" criada!`)
    }
  }

  async function deleteCat(id: string, name: string) {
    if (!confirm(`Excluir a categoria "${name}"?`)) return
    const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCats(prev => prev.filter(c => c.id !== id))
      showToast('Categoria removida')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <AppShell title="Configurações">
      <div>

        {/* Ciclo de contabilidade */}
        <SectionTitle>Ciclo de Contabilidade</SectionTitle>
        <div style={{ marginBottom: 8 }}>
          {(['standard', 'invoice'] as const).map(mode => (
            <div
              key={mode}
              onClick={() => setCycleMode(mode)}
              style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: 14, borderRadius: 14,
                border: `2px solid ${cycleMode === mode ? '#0F3D3E' : 'var(--border)'}`,
                cursor: 'pointer', transition: 'all .2s', marginBottom: 8,
                background: cycleMode === mode ? 'rgba(15,61,62,.06)' : 'var(--card2)'
              }}
            >
              <span style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mode === 'standard' ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="17" rx="2" stroke={cycleMode === mode ? 'var(--accent)' : 'var(--muted)'} strokeWidth="1.8"/>
                    <path d="M3 9H21" stroke={cycleMode === mode ? 'var(--accent)' : 'var(--muted)'} strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M8 2V5M16 2V5" stroke={cycleMode === mode ? 'var(--accent)' : 'var(--muted)'} strokeWidth="1.8" strokeLinecap="round"/>
                    <rect x="7" y="13" width="3" height="3" rx="0.5" fill={cycleMode === mode ? 'var(--accent)' : 'var(--muted)'}/>
                    <rect x="12" y="13" width="3" height="3" rx="0.5" fill={cycleMode === mode ? 'var(--accent)' : 'var(--muted)'}/>
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.39211 16.4805C9.39211 16.6462 9.52643 16.7805 9.69211 16.7805H18.6726C18.8381 16.7805 18.9723 16.9145 18.9726 17.08L18.9738 17.8108H8.18127C7.76727 17.8108 7.43127 18.1468 7.43127 18.5608C7.43127 18.9748 7.76727 19.3108 8.18127 19.3108H18.9763L18.9771 19.8085C18.9761 20.0515 18.7751 20.2505 18.5281 20.2505H7.32611C6.36811 20.2505 5.58911 19.4695 5.58911 18.5095C5.58911 17.5555 6.36811 16.7805 7.32611 16.7805H7.59211C7.7578 16.7805 7.89211 16.6462 7.89211 16.4805V2.55C7.89211 2.38431 7.7578 2.25 7.59211 2.25H7.43033C5.58833 2.25 4.08932 3.748 4.08932 5.59V18.4721C4.08911 20.2975 5.54111 21.7505 7.32611 21.7505H18.5281C19.5991 21.7505 20.4741 20.8815 20.4771 19.8095L20.4701 16.0476V4.2C20.4703 3.125 19.5963 2.25 18.5213 2.25H9.69211C9.52643 2.25 9.39211 2.38431 9.39211 2.55V16.4805Z" fill={cycleMode === mode ? 'var(--accent)' : 'var(--muted)'}/>
                  </svg>
                )}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{mode === 'standard' ? 'Mês Corrido' : 'Ciclo de Fatura'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>
                  {mode === 'standard' ? 'Do dia 1 ao último dia do mês' : 'A partir de um dia fixo configurável'}
                </div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                background: cycleMode === mode ? '#0F3D3E' : 'transparent',
                border: `2px solid ${cycleMode === mode ? '#0F3D3E' : 'var(--border)'}`,
                color: '#fff'
              }}>
                {cycleMode === mode ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>

        {cycleMode === 'invoice' && (
          <div style={{ background: 'var(--card2)', borderRadius: 12, padding: 14, marginBottom: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--muted)' }}>Dia de abertura da fatura</span>
              <input
                type="number"
                value={invoiceDay}
                onChange={e => setInvoiceDay(e.target.value)}
                onBlur={e => {
                  const v = Math.max(1, Math.min(28, parseInt(e.target.value) || 1))
                  setInvoiceDay(String(v))
                }}
                min={1} max={28}
                style={{
                  background: 'var(--card)', border: '2px solid #0F3D3E', borderRadius: 10,
                  padding: '9px 14px', color: 'var(--text)', fontSize: 18, fontWeight: 800,
                  width: 70, textAlign: 'center', outline: 'none'
                }}
              />
            </div>
            <div style={{ background: 'rgba(15,61,62,.06)', border: '1px solid rgba(15,61,62,.2)', borderRadius: 10, padding: '10px 13px', fontSize: 12, color: '#0F3D3E', fontWeight: 600, textAlign: 'center' }}>
              Ciclo atual: {previewCycle.startStr.split('-')[2]}/{previewCycle.startStr.split('-')[1]} – {previewCycle.endStr.split('-')[2]}/{previewCycle.endStr.split('-')[1]}
            </div>
          </div>
        )}

        {/* Orçamento */}
        <SectionTitle>Orçamento Mensal</SectionTitle>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '4px 16px', marginBottom: 20, border: '1px solid rgba(15,61,62,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Limite total do ciclo</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Valor máximo por período</div>
            </div>
            <input
              type="number"
              value={monthlyLimit}
              onChange={e => setMonthlyLimit(e.target.value)}
              placeholder="R$"
              min="0"
              style={{
                background: 'var(--card2)', border: '1.5px solid var(--border)', borderRadius: 10,
                padding: '9px 12px', color: 'var(--text)', fontSize: 14, fontWeight: 700,
                width: 115, textAlign: 'right', outline: 'none'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Limites por categoria */}
        <SectionTitle>Limites por Categoria</SectionTitle>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '4px 16px', marginBottom: 20, border: '1px solid rgba(15,61,62,.08)' }}>
          {cats.map((cat, i) => (
            <div key={cat.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: i < cats.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: cat.bg }}>
                  <CategoryIcon emoji={cat.emoji} color={cat.color} size={16} />
                </span>
                {cat.name}
              </div>
              <input
                type="number"
                value={catLimitMap[cat.id] ?? ''}
                onChange={e => setCatLimitMap(prev => ({ ...prev, [cat.id]: e.target.value }))}
                placeholder="R$"
                min="0"
                style={{
                  background: 'var(--card2)', border: '1.5px solid var(--border)', borderRadius: 10,
                  padding: '9px 12px', color: 'var(--text)', fontSize: 14, fontWeight: 700,
                  width: 115, textAlign: 'right', outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}
        </div>

        {/* Categorias personalizadas */}
        <SectionTitle>Categorias</SectionTitle>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '4px 16px', marginBottom: 12, border: '1px solid rgba(15,61,62,.08)' }}>
          {cats.map((cat, i) => (
            <div key={cat.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
              borderBottom: i < cats.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: cat.bg }}>
                <CategoryIcon emoji={cat.emoji} color={cat.color} size={20} />
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{cat.name}</div>
              {cat.is_default
                ? <span style={{ fontSize: 9, background: 'rgba(15,61,62,.1)', color: '#0F3D3E', padding: '2px 7px', borderRadius: 100, fontWeight: 700 }}>Padrão</span>
                : <button onClick={() => deleteCat(cat.id, cat.name)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 4, borderRadius: 6 }}>✕</button>
              }
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ width: '100%', padding: 13, borderRadius: 13, border: '1.5px solid var(--border)', background: 'var(--card2)', color: 'var(--muted)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}
        >
          + Nova Categoria
        </button>

        {/* Google Sheets */}
        <SectionTitle>Google Sheets</SectionTitle>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '4px 16px', marginBottom: 20, border: '1px solid rgba(15,61,62,.08)' }}>
          <div style={{ padding: '12px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>URL do Apps Script</div>
            <input
              type="url"
              value={sheetsUrl}
              onChange={e => setSheetsUrl(e.target.value)}
              placeholder="https://script.google.com/..."
              style={{
                width: '100%', background: 'var(--card2)', border: '1.5px solid var(--border)',
                borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Salvar */}
        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            width: '100%', padding: 15, borderRadius: 13, border: 'none',
            background: 'var(--accent)', color: '#FAF7F0', fontSize: 15, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, marginBottom: 12
          }}
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>

        {/* Conta */}
        <SectionTitle>Conta</SectionTitle>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '12px 16px', marginBottom: 12, border: '1px solid rgba(15,61,62,.08)', fontSize: 13, color: 'var(--muted)' }}>
          {userEmail}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: 13, borderRadius: 13, border: '1px solid rgba(185,28,28,.2)',
            background: 'rgba(185,28,28,.08)', color: '#991B1B', fontSize: 14, fontWeight: 700, cursor: 'pointer'
          }}
        >
          Sair da conta
        </button>
      </div>

      {/* Modal nova categoria */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div style={{ background: '#FAF7F0', borderRadius: '22px 22px 0 0', padding: 20, width: '100%', maxWidth: 480, maxHeight: '88vh', overflowY: 'auto', border: '1px solid var(--border)', borderBottom: 'none' }}>
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 100, margin: '0 auto 16px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, textAlign: 'center' }}>Nova Categoria</div>

            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Ícone</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 14 }}>
              {CATEGORY_ICONS.map(icon => {
                const selected = ncEmoji === icon.id
                return (
                  <button key={icon.id} type="button" onClick={() => setNcEmoji(icon.id)} title={icon.label} style={{
                    background: selected ? ncColor.bg : 'var(--card2)',
                    border: `2px solid ${selected ? ncColor.color : 'var(--border)'}`,
                    borderRadius: 12, padding: '10px 6px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all .15s'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {icon.svg(selected ? ncColor.color : 'var(--muted)')}
                    </span>
                    <span style={{ fontSize: 8, color: selected ? ncColor.color : 'var(--muted)', lineHeight: 1.2, textAlign: 'center' }}>
                      {icon.label.length > 10 ? icon.label.slice(0, 10) + '…' : icon.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Cor</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {PRESET_COLORS.map((c, i) => (
                <div key={i} onClick={() => setNcColor(c)} style={{
                  width: 34, height: 34, borderRadius: 10, background: c.color, cursor: 'pointer', flexShrink: 0,
                  border: `3px solid ${ncColor.color === c.color ? '#222' : 'transparent'}`,
                  transform: ncColor.color === c.color ? 'scale(1.12)' : 'none',
                  transition: 'all .15s'
                }} />
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Nome</div>
            <input
              type="text"
              value={ncName}
              onChange={e => setNcName(e.target.value)}
              placeholder="Ex: Academia"
              maxLength={20}
              style={{
                width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)',
                borderRadius: 13, padding: '13px 15px', color: 'var(--text)', fontSize: 16, outline: 'none', marginBottom: 14
              }}
            />

            <button onClick={createCat} style={{
              width: '100%', padding: 15, borderRadius: 13, border: 'none',
              background: 'var(--accent)', color: '#FAF7F0', fontSize: 15, fontWeight: 700, cursor: 'pointer'
            }}>Criar Categoria</button>
            <button onClick={() => setShowModal(false)} style={{
              width: '100%', padding: 13, borderRadius: 13, border: '1px solid var(--border)',
              background: 'var(--card2)', color: 'var(--muted)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8
            }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: '#fff', padding: '10px 20px', borderRadius: 100,
          fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,.3)'
        }}>
          {toast}
        </div>
      )}
    </AppShell>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', margin: '0 0 9px' }}>
      {children}
    </div>
  )
}
