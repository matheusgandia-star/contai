'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Settings, CategoryLimit } from '@/lib/types'
import { getCycle, brl } from '@/lib/cycle'
import AppShell from '@/components/AppShell'
import CategoryIcon from '@/components/CategoryIcon'
import { parseExpense, type ParsedExpense } from '@/lib/parseExpense'

interface Props {
  categories: Category[]
  settings: Settings
  catLimits: CategoryLimit[]
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// ─── Manual form ──────────────────────────────────────────────────────────────

function ManualForm({ categories, catLimits }: { categories: Category[], catLimits: CategoryLimit[] }) {
  const router = useRouter()
  const [selCat, setSelCat] = useState(categories[0]?.id ?? '')
  const [payMethod, setPayMethod] = useState<'credit' | 'pix'>('credit')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayStr())
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = parseFloat(amount.replace(',', '.'))
    if (!val || val <= 0) { showToast('Informe um valor válido'); return }
    if (!date) { showToast('Informe a data'); return }

    setLoading(true)
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id: selCat, amount: val, description, date, pay_method: payMethod }),
    })

    if (!res.ok) { showToast('Erro ao salvar gasto'); setLoading(false); return }

    showToast('Gasto registrado!')
    setAmount(''); setDescription(''); setPayMethod('credit')
    setLoading(false)
    setTimeout(() => router.push('/'), 800)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Valor</label>
        <input
          type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="0,00" step="0.01" min="0" autoFocus
          style={{ width: '100%', background: 'var(--card2)', border: '2px solid var(--border)', borderRadius: 16, padding: '18px', color: 'var(--text)', fontSize: 30, fontWeight: 800, textAlign: 'center', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Categoria</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7 }}>
          {categories.map(cat => (
            <button key={cat.id} type="button" onClick={() => setSelCat(cat.id)} style={{
              background: selCat === cat.id ? 'rgba(15,61,62,.09)' : 'var(--card)',
              border: `2px solid ${selCat === cat.id ? '#0F3D3E' : 'var(--border)'}`,
              borderRadius: 12, padding: '9px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all .18s'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 28 }}>
                <CategoryIcon emoji={cat.emoji} color={selCat === cat.id ? cat.color : 'var(--muted)'} size={22} />
              </span>
              <span style={{ fontSize: 8, color: selCat === cat.id ? '#0F3D3E' : 'var(--muted)', marginTop: 3, display: 'block', lineHeight: 1.2 }}>
                {cat.name.length > 7 ? cat.name.slice(0, 7) + '…' : cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Forma de pagamento</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button type="button" onClick={() => setPayMethod('credit')} style={{
            background: payMethod === 'credit' ? 'rgba(15,61,62,.08)' : 'var(--card)',
            border: `2px solid ${payMethod === 'credit' ? '#0F3D3E' : 'var(--border)'}`,
            borderRadius: 13, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .18s'
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={payMethod === 'credit' ? '#0F3D3E' : 'var(--muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: payMethod === 'credit' ? '#0F3D3E' : 'var(--muted)' }}>Crédito</span>
          </button>
          <button type="button" onClick={() => setPayMethod('pix')} style={{
            background: payMethod === 'pix' ? 'rgba(212,163,115,.12)' : 'var(--card)',
            border: `2px solid ${payMethod === 'pix' ? 'var(--gold)' : 'var(--border)'}`,
            borderRadius: 13, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .18s'
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={payMethod === 'pix' ? 'var(--gold)' : 'var(--muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: payMethod === 'pix' ? '#9A6728' : 'var(--muted)' }}>PIX / Débito</span>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Descrição (opcional)</label>
        <input
          type="text" value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Ex: Carrefour, iFood..." maxLength={60}
          style={{ width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 13, padding: '13px 15px', color: 'var(--text)', fontSize: 16, outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 8 }}>Data</label>
        <input
          type="date" value={date} onChange={e => setDate(e.target.value)} required
          style={{ width: '100%', background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 13, padding: '13px 15px', color: 'var(--text)', fontSize: 16, outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <button type="submit" disabled={loading} style={{
        width: '100%', padding: 15, borderRadius: 13, border: 'none',
        background: 'var(--accent)', color: '#FAF7F0', fontSize: 15, fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity .2s'
      }}>
        {loading ? 'Salvando...' : 'Registrar Gasto'}
      </button>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: '#fff', padding: '10px 20px', borderRadius: 100,
          fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,.3)'
        }}>{toast}</div>
      )}
    </form>
  )
}

// ─── Chat form ────────────────────────────────────────────────────────────────

type ChatMsg = { role: 'user' | 'assistant'; text: string }
type Step = 'idle' | 'confirm' | 'saving' | 'done'

function ChatForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', text: 'Olá! Me conta qual foi seu gasto. Exemplo: "gastei 45 no mercado" ou "pizza 32 reais".' }
  ])
  const [parsed, setParsed] = useState<ParsedExpense | null>(null)
  const [step, setStep] = useState<Step>('idle')
  const [listening, setListening] = useState(false)
  const [payMethod, setPayMethod] = useState<'credit' | 'pix'>('credit')
  const recognitionRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, step])

  function addMsg(role: ChatMsg['role'], text: string) {
    setMessages(prev => [...prev, { role, text }])
  }

  function handleSend(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')

    addMsg('user', msg)

    const result = parseExpense(msg, categories)
    if (!result) {
      addMsg('assistant', 'Não consegui identificar o valor. Tente algo como "gastei 50 em uber" ou "farmácia 28,90".')
      return
    }

    setParsed(result)
    setStep('confirm')
    const cat = categories.find(c => c.id === result.category_id)
    const conf = result.confidence === 'high' ? '' : ' (confirme a categoria)'
    addMsg('assistant', `Entendi! ${brl(result.amount)} em **${cat?.name ?? result.category_id}**${conf}. Confira abaixo e salve.`)
  }

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      addMsg('assistant', 'Seu navegador não suporta reconhecimento de voz. Use a digitação.')
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'pt-BR'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setListening(false)
      handleSend(transcript)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  async function confirmSave() {
    if (!parsed) return
    setStep('saving')
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: parsed.category_id,
        amount: parsed.amount,
        description: parsed.description,
        date: todayStr(),
        pay_method: payMethod,
      }),
    })
    if (!res.ok) {
      setStep('confirm')
      addMsg('assistant', 'Erro ao salvar. Tente novamente.')
      return
    }
    setStep('done')
    addMsg('assistant', `Gasto de ${brl(parsed.amount)} registrado com sucesso!`)
    router.refresh()
    setTimeout(() => router.push('/'), 1200)
  }

  function cancelConfirm() {
    setStep('idle')
    setParsed(null)
    addMsg('assistant', 'Ok, me conta o gasto novamente se quiser.')
  }

  function changeCat(id: string) {
    if (!parsed) return
    setParsed({ ...parsed, category_id: id })
  }

  const confirmCat = parsed ? categories.find(c => c.id === parsed.category_id) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Bolhas de chat */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, minHeight: 120 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '82%',
              background: m.role === 'user' ? '#0F3D3E' : 'var(--card)',
              color: m.role === 'user' ? '#FAF7F0' : 'var(--text)',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '10px 14px',
              fontSize: 14,
              lineHeight: 1.45,
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,.06)',
            }}>
              {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
            </div>
          </div>
        ))}

        {/* Card de confirmação */}
        {(step === 'confirm' || step === 'saving') && parsed && (
          <div style={{
            background: 'var(--card)', borderRadius: 16, padding: 14,
            border: '1.5px solid var(--accent)', boxShadow: '0 2px 12px rgba(15,61,62,.10)'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
              Confirmar gasto
            </div>

            {/* Valor */}
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', marginBottom: 12, textAlign: 'center' }}>
              {brl(parsed.amount)}
            </div>

            {/* Categoria selecionada */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Categoria</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
                {categories.map(cat => (
                  <button key={cat.id} type="button" onClick={() => changeCat(cat.id)} style={{
                    background: parsed.category_id === cat.id ? 'rgba(15,61,62,.09)' : 'var(--bg)',
                    border: `2px solid ${parsed.category_id === cat.id ? '#0F3D3E' : 'transparent'}`,
                    borderRadius: 10, padding: '7px 3px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24 }}>
                      <CategoryIcon emoji={cat.emoji} color={parsed.category_id === cat.id ? cat.color : 'var(--muted)'} size={18} />
                    </span>
                    <span style={{ fontSize: 7.5, color: parsed.category_id === cat.id ? '#0F3D3E' : 'var(--muted)', marginTop: 2, display: 'block', lineHeight: 1.2 }}>
                      {cat.name.length > 7 ? cat.name.slice(0, 7) + '…' : cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Forma de pagamento */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Pagamento</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {(['credit', 'pix'] as const).map(pm => (
                  <button key={pm} type="button" onClick={() => setPayMethod(pm)} style={{
                    background: payMethod === pm ? (pm === 'credit' ? 'rgba(15,61,62,.08)' : 'rgba(212,163,115,.12)') : 'var(--bg)',
                    border: `1.5px solid ${payMethod === pm ? (pm === 'credit' ? '#0F3D3E' : 'var(--gold)') : 'var(--border)'}`,
                    borderRadius: 10, padding: '9px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    color: payMethod === pm ? (pm === 'credit' ? '#0F3D3E' : '#9A6728') : 'var(--muted)', transition: 'all .15s'
                  }}>
                    {pm === 'credit' ? 'Crédito' : 'PIX / Débito'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
              <button type="button" onClick={cancelConfirm} disabled={step === 'saving'} style={{
                padding: '11px', borderRadius: 10, border: '1.5px solid var(--border)',
                background: 'var(--bg)', color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>Cancelar</button>
              <button type="button" onClick={confirmSave} disabled={step === 'saving'} style={{
                padding: '11px', borderRadius: 10, border: 'none',
                background: 'var(--accent)', color: '#FAF7F0', fontSize: 13, fontWeight: 700,
                cursor: step === 'saving' ? 'not-allowed' : 'pointer', opacity: step === 'saving' ? 0.7 : 1
              }}>
                {step === 'saving' ? 'Salvando...' : 'Confirmar e Salvar'}
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input de texto + microfone */}
      {step === 'idle' && (
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: 'var(--card)', borderRadius: 16,
          border: '1.5px solid var(--border)', padding: '8px 8px 8px 14px',
          boxShadow: '0 2px 8px rgba(15,61,62,.06)'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Ex: gastei 50 em pizza..."
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              resize: 'none', fontSize: 15, color: 'var(--text)', lineHeight: 1.4,
              fontFamily: 'inherit', padding: '4px 0', minHeight: 28, maxHeight: 80,
              overflowY: 'auto'
            }}
          />
          {/* Mic button */}
          <button
            type="button"
            onPointerDown={startListening}
            onPointerUp={stopListening}
            style={{
              width: 40, height: 40, borderRadius: 12, border: 'none', flexShrink: 0,
              background: listening ? '#C62828' : 'rgba(15,61,62,.08)',
              color: listening ? '#fff' : '#0F3D3E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s',
              boxShadow: listening ? '0 0 0 4px rgba(198,40,40,.2)' : 'none'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            </svg>
          </button>
          {/* Send button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            style={{
              width: 40, height: 40, borderRadius: 12, border: 'none', flexShrink: 0,
              background: input.trim() ? '#0F3D3E' : 'rgba(15,61,62,.08)',
              color: input.trim() ? '#FAF7F0' : 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'default', transition: 'all .2s'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      )}

      {listening && (
        <div style={{
          textAlign: 'center', marginTop: 10, fontSize: 13, color: '#C62828', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C62828', display: 'inline-block', animation: 'pulse 1s infinite' }} />
          Ouvindo... solte para enviar
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AddExpenseClient({ categories, settings, catLimits }: Props) {
  const [mode, setMode] = useState<'manual' | 'chat'>('manual')

  return (
    <AppShell title="Novo Gasto">
      {/* Toggle manual / chat */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5,
        background: 'var(--card2)', borderRadius: 14, padding: 4, marginBottom: 20,
        border: '1px solid var(--border)'
      }}>
        {(['manual', 'chat'] as const).map(m => (
          <button key={m} type="button" onClick={() => setMode(m)} style={{
            padding: '9px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700,
            background: mode === m ? 'var(--accent)' : 'transparent',
            color: mode === m ? '#FAF7F0' : 'var(--muted)',
            cursor: 'pointer', transition: 'all .2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            {m === 'manual' ? (
              <>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Manual
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                Chat
              </>
            )}
          </button>
        ))}
      </div>

      {mode === 'manual'
        ? <ManualForm categories={categories} catLimits={catLimits} />
        : <ChatForm categories={categories} />
      }
    </AppShell>
  )
}
