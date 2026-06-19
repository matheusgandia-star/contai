import Link from 'next/link'
import Image from 'next/image'
import LandingDemo from './LandingDemo'

export const metadata = {
  title: 'Contaí — Controle financeiro que cabe no seu dia',
  description: 'Registre gastos por voz, acompanhe limites e entenda seus hábitos financeiros. Simples, rápido e sem complicação.',
}

// ─── Phone Shell ─────────────────────────────────────────────────────────────

function PhoneShell({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 260, flexShrink: 0, position: 'relative',
      background: '#1a1a1a',
      borderRadius: 44,
      padding: '14px 10px',
      boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)',
      ...style,
    }}>
      {/* Side buttons */}
      <div style={{ position: 'absolute', left: -3, top: 80, width: 3, height: 28, background: '#333', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 116, width: 3, height: 48, background: '#333', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 172, width: 3, height: 48, background: '#333', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 64, background: '#333', borderRadius: '0 2px 2px 0' }} />
      {/* Screen */}
      <div style={{
        background: '#EDE9DF', borderRadius: 34,
        overflow: 'hidden', height: 520,
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Status bar */}
        <div style={{
          height: 28, background: '#0F3D3E',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 16px 5px', flexShrink: 0,
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {/* signal */}
            <svg width="12" height="8" viewBox="0 0 12 8"><rect x="0" y="4" width="2" height="4" rx="0.5" fill="rgba(255,255,255,0.6)"/><rect x="3" y="2.5" width="2" height="5.5" rx="0.5" fill="rgba(255,255,255,0.6)"/><rect x="6" y="1" width="2" height="7" rx="0.5" fill="rgba(255,255,255,0.8)"/><rect x="9" y="0" width="2" height="8" rx="0.5" fill="white"/></svg>
            {/* wifi */}
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M5.5 6.5a1 1 0 110 2 1 1 0 010-2z" fill="white"/><path d="M2.5 4.5a4.5 4.5 0 016 0" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round"/><path d="M0.5 2.5a7.5 7.5 0 0110 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
            {/* battery */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <div style={{ width: 18, height: 9, border: '1px solid rgba(255,255,255,0.6)', borderRadius: 2, padding: 1 }}>
                <div style={{ width: '75%', height: '100%', background: 'white', borderRadius: 1 }} />
              </div>
              <div style={{ width: 2, height: 4, background: 'rgba(255,255,255,0.6)', borderRadius: '0 1px 1px 0' }} />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav({ active }: { active: 'home' | 'add' | 'dashboard' | 'history' | 'settings' }) {
  const items = [
    { key: 'home', label: 'Início', path: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { key: 'add', label: 'Manual', path: 'M12 5v14M5 12h14' },
    { key: 'dashboard', label: 'Resumo', path: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
    { key: 'history', label: 'Análise', path: 'M3 3v18h18M7 16l4-4 4 4 4-6' },
    { key: 'settings', label: 'Config', path: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
  ]
  return (
    <div style={{ background: '#FAF7F0', borderTop: '1px solid rgba(15,61,62,0.1)', display: 'flex', padding: '6px 0 10px', flexShrink: 0 }}>
      {items.map(item => {
        const isActive = item.key === active
        return (
          <div key={item.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={isActive ? '#0F3D3E' : '#C8C8BA'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.path} />
            </svg>
            <span style={{ fontSize: 7.5, color: isActive ? '#0F3D3E' : '#C8C8BA', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Screen: Chat ────────────────────────────────────────────────────────────

function ScreenChat() {
  return (
    <>
      {/* App Header */}
      <div style={{ background: '#0F3D3E', padding: '8px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <svg width="56" height="18" viewBox="0 0 56 18"><text x="0" y="14" fontFamily="-apple-system,sans-serif" fontWeight="800" fontSize="14" fill="white">Contaí</text></svg>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '.3px' }}>RESTANTE</div>
          <div style={{ fontSize: 13, color: '#D4A373', fontWeight: 900 }}>R$ 625,37</div>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)' }}>09/Jun a 08/Jul</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'hidden' }}>
        {/* assistant */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10 }}>🤖</span>
          </div>
          <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.1)', borderRadius: '12px 12px 12px 3px', padding: '8px 11px', maxWidth: '78%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 9, color: '#333', lineHeight: 1.5 }}>Oi! Me conta seu gasto. Ex: <span style={{ color: '#0F3D3E', fontWeight: 600 }}>"gastei 45 no mercado"</span> ou fale pelo microfone 🎙️</div>
          </div>
        </div>

        {/* user */}
        <div style={{ alignSelf: 'flex-end', background: '#0F3D3E', borderRadius: '12px 12px 3px 12px', padding: '8px 11px', maxWidth: '72%' }}>
          <div style={{ fontSize: 9, color: '#FAF7F0' }}>pizza 38 reais no jantar</div>
        </div>

        {/* assistant reply with card */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10 }}>🤖</span>
          </div>
          <div style={{ background: '#FAF7F0', border: '1.5px solid rgba(15,61,62,0.15)', borderRadius: '12px 12px 12px 3px', padding: '8px 11px', maxWidth: '82%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 9, color: '#333', lineHeight: 1.5, marginBottom: 6 }}>✅ Registrado!</div>
            <div style={{ background: '#EDE9DF', borderRadius: 8, padding: '7px 9px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 18 }}>🍕</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F3D3E' }}>R$ 38,00</div>
                <div style={{ fontSize: 8, color: '#888' }}>Alimentação · Hoje</div>
              </div>
            </div>
            <div style={{ fontSize: 8, color: '#888', marginTop: 5 }}>Quer ajustar? É só pedir.</div>
          </div>
        </div>

        {/* user */}
        <div style={{ alignSelf: 'flex-end', background: '#0F3D3E', borderRadius: '12px 12px 3px 12px', padding: '8px 11px', maxWidth: '72%' }}>
          <div style={{ fontSize: 9, color: '#FAF7F0' }}>gasolina 150 pix</div>
        </div>

        {/* assistant */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10 }}>🤖</span>
          </div>
          <div style={{ background: '#FAF7F0', border: '1.5px solid rgba(15,61,62,0.15)', borderRadius: '12px 12px 12px 3px', padding: '8px 11px', maxWidth: '82%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 9, color: '#333', lineHeight: 1.5, marginBottom: 6 }}>✅ Salvo via PIX!</div>
            <div style={{ background: '#EDE9DF', borderRadius: 8, padding: '7px 9px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 18 }}>⛽</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F3D3E' }}>R$ 150,00</div>
                <div style={{ fontSize: 8, color: '#888' }}>Gasolina · PIX/Débito</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ padding: '0 10px 4px', flexShrink: 0 }}>
        <div style={{ background: '#FAF7F0', border: '1.5px solid rgba(15,61,62,0.15)', borderRadius: 16, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 2px 8px rgba(15,61,62,0.06)' }}>
          <div style={{ flex: 1, fontSize: 9, color: '#bbb' }}>Ex: uber 22 reais...</div>
          <div style={{ width: 26, height: 26, borderRadius: 10, background: 'rgba(15,61,62,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="#0F3D3E"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm4-3c0 2.21-1.79 4-4 4s-4-1.79-4-4H6c0 2.97 2.16 5.44 5 5.92V20h2v-2.08c2.84-.48 5-2.95 5-5.92h-2z"/></svg>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: 10, background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="#FAF7F0"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </>
  )
}

// ─── Screen: Resumo ───────────────────────────────────────────────────────────

function ScreenDashboard() {
  const cats = [
    { emoji: '⛽', name: 'Gasolina', pct: 82, val: 'R$ 364', color: '#3B82F6' },
    { emoji: '🐾', name: 'Athena', pct: 70, val: 'R$ 350', color: '#EC4899' },
    { emoji: '🍽️', name: 'Alimentação', pct: 58, val: 'R$ 290', color: '#F97316' },
    { emoji: '🛍️', name: 'Compras', pct: 44, val: 'R$ 252', color: '#A855F7' },
    { emoji: '🅿️', name: 'Pedágio', pct: 11, val: 'R$ 50', color: '#EF4444' },
  ]
  return (
    <>
      <div style={{ background: '#0F3D3E', padding: '8px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <svg width="56" height="18" viewBox="0 0 56 18"><text x="0" y="14" fontFamily="-apple-system,sans-serif" fontWeight="800" fontSize="14" fill="white">Contaí</text></svg>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>09/Jun a 08/Jul</div>
      </div>

      <div style={{ flex: 1, padding: '10px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Hero card */}
        <div style={{ background: 'linear-gradient(135deg, #0F3D3E, #1a5c5d)', borderRadius: 16, padding: '12px 14px' }}>
          <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '.5px', marginBottom: 10 }}>FATURA 09/JUN A 08/JUL</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
            {[
              { v: 'R$ 1.374,63', l: 'TOTAL GASTO' },
              { v: 'R$ 343,66', l: 'MÉDIA/DIA ATIVO' },
              { v: '14', l: 'TRANSAÇÕES' },
              { v: '4%', l: 'PIX / DÉBITO', gold: true },
            ].map(t => (
              <div key={t.l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '7px 9px' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: t.gold ? '#D4A373' : '#FAF7F0', marginBottom: 2 }}>{t.v}</div>
                <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '.3px' }}>{t.l}</div>
              </div>
            ))}
          </div>
          {cats.map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 11, width: 16, textAlign: 'center' }}>{c.emoji}</span>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', width: 56, flexShrink: 0 }}>{c.name}</div>
              <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 8, color: c.color, width: 34, textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>{c.val}</div>
            </div>
          ))}
        </div>

        {/* Remaining card */}
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.1)', borderRadius: 14, padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div>
            <div style={{ fontSize: 7, color: '#888', fontWeight: 700, letterSpacing: '.3px', marginBottom: 2 }}>RESTANTE NO CICLO</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#0F3D3E' }}>R$ 625,37</div>
            <div style={{ fontSize: 7.5, color: '#888', marginTop: 2 }}>~R$ 25,01/dia restante</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 7, color: '#888', fontWeight: 700, letterSpacing: '.3px', marginBottom: 2 }}>DIAS RESTANTES</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#D4A373', lineHeight: 1 }}>25</div>
            <div style={{ fontSize: 7.5, color: '#888', marginTop: 2 }}>dias no ciclo</div>
          </div>
        </div>
      </div>

      <BottomNav active="dashboard" />
    </>
  )
}

// ─── Screen: Análise ──────────────────────────────────────────────────────────

function ScreenAnalysis() {
  const heatDays = [0,0,0.2,0,0.7,0,0.9,0,0.3,0,0.8,0,0.1,0,0.6,0.5,0,0.2,0,1,0,0.4,0,0.7,0,0.2,0.5,0,0,0]
  return (
    <>
      <div style={{ background: '#0F3D3E', padding: '8px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <svg width="56" height="18" viewBox="0 0 56 18"><text x="0" y="14" fontFamily="-apple-system,sans-serif" fontWeight="800" fontSize="14" fill="white">Contaí</text></svg>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Análise</div>
      </div>

      {/* Tab toggle */}
      <div style={{ padding: '8px 10px 4px', flexShrink: 0 }}>
        <div style={{ background: '#E8E4D9', borderRadius: 10, padding: 3, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ background: '#0F3D3E', borderRadius: 8, padding: '5px', textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#FAF7F0' }}>Resumo & Métricas</div>
          <div style={{ padding: '5px', textAlign: 'center', fontSize: 8, fontWeight: 600, color: '#888' }}>Lista de Gastos</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '4px 10px 8px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {/* Health score */}
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.1)', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ flexShrink: 0 }}>
            <svg viewBox="0 0 42 42" width="52" height="52">
              <circle cx="21" cy="21" r="17" fill="none" stroke="#e8e4d9" strokeWidth="4"/>
              <circle cx="21" cy="21" r="17" fill="none" stroke="#0F3D3E" strokeWidth="4"
                strokeDasharray={`${0.9 * 106.8} 106.8`} strokeLinecap="round"
                transform="rotate(-90 21 21)"/>
              <text x="21" y="18.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0F3D3E">90</text>
              <text x="21" y="26" textAnchor="middle" fontSize="5" fontWeight="700" fill="#888">ÓTIMO</text>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: '#888', letterSpacing: '.5px', marginBottom: 5 }}>SAÚDE FINANCEIRA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {['✅ Dentro do orçamento', '✅ PIX/Débito equilibrado'].map(f => (
                <div key={f} style={{ fontSize: 8, color: '#333', fontWeight: 500 }}>{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Heat map */}
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.1)', borderRadius: 14, padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, color: '#888', letterSpacing: '.5px', marginBottom: 7 }}>MAPA DO CICLO</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {'Dom Seg Ter Qua Qui Sex Sáb'.split(' ').map(d => (
              <div key={d} style={{ fontSize: 5.5, color: '#bbb', textAlign: 'center', fontWeight: 600 }}>{d}</div>
            ))}
            {heatDays.map((v, i) => (
              <div key={i} style={{
                height: 13, borderRadius: 3,
                background: v === 0 ? '#ede9df' : v > 0.85 ? '#0F3D3E' : v > 0.6 ? 'rgba(15,61,62,0.55)' : v > 0.35 ? 'rgba(15,61,62,0.3)' : 'rgba(15,61,62,0.15)',
                border: i === 19 ? '1.5px solid #D4A373' : 'none',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5, justifyContent: 'flex-end' }}>
            {[0.1, 0.3, 0.55, 1].map(v => (
              <div key={v} style={{ width: 9, height: 9, borderRadius: 2, background: v === 1 ? '#0F3D3E' : `rgba(15,61,62,${v})` }} />
            ))}
            <span style={{ fontSize: 6, color: '#bbb' }}>mais gasto</span>
          </div>
        </div>

        {/* Essencial vs superfluo */}
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.1)', borderRadius: 14, padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, color: '#888', letterSpacing: '.5px', marginBottom: 8 }}>ESSENCIAL VS SUPÉRFLUO</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[
              { label: 'Essencial', pct: 65, val: 'R$ 893', color: '#0F3D3E' },
              { label: 'Supérfluo', pct: 35, val: 'R$ 481', color: '#D4A373' },
            ].map(g => (
              <div key={g.label} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: g.color }}>{g.label}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: g.color }}>{g.pct}%</span>
                </div>
                <div style={{ height: 6, background: '#e8e4d9', borderRadius: 99 }}>
                  <div style={{ width: `${g.pct}%`, height: '100%', background: g.color, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 7, color: '#888', marginTop: 3 }}>{g.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="history" />
    </>
  )
}

// ─── Features ────────────────────────────────────────────────────────────────

const features = [
  { emoji: '🎙️', title: 'Registre por voz', desc: 'Fale "gastei 50 em gasolina" e o Contaí categoriza, salva e confirma. Sem digitar, sem perder tempo.' },
  { emoji: '📊', title: 'Análise inteligente', desc: 'Score de saúde financeira, mapa de calor do mês, comparativo com ciclo anterior e previsão de gastos.' },
  { emoji: '🎯', title: 'Limite por ciclo', desc: 'Defina quanto quer gastar no mês ou na fatura. O app avisa quando está chegando no limite.' },
  { emoji: '⚡', title: 'Resumo em segundos', desc: 'Painel visual com total gasto, média diária, categorias e dias restantes no ciclo. Tudo no primeiro olhar.' },
  { emoji: '💡', title: 'Oportunidades de economia', desc: 'O Contaí identifica onde você gastou mais que no mês anterior e mostra quanto pode economizar.' },
  { emoji: '🔒', title: 'Seus dados, só seus', desc: 'Nenhuma informação é compartilhada com terceiros. Seus gastos ficam seguros e privados.' },
]

const steps = [
  { n: '1', title: 'Crie sua conta', desc: 'Cadastro em menos de 1 minuto, sem cartão de crédito.' },
  { n: '2', title: 'Defina seu limite', desc: 'Coloque o quanto quer gastar no mês ou na fatura do cartão.' },
  { n: '3', title: 'Registre seus gastos', desc: 'Por voz, por texto ou pelo formulário — do jeito que preferir.' },
  { n: '4', title: 'Acompanhe e melhore', desc: 'Veja onde o dinheiro vai e tome decisões melhores todo mês.' },
]

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(15,61,62,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#0F3D3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <span style={{ fontSize: 14, color: '#444' }}>{children}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: '#FAF7F0', color: '#222', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,247,240,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(15,61,62,0.08)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: '100%',
      }}>
        <Image src="/logo.png" alt="Contaí" width={90} height={28} style={{ objectFit: 'contain' }} priority />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: '#0F3D3E', textDecoration: 'none' }}>Entrar</Link>
          <Link href="/auth/signup" style={{ fontSize: 14, fontWeight: 700, color: '#FAF7F0', background: '#0F3D3E', borderRadius: 10, padding: '8px 18px', textDecoration: 'none' }}>
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0a2829 0%, #0F3D3E 50%, #1a5c5d 100%)',
        padding: '72px 24px 0', textAlign: 'center', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(212,163,115,0.15)', border: '1px solid rgba(212,163,115,0.35)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#D4A373', letterSpacing: '.5px', marginBottom: 24 }}>
            7 DIAS GRÁTIS · SEM CARTÃO
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 7vw, 52px)', fontWeight: 900, lineHeight: 1.08, color: '#FAF7F0', marginBottom: 20 }}>
            Controle financeiro que{' '}
            <span style={{ color: '#D4A373' }}>cabe no seu dia</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(250,247,240,0.7)', lineHeight: 1.65, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Registre gastos por voz em segundos, acompanhe seus limites e entenda seus hábitos — sem planilha, sem complicação.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link href="/auth/signup" style={{ fontSize: 16, fontWeight: 800, color: '#0F3D3E', background: '#D4A373', borderRadius: 14, padding: '15px 30px', textDecoration: 'none', boxShadow: '0 4px 24px rgba(212,163,115,0.4)' }}>
              Começar 7 dias grátis
            </Link>
            <Link href="#como-funciona" style={{ fontSize: 16, fontWeight: 700, color: '#FAF7F0', background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '15px 26px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' }}>
              Ver como funciona
            </Link>
          </div>

          {/* 3 phones in fan */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: -10, position: 'relative', paddingBottom: 0 }}>
            <div style={{ transform: 'translateY(30px) rotate(-8deg) translateX(20px)', transformOrigin: 'bottom center', zIndex: 1 }}>
              <PhoneShell><ScreenChat /></PhoneShell>
            </div>
            <div style={{ zIndex: 3, transform: 'translateY(-10px)' }}>
              <PhoneShell><ScreenDashboard /></PhoneShell>
            </div>
            <div style={{ transform: 'translateY(30px) rotate(8deg) translateX(-20px)', transformOrigin: 'bottom center', zIndex: 1 }}>
              <PhoneShell><ScreenAnalysis /></PhoneShell>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ background: '#0a2829', padding: '22px 24px', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {[{ n: '7 dias', l: 'de trial grátis' }, { n: '100%', l: 'dados privados' }, { n: '0', l: 'planilhas' }].map(item => (
          <div key={item.l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D4A373' }}>{item.n}</div>
            <div style={{ fontSize: 12, color: 'rgba(250,247,240,0.5)', fontWeight: 600 }}>{item.l}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#0F3D3E', marginBottom: 12 }}>
            Tudo que você precisa, nada que não precisa
          </h2>
          <p style={{ fontSize: 16, color: '#888', maxWidth: 480, margin: '0 auto' }}>
            O Contaí foi feito para quem quer controle financeiro sem burocracia.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', border: '1px solid rgba(15,61,62,0.08)', boxShadow: '0 2px 16px rgba(15,61,62,0.05)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F3D3E', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SIMULATOR */}
      <LandingDemo />

      {/* SHOWCASE: Chat */}
      <section style={{ background: '#F4F0E6', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
          <PhoneShell style={{ boxShadow: '0 48px 120px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)' }}>
            <ScreenChat />
          </PhoneShell>
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4A373', letterSpacing: '1.5px', marginBottom: 12 }}>CHAT INTELIGENTE</div>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#0F3D3E', marginBottom: 16, lineHeight: 1.2 }}>
              Registre um gasto em menos de 5 segundos
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginBottom: 28 }}>
              Digite ou fale o gasto em linguagem natural. O Contaí identifica o valor, a categoria e salva automaticamente — sem formulário, sem campos para preencher.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {['"pizza 38 reais no jantar"', '"gasolina 150 pix"', '"mercado 87,40"'].map(ex => (
                <div key={ex} style={{ background: '#0F3D3E', color: '#FAF7F0', borderRadius: '14px 14px 3px 14px', padding: '9px 15px', fontSize: 14, display: 'inline-block', alignSelf: 'flex-end' }}>
                  {ex}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CheckItem>Categorização automática</CheckItem>
              <CheckItem>Registro por voz no microfone</CheckItem>
              <CheckItem>Histórico salvo na conversa</CheckItem>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE: Resumo */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap-reverse', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4A373', letterSpacing: '1.5px', marginBottom: 12 }}>RESUMO DO CICLO</div>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#0F3D3E', marginBottom: 16, lineHeight: 1.2 }}>
              Tudo que importa em uma tela
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginBottom: 28 }}>
              Total gasto, média diária, dias restantes e categorias com barras de progresso. Você sabe exatamente onde está no ciclo sem precisar calcular nada.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CheckItem>Total gasto no ciclo atual</CheckItem>
              <CheckItem>Quanto ainda pode gastar por dia</CheckItem>
              <CheckItem>Categorias com barras de progresso</CheckItem>
              <CheckItem>Dias restantes no período</CheckItem>
            </div>
          </div>
          <PhoneShell style={{ boxShadow: '0 48px 120px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)' }}>
            <ScreenDashboard />
          </PhoneShell>
        </div>
      </section>

      {/* SHOWCASE: Análise */}
      <section style={{ background: '#F4F0E6', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
          <PhoneShell style={{ boxShadow: '0 48px 120px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)' }}>
            <ScreenAnalysis />
          </PhoneShell>
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4A373', letterSpacing: '1.5px', marginBottom: 12 }}>ANÁLISE PROFUNDA</div>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#0F3D3E', marginBottom: 16, lineHeight: 1.2 }}>
              Entenda seus hábitos de verdade
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginBottom: 28 }}>
              Score de saúde financeira, mapa de calor dos dias do ciclo, divisão entre gasto essencial e supérfluo, comparativo com o mês anterior.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CheckItem>Score de saúde 0–100</CheckItem>
              <CheckItem>Mapa de calor por dia</CheckItem>
              <CheckItem>Essencial vs supérfluo</CheckItem>
              <CheckItem>Comparativo com ciclo anterior</CheckItem>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ background: '#0F3D3E', padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 12 }}>Pronto em 4 passos</h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.55)', marginBottom: 56 }}>Sem configuração complicada. Você começa a usar no primeiro minuto.</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#D4A373', color: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>{s.n}</div>
                  {i < steps.length - 1 && <div style={{ width: 2, height: 40, background: 'rgba(212,163,115,0.2)', margin: '4px 0' }} />}
                </div>
                <div style={{ paddingTop: 10, paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#FAF7F0', marginBottom: 4 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(250,247,240,0.55)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇO */}
      <section style={{ padding: '80px 24px', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#0F3D3E', marginBottom: 12 }}>Simples assim</h2>
        <p style={{ fontSize: 16, color: '#888', marginBottom: 48 }}>Um plano único. Sem surpresas.</p>
        <div style={{ background: '#0F3D3E', borderRadius: 24, padding: '40px 32px', boxShadow: '0 8px 48px rgba(15,61,62,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, background: '#D4A373', color: '#0F3D3E', fontSize: 11, fontWeight: 800, letterSpacing: '.5px', borderRadius: 8, padding: '4px 10px' }}>7 DIAS GRÁTIS</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(250,247,240,0.5)', letterSpacing: '.5px', marginBottom: 12 }}>PLANO MENSAL</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#D4A373', alignSelf: 'flex-start', marginTop: 10 }}>R$</span>
            <span style={{ fontSize: 56, fontWeight: 900, color: '#FAF7F0', lineHeight: 1 }}>9</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#FAF7F0', lineHeight: 1, marginBottom: 4 }}>,90</span>
            <span style={{ fontSize: 14, color: 'rgba(250,247,240,0.4)', marginBottom: 8 }}>/mês</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(250,247,240,0.4)', marginBottom: 32 }}>Após 7 dias grátis · Cancele quando quiser</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, textAlign: 'left' }}>
            {['Registro por voz e texto', 'Análise e score de saúde financeira', 'Comparativo entre ciclos', 'Limite por categoria', 'Histórico completo', 'Acesso pelo celular como app'].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(212,163,115,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#D4A373" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(250,247,240,0.8)' }}>{item}</span>
              </div>
            ))}
          </div>
          <Link href="/auth/signup" style={{ display: 'block', textAlign: 'center', fontSize: 16, fontWeight: 800, color: '#0F3D3E', background: '#D4A373', borderRadius: 14, padding: '16px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(212,163,115,0.35)' }}>
            Começar 7 dias grátis
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#F4F0E6', padding: '72px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#0F3D3E', textAlign: 'center', marginBottom: 48 }}>Dúvidas frequentes</h2>
          {[
            { q: 'Preciso de cartão de crédito para começar?', a: 'Não. Os 7 dias de trial são completamente gratuitos, sem precisar cadastrar nenhuma forma de pagamento.' },
            { q: 'O Contaí acessa minha conta bancária?', a: 'Não. Você registra os gastos manualmente — por voz, por texto ou pelo formulário. Seus dados bancários nunca são acessados.' },
            { q: 'Funciona como aplicativo no celular?', a: 'Sim. Você pode adicionar o Contaí à tela inicial do seu celular e ele funciona exatamente como um app — sem precisar baixar nada na loja.' },
            { q: 'Posso cancelar a qualquer momento?', a: 'Sim. Sem multa e sem burocracia. Cancele quando quiser e você continua com acesso até o fim do período pago.' },
            { q: 'Meus dados ficam seguros?', a: 'Sim. Seus dados ficam armazenados com segurança e nunca são compartilhados com terceiros ou usados para publicidade.' },
          ].map(item => (
            <details key={item.q} style={{ borderBottom: '1px solid rgba(15,61,62,0.1)', paddingBottom: 20, marginBottom: 20 }}>
              <summary style={{ fontSize: 16, fontWeight: 700, color: '#0F3D3E', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.q}
                <span style={{ color: '#D4A373', fontSize: 22, fontWeight: 300 }}>+</span>
              </summary>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginTop: 12 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: 'linear-gradient(135deg, #0a2829 0%, #0F3D3E 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px, 6vw, 40px)', fontWeight: 900, color: '#FAF7F0', marginBottom: 16, lineHeight: 1.15 }}>
            Comece a entender para onde vai seu dinheiro
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.6)', marginBottom: 40, lineHeight: 1.6 }}>7 dias grátis. Sem cartão. Cancele quando quiser.</p>
          <Link href="/auth/signup" style={{ display: 'inline-block', fontSize: 17, fontWeight: 800, color: '#0F3D3E', background: '#D4A373', borderRadius: 14, padding: '18px 40px', textDecoration: 'none', boxShadow: '0 4px 32px rgba(212,163,115,0.45)' }}>
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#050f10', padding: '32px 24px', textAlign: 'center' }}>
        <Image src="/logo.png" alt="Contaí" width={80} height={25} style={{ objectFit: 'contain', marginBottom: 16, opacity: 0.5 }} />
        <p style={{ fontSize: 12, color: 'rgba(250,247,240,0.25)' }}>© {new Date().getFullYear()} Contaí · Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
