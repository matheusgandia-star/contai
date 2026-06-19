'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Demo categories ──────────────────────────────────────────────────────────

const CATS = [
  { id: 'food',           name: 'Alimentação',   emoji: '🍽️', color: '#F97316' },
  { id: 'groceries',      name: 'Mercado',        emoji: '🛒', color: '#22C55E' },
  { id: 'fuel',           name: 'Gasolina',       emoji: '⛽', color: '#3B82F6' },
  { id: 'transportation', name: 'Transporte',     emoji: '🚗', color: '#06B6D4' },
  { id: 'health',         name: 'Saúde',          emoji: '💊', color: '#EF4444' },
  { id: 'shopping',       name: 'Compras',        emoji: '🛍️', color: '#A855F7' },
  { id: 'entertainment',  name: 'Lazer',          emoji: '🎬', color: '#EC4899' },
  { id: 'home',           name: 'Casa',           emoji: '🏠', color: '#84CC16' },
  { id: 'pet',            name: 'Pet',            emoji: '🐾', color: '#F59E0B' },
  { id: 'bars',           name: 'Bar/Restaurante',emoji: '🍺', color: '#D97706' },
]

const KEYWORDS: Record<string, string> = {
  pizza: 'food', lanche: 'food', hamburguer: 'food', burger: 'food', sushi: 'food',
  almoço: 'food', jantar: 'food', café: 'food', padaria: 'food', restaurante: 'bars',
  bar: 'bars', cerveja: 'bars', churrasco: 'bars', boteco: 'bars',
  mercado: 'groceries', supermercado: 'groceries', feira: 'groceries', hortifruti: 'groceries',
  gasolina: 'fuel', combustivel: 'fuel', posto: 'fuel', etanol: 'fuel', diesel: 'fuel',
  uber: 'transportation', ônibus: 'transportation', metro: 'transportation', taxi: 'transportation',
  farmácia: 'health', remédio: 'health', consulta: 'health', médico: 'health', academia: 'health',
  roupa: 'shopping', sapato: 'shopping', shopping: 'shopping', loja: 'shopping', compra: 'shopping',
  netflix: 'entertainment', cinema: 'entertainment', show: 'entertainment', ingresso: 'entertainment',
  aluguel: 'home', condominio: 'home', luz: 'home', água: 'home', internet: 'home',
  veterinário: 'pet', petshop: 'pet', ração: 'pet', pet: 'pet',
  pedagio: 'transportation', estacionamento: 'transportation',
}

function parseDemo(text: string): { amount: number; cat: typeof CATS[0]; description: string } | null {
  const normalized = text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s,.]/g, ' ')

  // Extract amount
  const amountMatch = normalized.match(/(\d+(?:[.,]\d{1,2})?)/)
  if (!amountMatch) return null
  const amount = parseFloat(amountMatch[1].replace(',', '.'))
  if (!amount || amount <= 0) return null

  // Find category
  const words = normalized.split(/\s+/)
  let catId = 'shopping'
  for (const word of words) {
    if (KEYWORDS[word]) { catId = KEYWORDS[word]; break }
  }
  const cat = CATS.find(c => c.id === catId) ?? CATS[0]

  return { amount, cat, description: text }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Msg = {
  role: 'user' | 'bot'
  text?: string
  card?: { amount: number; cat: typeof CATS[0] }
}

const EXAMPLES = [
  'pizza 38 reais',
  'gasolina 150 pix',
  'mercado 87,40',
  'uber 22',
  'farmácia 45,90',
  'netflix 55',
]

const LIMIT = 2000

function brl(n: number) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: 'Olá! Teste o Contaí aqui. Digite um gasto ou toque em um exemplo 👇' },
  ])
  const [input, setInput] = useState('')
  const [spent, setSpent] = useState(0)
  const [typing, setTyping] = useState(false)
  const [expenses, setExpenses] = useState<{ cat: typeof CATS[0]; amount: number }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  function send(text: string) {
    const msg = text.trim()
    if (!msg) return
    setInput('')

    setMsgs(prev => [...prev, { role: 'user', text: msg }])
    setTyping(true)

    setTimeout(() => {
      const parsed = parseDemo(msg)
      setTyping(false)

      if (!parsed) {
        setMsgs(prev => [...prev, {
          role: 'bot',
          text: 'Não consegui identificar o valor. Tente: "gastei 50 em gasolina" ou "pizza 32 reais" 😊',
        }])
        return
      }

      setMsgs(prev => [...prev,
        { role: 'bot', text: '✅ Registrado!' },
        { role: 'bot', card: { amount: parsed.amount, cat: parsed.cat } },
        { role: 'bot', text: 'Quer ajustar alguma coisa? É só pedir.' },
      ])
      setSpent(prev => prev + parsed.amount)
      setExpenses(prev => [{ cat: parsed.cat, amount: parsed.amount }, ...prev].slice(0, 8))
    }, 900)
  }

  const remaining = LIMIT - spent
  const pct = Math.min(100, (spent / LIMIT) * 100)

  return (
    <section style={{ background: 'linear-gradient(160deg, #0a2829 0%, #0F3D3E 100%)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(212,163,115,0.15)', border: '1px solid rgba(212,163,115,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#D4A373', letterSpacing: '.5px', marginBottom: 16 }}>
            EXPERIMENTE AGORA
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 12 }}>
            Teste o Contaí sem criar conta
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.6)', maxWidth: 480, margin: '0 auto' }}>
            Digite um gasto abaixo e veja como o app funciona na prática.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* LEFT: Phone */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 300, background: '#1a1a1a', borderRadius: 44, padding: '14px 10px',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              position: 'relative',
            }}>
              {/* buttons */}
              <div style={{ position: 'absolute', left: -3, top: 80, width: 3, height: 28, background: '#333', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -3, top: 116, width: 3, height: 48, background: '#333', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -3, top: 172, width: 3, height: 48, background: '#333', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 64, background: '#333', borderRadius: '0 2px 2px 0' }} />

              <div style={{ background: '#EDE9DF', borderRadius: 34, overflow: 'hidden', height: 560, display: 'flex', flexDirection: 'column' }}>
                {/* Status bar */}
                <div style={{ height: 28, background: '#0F3D3E', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 5px', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>9:41</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <svg width="12" height="8" viewBox="0 0 12 8"><rect x="0" y="4" width="2" height="4" rx="0.5" fill="rgba(255,255,255,0.5)"/><rect x="3" y="2.5" width="2" height="5.5" rx="0.5" fill="rgba(255,255,255,0.6)"/><rect x="6" y="1" width="2" height="7" rx="0.5" fill="rgba(255,255,255,0.8)"/><rect x="9" y="0" width="2" height="8" rx="0.5" fill="white"/></svg>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <div style={{ width: 18, height: 9, border: '1px solid rgba(255,255,255,0.5)', borderRadius: 2, padding: 1 }}>
                        <div style={{ width: '75%', height: '100%', background: 'white', borderRadius: 1 }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* App header */}
                <div style={{ background: '#0F3D3E', padding: '8px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#FAF7F0', letterSpacing: '-.3px' }}>Contaí</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>RESTANTE</div>
                    <div style={{ fontSize: 14, color: remaining < 0 ? '#FCA5A5' : '#D4A373', fontWeight: 900 }}>{brl(remaining)}</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                  {msgs.map((m, i) => (
                    <div key={i}>
                      {m.role === 'user' ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <div style={{ background: '#0F3D3E', borderRadius: '12px 12px 3px 12px', padding: '8px 12px', maxWidth: '75%' }}>
                            <div style={{ fontSize: 11, color: '#FAF7F0', lineHeight: 1.4 }}>{m.text}</div>
                          </div>
                        </div>
                      ) : m.card ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10 }}>🤖</div>
                          <div style={{ background: '#FAF7F0', border: `1.5px solid ${m.card.cat.color}33`, borderRadius: '12px 12px 12px 3px', padding: '10px 12px', maxWidth: '82%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${m.card.cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                {m.card.cat.emoji}
                              </div>
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 900, color: '#0F3D3E' }}>{brl(m.card.amount)}</div>
                                <div style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>{m.card.cat.name}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10 }}>🤖</div>
                          <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.12)', borderRadius: '12px 12px 12px 3px', padding: '8px 12px', maxWidth: '78%', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: 10, color: '#333', lineHeight: 1.5 }}>{m.text}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {typing && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10 }}>🤖</div>
                      <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.12)', borderRadius: '12px 12px 12px 3px', padding: '10px 14px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[0, 1, 2].map(i => (
                            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8C8BA', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '0 10px 6px', flexShrink: 0 }}>
                  <div style={{ background: '#FAF7F0', border: '1.5px solid rgba(15,61,62,0.15)', borderRadius: 16, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') send(input) }}
                      placeholder="Ex: pizza 38 reais..."
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 11, color: '#222', fontFamily: 'inherit' }}
                    />
                    <button
                      onClick={() => send(input)}
                      disabled={!input.trim() || typing}
                      style={{ width: 28, height: 28, borderRadius: 10, border: 'none', background: input.trim() && !typing ? '#0F3D3E' : 'rgba(15,61,62,0.1)', color: input.trim() && !typing ? '#FAF7F0' : '#C8C8BA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !typing ? 'pointer' : 'default', transition: 'all .2s', flexShrink: 0 }}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                  </div>
                </div>

                {/* Bottom nav */}
                <div style={{ background: '#FAF7F0', borderTop: '1px solid rgba(15,61,62,0.08)', display: 'flex', padding: '6px 0 10px', flexShrink: 0 }}>
                  {[
                    { label: 'Início', active: true, icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
                    { label: 'Manual', active: false, icon: 'M12 5v14M5 12h14' },
                    { label: 'Resumo', active: false, icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
                    { label: 'Análise', active: false, icon: 'M3 3v18h18M7 16l4-4 4 4 4-6' },
                    { label: 'Config', active: false, icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z' },
                  ].map(item => (
                    <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={item.active ? '#0F3D3E' : '#C8C8BA'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                      <span style={{ fontSize: 7.5, color: item.active ? '#0F3D3E' : '#C8C8BA', fontWeight: item.active ? 700 : 500 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Examples */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(250,247,240,0.5)', letterSpacing: '.5px', marginBottom: 12 }}>TOQUE PARA TESTAR</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {EXAMPLES.map(ex => (
                  <button
                    key={ex}
                    onClick={() => send(ex)}
                    disabled={typing}
                    style={{
                      background: 'rgba(212,163,115,0.12)', border: '1px solid rgba(212,163,115,0.3)',
                      borderRadius: 20, padding: '7px 14px', fontSize: 13, color: '#D4A373',
                      fontWeight: 600, cursor: typing ? 'default' : 'pointer',
                      transition: 'all .15s', fontFamily: 'inherit',
                      opacity: typing ? 0.5 : 1,
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Live budget */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(250,247,240,0.5)', letterSpacing: '.5px', marginBottom: 14 }}>SALDO DO CICLO</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#FAF7F0' }}>{brl(spent)}</div>
                  <div style={{ fontSize: 12, color: 'rgba(250,247,240,0.5)' }}>gasto de {brl(LIMIT)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: remaining < 0 ? '#FCA5A5' : '#D4A373' }}>{brl(remaining)}</div>
                  <div style={{ fontSize: 12, color: 'rgba(250,247,240,0.5)' }}>restante</div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: 99,
                  background: pct >= 100 ? '#EF4444' : pct >= 80 ? '#F97316' : '#D4A373',
                  transition: 'width .5s ease, background .3s',
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(250,247,240,0.4)', marginTop: 6, textAlign: 'right' }}>{pct.toFixed(0)}% utilizado</div>
            </div>

            {/* Last expenses */}
            {expenses.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(250,247,240,0.5)', letterSpacing: '.5px', marginBottom: 14 }}>GASTOS REGISTRADOS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {expenses.map((e, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: `${e.cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {e.cat.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#FAF7F0' }}>{e.cat.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(250,247,240,0.4)' }}>Hoje</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: e.cat.color }}>{brl(e.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expenses.length === 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '32px 20px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>👆</div>
                <div style={{ fontSize: 14, color: 'rgba(250,247,240,0.4)', lineHeight: 1.5 }}>
                  Digite um gasto ou toque em um exemplo para ver o app em ação
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 680px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
