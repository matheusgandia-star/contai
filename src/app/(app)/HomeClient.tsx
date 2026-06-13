'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Settings, Expense } from '@/lib/types'
import { brl, getCycle } from '@/lib/cycle'
import CategoryIcon from '@/components/CategoryIcon'
import AppShell from '@/components/AppShell'
import { parseExpense, type ParsedExpense } from '@/lib/parseExpense'

interface Props {
  categories: Category[]
  settings: Settings
  expenses: Expense[]
}

type ChatMsg = { role: 'user' | 'assistant'; text: string }
type Step = 'idle' | 'saving' | 'adjust'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const ADJUST_KEYWORDS = ['ajust', 'corrig', 'muda', 'troc', 'errou', 'errad', 'errei', 'wrong', 'incorret', 'não é', 'nao e', 'diferente']

function isAdjustRequest(text: string) {
  const n = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return ADJUST_KEYWORDS.some(k => n.includes(k))
}

export default function HomeClient({ categories, settings, expenses }: Props) {
  const router = useRouter()
  const cycle = getCycle(settings.cycle_mode, settings.invoice_day, 0)
  const cycleExps = expenses.filter(e => e.date >= cycle.startStr && e.date <= cycle.endStr)
  const spent = cycleExps.reduce((s, e) => s + e.amount, 0)
  const lim = settings.monthly_limit || 0
  const rest = lim - spent

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    if (typeof window === 'undefined') return [{ role: 'assistant', text: 'Olá! Me conta qual foi seu gasto e eu registro na hora. Pode digitar ou usar o microfone.' }]
    try {
      const saved = localStorage.getItem('contai_chat')
      if (saved) return JSON.parse(saved) as ChatMsg[]
    } catch {}
    return [{ role: 'assistant', text: 'Olá! Me conta qual foi seu gasto e eu registro na hora. Pode digitar ou usar o microfone.' }]
  })
  const [lastParsed, setLastParsed] = useState<ParsedExpense | null>(null)
  const [adjustParsed, setAdjustParsed] = useState<ParsedExpense | null>(null)
  const [adjustPayMethod, setAdjustPayMethod] = useState<'credit' | 'pix'>('credit')
  const [step, setStep] = useState<Step>('idle')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, step])

  useEffect(() => {
    try { localStorage.setItem('contai_chat', JSON.stringify(messages)) } catch {}
  }, [messages])

  function addMsg(role: ChatMsg['role'], text: string) {
    setMessages(prev => [...prev, { role, text }])
  }

  async function autoSave(result: ParsedExpense, payMethod: 'credit' | 'pix' = 'credit') {
    const cat = categories.find(c => c.id === result.category_id)
    setStep('saving')
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: result.category_id,
        amount: result.amount,
        description: result.description,
        date: todayStr(),
        pay_method: payMethod,
      }),
    })
    if (!res.ok) {
      setStep('idle')
      addMsg('assistant', 'Erro ao salvar o gasto. Tente novamente.')
      return
    }
    setLastParsed(result)
    setStep('idle')
    router.refresh()
    addMsg('assistant',
      `Registrei ${brl(result.amount)} em ${cat?.name ?? 'categoria'}. ` +
      `Se quiser ajustar categoria ou pagamento, é só pedir.`
    )
  }

  function handleSend(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    addMsg('user', msg)

    // Check if user is requesting an adjustment on the last expense
    if (isAdjustRequest(msg) && lastParsed) {
      setAdjustParsed({ ...lastParsed })
      setAdjustPayMethod('credit')
      setStep('adjust')
      addMsg('assistant', 'Claro! Ajuste abaixo o que precisar e confirme.')
      return
    }

    // Otherwise try to parse as a new expense
    const result = parseExpense(msg, categories)
    if (!result) {
      addMsg('assistant', 'Não consegui identificar o valor. Tente: "gastei 50 em pizza" ou "uber 25 reais".')
      return
    }

    autoSave(result)
  }

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      addMsg('assistant', 'Seu navegador não suporta reconhecimento de voz. Digite o gasto.')
      return
    }
    const rec = new SR()
    rec.lang = 'pt-BR'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e: any) => { setListening(false); handleSend(e.results[0][0].transcript) }
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

  async function confirmAdjust() {
    if (!adjustParsed) return
    // Delete old expense isn't possible without its ID here, so just save new corrected one
    await autoSave(adjustParsed, adjustPayMethod)
    setAdjustParsed(null)
    setStep('idle')
  }

  function cancelAdjust() {
    setAdjustParsed(null)
    setStep('idle')
    addMsg('assistant', 'Ok, mantive o registro original.')
  }

  const busy = step === 'saving' || step === 'adjust'

  const headerRight = (
    <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
      {lim > 0 && (
        <>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Restante</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: rest < 0 ? '#FCA5A5' : '#FAF7F0' }}>
            {rest >= 0 ? brl(rest) : '−' + brl(Math.abs(rest))}
          </div>
        </>
      )}
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{cycle.label}</div>
    </div>
  )

  return (
    <AppShell right={headerRight} noPadding>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 52px)' }}>

        {/* Chat area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28, borderRadius: 10, background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginRight: 8, alignSelf: 'flex-end',
                }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#FAF7F0">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
              )}
              <div style={{
                maxWidth: '76%',
                background: m.role === 'user' ? '#0F3D3E' : 'var(--card)',
                color: m.role === 'user' ? '#FAF7F0' : 'var(--text)',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                boxShadow: '0 1px 6px rgba(0,0,0,.07)',
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Saving indicator */}
          {step === 'saving' && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '18px 18px 18px 4px', padding: '10px 16px',
                fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                Registrando…
              </div>
            </div>
          )}

          {/* Adjust panel */}
          {step === 'adjust' && adjustParsed && (
            <div style={{
              background: 'var(--card)', borderRadius: 18, padding: 16,
              border: '2px solid var(--accent)', boxShadow: '0 4px 20px rgba(15,61,62,.12)', marginTop: 4,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>
                Ajustar gasto
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)', textAlign: 'center', marginBottom: 14, letterSpacing: -1 }}>
                {brl(adjustParsed.amount)}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 7 }}>Categoria</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
                  {categories.map(cat => (
                    <button key={cat.id} type="button"
                      onClick={() => setAdjustParsed(p => p ? { ...p, category_id: cat.id } : p)}
                      style={{
                        background: adjustParsed.category_id === cat.id ? 'rgba(15,61,62,.09)' : 'var(--bg)',
                        border: `2px solid ${adjustParsed.category_id === cat.id ? '#0F3D3E' : 'transparent'}`,
                        borderRadius: 10, padding: '7px 3px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s'
                      }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 22 }}>
                        <CategoryIcon emoji={cat.emoji} color={adjustParsed.category_id === cat.id ? cat.color : 'var(--muted)'} size={17} />
                      </span>
                      <span style={{ fontSize: 7.5, color: adjustParsed.category_id === cat.id ? '#0F3D3E' : 'var(--muted)', marginTop: 2, display: 'block', lineHeight: 1.2 }}>
                        {cat.name.length > 7 ? cat.name.slice(0, 7) + '…' : cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 7 }}>Pagamento</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {(['credit', 'pix'] as const).map(pm => (
                    <button key={pm} type="button" onClick={() => setAdjustPayMethod(pm)} style={{
                      padding: '10px', borderRadius: 10,
                      border: `1.5px solid ${adjustPayMethod === pm ? (pm === 'credit' ? '#0F3D3E' : 'var(--gold)') : 'var(--border)'}`,
                      background: adjustPayMethod === pm ? (pm === 'credit' ? 'rgba(15,61,62,.08)' : 'rgba(212,163,115,.12)') : 'var(--bg)',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
                      color: adjustPayMethod === pm ? (pm === 'credit' ? '#0F3D3E' : '#9A6728') : 'var(--muted)',
                    }}>
                      {pm === 'credit' ? 'Crédito' : 'PIX / Débito'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                <button type="button" onClick={cancelAdjust} style={{
                  padding: '12px', borderRadius: 11, border: '1.5px solid var(--border)',
                  background: 'var(--bg)', color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>Cancelar</button>
                <button type="button" onClick={confirmAdjust} style={{
                  padding: '12px', borderRadius: 11, border: 'none',
                  background: 'var(--accent)', color: '#FAF7F0', fontSize: 14, fontWeight: 700, cursor: 'pointer'
                }}>Confirmar ajuste</button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: '10px 12px',
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          background: 'var(--bg)', borderTop: '1px solid var(--border)', marginBottom: 56,
        }}>
          {listening && (
            <div style={{
              textAlign: 'center', marginBottom: 8, fontSize: 13, color: '#C62828', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C62828', display: 'inline-block', animation: 'pulse 1s infinite' }} />
              Ouvindo… solte para enviar
            </div>
          )}

          <div style={{
            display: 'flex', gap: 8, alignItems: 'flex-end',
            background: 'var(--card)', borderRadius: 18, border: '1.5px solid var(--border)',
            padding: '8px 8px 8px 14px', boxShadow: '0 2px 10px rgba(15,61,62,.07)'
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder={step === 'adjust' ? 'Ajuste acima e confirme…' : 'Ex: gastei 50 em pizza…'}
              rows={1}
              disabled={busy}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                resize: 'none', fontSize: 15, color: 'var(--text)', lineHeight: 1.45,
                fontFamily: 'inherit', padding: '4px 0', minHeight: 28, maxHeight: 96, overflowY: 'auto',
                opacity: busy ? 0.4 : 1,
              }}
            />
            <button type="button" onPointerDown={startListening} onPointerUp={stopListening} disabled={busy} style={{
              width: 42, height: 42, borderRadius: 13, border: 'none', flexShrink: 0,
              background: listening ? '#C62828' : 'rgba(15,61,62,.08)',
              color: listening ? '#fff' : '#0F3D3E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s',
              boxShadow: listening ? '0 0 0 5px rgba(198,40,40,.18)' : 'none',
              opacity: busy ? 0.4 : 1,
            }}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
              </svg>
            </button>
            <button type="button" onClick={() => handleSend()} disabled={!input.trim() || busy} style={{
              width: 42, height: 42, borderRadius: 13, border: 'none', flexShrink: 0,
              background: (input.trim() && !busy) ? '#0F3D3E' : 'rgba(15,61,62,.08)',
              color: (input.trim() && !busy) ? '#FAF7F0' : 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (input.trim() && !busy) ? 'pointer' : 'default', transition: 'all .2s'
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }`}</style>
      </div>
    </AppShell>
  )
}
