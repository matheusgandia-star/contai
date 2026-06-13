'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Settings } from '@/lib/types'
import { brl } from '@/lib/cycle'
import CategoryIcon from '@/components/CategoryIcon'
import { parseExpense, type ParsedExpense } from '@/lib/parseExpense'

interface Props {
  categories: Category[]
  settings: Settings
}

type ChatMsg = { role: 'user' | 'assistant'; text: string }
type Step = 'idle' | 'confirm' | 'saving' | 'done'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function HomeClient({ categories, settings }: Props) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', text: 'Olá! Me conta qual foi seu gasto e eu registro para você. Pode digitar ou usar o microfone.' }
  ])
  const [parsed, setParsed] = useState<ParsedExpense | null>(null)
  const [step, setStep] = useState<Step>('idle')
  const [listening, setListening] = useState(false)
  const [payMethod, setPayMethod] = useState<'credit' | 'pix'>('credit')
  const recognitionRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      addMsg('assistant', 'Não consegui identificar o valor. Tente algo como "gastei 50 em uber" ou "pizza 32 reais".')
      return
    }

    setParsed(result)
    setStep('confirm')
    const cat = categories.find(c => c.id === result.category_id)
    const hint = result.confidence === 'low' ? ' Confira a categoria antes de salvar.' : ''
    addMsg('assistant', `Encontrei! ${brl(result.amount)} em ${cat?.name ?? result.category_id}.${hint}`)
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
    addMsg('assistant', `Gasto de ${brl(parsed.amount)} registrado! Quer adicionar mais algum?`)
    router.refresh()
    // Reset after 1s so user can add another
    setTimeout(() => {
      setStep('idle')
      setParsed(null)
      setPayMethod('credit')
    }, 1000)
  }

  function cancelConfirm() {
    setStep('idle')
    setParsed(null)
    addMsg('assistant', 'Ok! Me conte o gasto novamente quando quiser.')
  }

  return (
    <div style={{
      maxWidth: 480, marginInline: 'auto',
      minHeight: '100dvh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--accent)',
        padding: '14px 18px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(15,61,62,.18)'
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#FAF7F0', letterSpacing: -.3 }}>Contaí</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', fontWeight: 500, marginTop: 1 }}>Registre seus gastos</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {settings.monthly_limit > 0 && (
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.8)',
              background: 'rgba(255,255,255,.1)', borderRadius: 100, padding: '4px 10px'
            }}>
              Limite: {brl(settings.monthly_limit)}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 0',
        display: 'flex', flexDirection: 'column', gap: 10,
        paddingBottom: 8,
      }}>

        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width: 28, height: 28, borderRadius: 10, background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginRight: 8, alignSelf: 'flex-end',
              }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#FAF7F0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </div>
            )}
            <div style={{
              maxWidth: '76%',
              background: m.role === 'user' ? '#0F3D3E' : 'var(--card)',
              color: m.role === 'user' ? '#FAF7F0' : 'var(--text)',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '10px 14px',
              fontSize: 14, lineHeight: 1.5,
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              boxShadow: '0 1px 6px rgba(0,0,0,.07)',
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Confirmation card */}
        {(step === 'confirm' || step === 'saving') && parsed && (
          <div style={{
            background: 'var(--card)', borderRadius: 18, padding: 16,
            border: '2px solid var(--accent)', boxShadow: '0 4px 20px rgba(15,61,62,.12)',
            marginTop: 4,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>
              Confirmar gasto
            </div>

            {/* Valor */}
            <div style={{
              fontSize: 36, fontWeight: 900, color: 'var(--accent)',
              textAlign: 'center', marginBottom: 14, letterSpacing: -1
            }}>
              {brl(parsed.amount)}
            </div>

            {/* Categoria */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 7 }}>Categoria</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
                {categories.map(cat => (
                  <button key={cat.id} type="button"
                    onClick={() => setParsed(p => p ? { ...p, category_id: cat.id } : p)}
                    style={{
                      background: parsed.category_id === cat.id ? 'rgba(15,61,62,.09)' : 'var(--bg)',
                      border: `2px solid ${parsed.category_id === cat.id ? '#0F3D3E' : 'transparent'}`,
                      borderRadius: 10, padding: '7px 3px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s'
                    }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 22 }}>
                      <CategoryIcon emoji={cat.emoji} color={parsed.category_id === cat.id ? cat.color : 'var(--muted)'} size={17} />
                    </span>
                    <span style={{ fontSize: 7.5, color: parsed.category_id === cat.id ? '#0F3D3E' : 'var(--muted)', marginTop: 2, display: 'block', lineHeight: 1.2 }}>
                      {cat.name.length > 7 ? cat.name.slice(0, 7) + '…' : cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pagamento */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 7 }}>Pagamento</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {(['credit', 'pix'] as const).map(pm => (
                  <button key={pm} type="button" onClick={() => setPayMethod(pm)} style={{
                    padding: '10px', borderRadius: 10, border: `1.5px solid ${payMethod === pm ? (pm === 'credit' ? '#0F3D3E' : 'var(--gold)') : 'var(--border)'}`,
                    background: payMethod === pm ? (pm === 'credit' ? 'rgba(15,61,62,.08)' : 'rgba(212,163,115,.12)') : 'var(--bg)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
                    color: payMethod === pm ? (pm === 'credit' ? '#0F3D3E' : '#9A6728') : 'var(--muted)',
                  }}>
                    {pm === 'credit' ? 'Crédito' : 'PIX / Débito'}
                  </button>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
              <button type="button" onClick={cancelConfirm} disabled={step === 'saving'} style={{
                padding: '12px', borderRadius: 11, border: '1.5px solid var(--border)',
                background: 'var(--bg)', color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>
                Cancelar
              </button>
              <button type="button" onClick={confirmSave} disabled={step === 'saving'} style={{
                padding: '12px', borderRadius: 11, border: 'none',
                background: 'var(--accent)', color: '#FAF7F0', fontSize: 14, fontWeight: 700,
                cursor: step === 'saving' ? 'not-allowed' : 'pointer',
                opacity: step === 'saving' ? 0.7 : 1, transition: 'opacity .2s'
              }}>
                {step === 'saving' ? 'Salvando…' : 'Confirmar e Salvar'}
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '10px 12px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        marginBottom: 56, // height of BottomNav
      }}>
        {listening && (
          <div style={{
            textAlign: 'center', marginBottom: 8, fontSize: 13, color: '#C62828', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#C62828',
              display: 'inline-block', animation: 'pulse 1s infinite'
            }} />
            Ouvindo… solte para enviar
          </div>
        )}

        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: 'var(--card)', borderRadius: 18,
          border: '1.5px solid var(--border)',
          padding: '8px 8px 8px 14px',
          boxShadow: '0 2px 10px rgba(15,61,62,.07)'
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Ex: gastei 50 em pizza…"
            rows={1}
            disabled={step === 'confirm' || step === 'saving'}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              resize: 'none', fontSize: 15, color: 'var(--text)', lineHeight: 1.45,
              fontFamily: 'inherit', padding: '4px 0',
              minHeight: 28, maxHeight: 96, overflowY: 'auto',
              opacity: (step === 'confirm' || step === 'saving') ? 0.4 : 1,
            }}
          />

          {/* Mic */}
          <button
            type="button"
            onPointerDown={startListening}
            onPointerUp={stopListening}
            disabled={step === 'confirm' || step === 'saving'}
            style={{
              width: 42, height: 42, borderRadius: 13, border: 'none', flexShrink: 0,
              background: listening ? '#C62828' : 'rgba(15,61,62,.08)',
              color: listening ? '#fff' : '#0F3D3E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s',
              boxShadow: listening ? '0 0 0 5px rgba(198,40,40,.18)' : 'none',
              opacity: (step === 'confirm' || step === 'saving') ? 0.4 : 1,
            }}
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            </svg>
          </button>

          {/* Send */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || step === 'confirm' || step === 'saving'}
            style={{
              width: 42, height: 42, borderRadius: 13, border: 'none', flexShrink: 0,
              background: (input.trim() && step === 'idle') ? '#0F3D3E' : 'rgba(15,61,62,.08)',
              color: (input.trim() && step === 'idle') ? '#FAF7F0' : 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (input.trim() && step === 'idle') ? 'pointer' : 'default',
              transition: 'all .2s'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }
      `}</style>
    </div>
  )
}
