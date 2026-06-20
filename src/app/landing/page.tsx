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
      background: '#111',
      borderRadius: 44,
      padding: '14px 10px',
      boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)',
      ...style,
    }}>
      <div style={{ position: 'absolute', left: -3, top: 80, width: 3, height: 28, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 116, width: 3, height: 48, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 172, width: 3, height: 48, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 64, background: '#2a2a2a', borderRadius: '0 2px 2px 0' }} />
      <div style={{ background: '#EDE9DF', borderRadius: 34, overflow: 'hidden', height: 520, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ height: 28, background: '#0F3D3E', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 5px', flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <svg width="12" height="8" viewBox="0 0 12 8"><rect x="0" y="4" width="2" height="4" rx="0.5" fill="rgba(255,255,255,0.5)"/><rect x="3" y="2.5" width="2" height="5.5" rx="0.5" fill="rgba(255,255,255,0.6)"/><rect x="6" y="1" width="2" height="7" rx="0.5" fill="rgba(255,255,255,0.8)"/><rect x="9" y="0" width="2" height="8" rx="0.5" fill="white"/></svg>
            <div style={{ width: 18, height: 9, border: '1px solid rgba(255,255,255,0.5)', borderRadius: 2, padding: 1 }}><div style={{ width: '75%', height: '100%', background: 'white', borderRadius: 1 }} /></div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function BottomNav({ active }: { active: 'home' | 'dashboard' | 'history' }) {
  const items = [
    { key: 'home', label: 'Início', path: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { key: 'add', label: 'Manual', path: 'M12 5v14M5 12h14' },
    { key: 'dashboard', label: 'Resumo', path: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
    { key: 'history', label: 'Análise', path: 'M3 3v18h18M7 16l4-4 4 4 4-6' },
    { key: 'settings', label: 'Config', path: 'M12 15a3 3 0 100-6 3 3 0 000 6z' },
  ]
  return (
    <div style={{ background: '#FAF7F0', borderTop: '1px solid rgba(15,61,62,0.08)', display: 'flex', padding: '6px 0 10px', flexShrink: 0 }}>
      {items.map(item => (
        <div key={item.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={item.key === active ? '#0F3D3E' : '#C8C8BA'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={item.path} /></svg>
          <span style={{ fontSize: 7.5, color: item.key === active ? '#0F3D3E' : '#C8C8BA', fontWeight: item.key === active ? 700 : 500 }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function ScreenChat() {
  return (
    <>
      <div style={{ background: '#0F3D3E', padding: '8px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: '#FAF7F0' }}>Contaí</span>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>RESTANTE</div>
          <div style={{ fontSize: 13, color: '#F5D060', fontWeight: 900 }}>R$ 625,37</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'hidden' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconBot /></div>
          <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.1)', borderRadius: '12px 12px 12px 3px', padding: '8px 11px', maxWidth: '80%' }}>
            <div style={{ fontSize: 9.5, color: '#333', lineHeight: 1.5 }}>Oi! Me conta seu gasto. Ex: <span style={{ color: '#0F3D3E', fontWeight: 700 }}>"pizza 38 reais"</span> ou use o microfone.</div>
          </div>
        </div>
        <div style={{ alignSelf: 'flex-end', background: '#0F3D3E', borderRadius: '12px 12px 3px 12px', padding: '8px 12px', maxWidth: '72%' }}>
          <div style={{ fontSize: 9.5, color: '#FAF7F0' }}>pizza 38 reais no jantar</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconBot /></div>
          <div style={{ background: '#FAF7F0', border: '1.5px solid rgba(15,61,62,0.12)', borderRadius: '12px 12px 12px 3px', padding: '9px 11px', maxWidth: '84%' }}>
            <div style={{ fontSize: 9, color: '#444', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Registrado!
            </div>
            <div style={{ background: '#EDE9DF', borderRadius: 9, padding: '7px 9px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconFood size={14} color="#fff" /></div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: '#0F3D3E' }}>R$ 38,00</div><div style={{ fontSize: 8, color: '#888' }}>Alimentação · Hoje</div></div>
            </div>
            <div style={{ fontSize: 8, color: '#aaa', marginTop: 5 }}>Quer ajustar? É só pedir.</div>
          </div>
        </div>
        <div style={{ alignSelf: 'flex-end', background: '#0F3D3E', borderRadius: '12px 12px 3px 12px', padding: '8px 12px', maxWidth: '72%' }}>
          <div style={{ fontSize: 9.5, color: '#FAF7F0' }}>gasolina 150 pix</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconBot /></div>
          <div style={{ background: '#FAF7F0', border: '1.5px solid rgba(15,61,62,0.12)', borderRadius: '12px 12px 12px 3px', padding: '9px 11px', maxWidth: '84%' }}>
            <div style={{ fontSize: 9, color: '#444', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Salvo via PIX!
            </div>
            <div style={{ background: '#EDE9DF', borderRadius: 9, padding: '7px 9px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconFuel size={14} color="#fff" /></div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: '#0F3D3E' }}>R$ 150,00</div><div style={{ fontSize: 8, color: '#888' }}>Gasolina · PIX/Débito</div></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 10px 5px', flexShrink: 0 }}>
        <div style={{ background: '#FAF7F0', border: '1.5px solid rgba(15,61,62,0.15)', borderRadius: 16, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ flex: 1, fontSize: 9, color: '#ccc' }}>Ex: uber 22 reais...</div>
          <div style={{ width: 26, height: 26, borderRadius: 9, background: 'rgba(15,61,62,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="#0F3D3E"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm4-3c0 2.21-1.79 4-4 4s-4-1.79-4-4H6c0 2.97 2.16 5.44 5 5.92V20h2v-2.08c2.84-.48 5-2.95 5-5.92h-2z"/></svg>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: 9, background: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="#FAF7F0"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </div>
        </div>
      </div>
      <BottomNav active="home" />
    </>
  )
}

function ScreenDashboard() {
  const cats = [
    { name: 'Gasolina', pct: 82, val: 'R$ 364', color: '#3B82F6' },
    { name: 'Athena', pct: 70, val: 'R$ 350', color: '#EC4899' },
    { name: 'Alimentação', pct: 58, val: 'R$ 290', color: '#F97316' },
    { name: 'Compras', pct: 44, val: 'R$ 252', color: '#A855F7' },
    { name: 'Pedágio', pct: 11, val: 'R$ 50', color: '#EF4444' },
  ]
  return (
    <>
      <div style={{ background: '#0F3D3E', padding: '8px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: '#FAF7F0' }}>Contaí</span>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>09/Jun a 08/Jul</div>
      </div>
      <div style={{ flex: 1, padding: '10px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: 'linear-gradient(135deg, #0F3D3E, #1a5c5d)', borderRadius: 16, padding: '12px 14px' }}>
          <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '.5px', marginBottom: 10 }}>FATURA 09/JUN A 08/JUL</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
            {[{ v: 'R$ 1.374,63', l: 'TOTAL GASTO' }, { v: 'R$ 343,66', l: 'MÉDIA/DIA' }, { v: '14', l: 'TRANSAÇÕES' }, { v: '4%', l: 'PIX / DÉBITO', gold: true }].map(t => (
              <div key={t.l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '7px 9px' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: (t as any).gold ? '#F5D060' : '#FAF7F0', marginBottom: 2 }}>{t.v}</div>
                <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '.3px' }}>{t.l}</div>
              </div>
            ))}
          </div>
          {cats.map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.65)', width: 56, flexShrink: 0 }}>{c.name}</div>
              <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 8, color: c.color, width: 34, textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>{c.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.08)', borderRadius: 14, padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 7, color: '#aaa', fontWeight: 700, letterSpacing: '.3px', marginBottom: 2 }}>RESTANTE NO CICLO</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0F3D3E' }}>R$ 625,37</div>
            <div style={{ fontSize: 7.5, color: '#aaa', marginTop: 2 }}>~R$ 25,01/dia</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 7, color: '#aaa', fontWeight: 700, letterSpacing: '.3px', marginBottom: 2 }}>DIAS RESTANTES</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#F5D060', lineHeight: 1 }}>25</div>
          </div>
        </div>
      </div>
      <BottomNav active="dashboard" />
    </>
  )
}

function ScreenAnalysis() {
  const heatDays = [0,0,0.2,0,0.7,0,0.9,0,0.3,0,0.8,0,0.1,0,0.6,0.5,0,0.2,0,1,0,0.4,0,0.7,0,0.2,0.5,0,0,0]
  return (
    <>
      <div style={{ background: '#0F3D3E', padding: '8px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: '#FAF7F0' }}>Contaí</span>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Análise</div>
      </div>
      <div style={{ padding: '8px 10px 4px', flexShrink: 0 }}>
        <div style={{ background: '#E8E4D9', borderRadius: 10, padding: 3, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ background: '#0F3D3E', borderRadius: 8, padding: '5px', textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#FAF7F0' }}>Resumo & Métricas</div>
          <div style={{ padding: '5px', textAlign: 'center', fontSize: 8, fontWeight: 600, color: '#aaa' }}>Lista de Gastos</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '4px 10px 8px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.08)', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg viewBox="0 0 42 42" width="52" height="52">
            <circle cx="21" cy="21" r="17" fill="none" stroke="#e8e4d9" strokeWidth="4"/>
            <circle cx="21" cy="21" r="17" fill="none" stroke="#0F3D3E" strokeWidth="4" strokeDasharray={`${0.9 * 106.8} 106.8`} strokeLinecap="round" transform="rotate(-90 21 21)"/>
            <text x="21" y="18.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0F3D3E">90</text>
            <text x="21" y="26" textAnchor="middle" fontSize="5" fontWeight="700" fill="#888">ÓTIMO</text>
          </svg>
          <div>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 5 }}>SAÚDE FINANCEIRA</div>
            <div style={{ fontSize: 8, color: '#333', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 3 }}><svg viewBox="0 0 24 24" width="7" height="7" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Dentro do orçamento</div>
            <div style={{ fontSize: 8, color: '#333', display: 'flex', alignItems: 'center', gap: 3 }}><svg viewBox="0 0 24 24" width="7" height="7" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> PIX/Débito equilibrado</div>
          </div>
        </div>
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.08)', borderRadius: 14, padding: '10px 12px' }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 7 }}>MAPA DO CICLO</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {'Dom Seg Ter Qua Qui Sex Sáb'.split(' ').map(d => <div key={d} style={{ fontSize: 5.5, color: '#ccc', textAlign: 'center', fontWeight: 600 }}>{d}</div>)}
            {heatDays.map((v, i) => <div key={i} style={{ height: 13, borderRadius: 3, background: v === 0 ? '#ede9df' : v > 0.85 ? '#0F3D3E' : v > 0.6 ? 'rgba(15,61,62,0.55)' : v > 0.35 ? 'rgba(15,61,62,0.3)' : 'rgba(15,61,62,0.15)', border: i === 19 ? '1.5px solid #F5D060' : 'none' }} />)}
          </div>
        </div>
        <div style={{ background: '#FAF7F0', border: '1px solid rgba(15,61,62,0.08)', borderRadius: 14, padding: '10px 12px' }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 8 }}>ESSENCIAL VS SUPÉRFLUO</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[{ label: 'Essencial', pct: 65, val: 'R$ 893', color: '#0F3D3E' }, { label: 'Supérfluo', pct: 35, val: 'R$ 481', color: '#F5D060' }].map(g => (
              <div key={g.label} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: g.color }}>{g.label}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: g.color }}>{g.pct}%</span>
                </div>
                <div style={{ height: 6, background: '#e8e4d9', borderRadius: 99 }}><div style={{ width: `${g.pct}%`, height: '100%', background: g.color, borderRadius: 99 }} /></div>
                <div style={{ fontSize: 7, color: '#aaa', marginTop: 3 }}>{g.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="history" />
    </>
  )
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconMic({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3"/>
      <path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6"/>
    </svg>
  )
}

function IconBell({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
      <line x1="12" y1="2" x2="12" y2="2" strokeWidth="3"/>
    </svg>
  )
}

function IconChart({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
}

function IconCalendar({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <rect x="7" y="14" width="3" height="3" rx="0.5" fill={color} stroke="none"/>
      <rect x="14" y="14" width="3" height="3" rx="0.5" fill={color} stroke="none"/>
    </svg>
  )
}

function IconLightbulb({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4.9 11.9c.6.6 1.2 1.4 1.7 2.1H15.2c.5-.7 1.1-1.5 1.7-2.1A7 7 0 0012 2z"/>
    </svg>
  )
}

function IconRepeat({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  )
}

function IconLock({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
      <circle cx="12" cy="16" r="1" fill={color} stroke="none"/>
    </svg>
  )
}

function IconEyeOff({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function IconShield({ size = 22, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  )
}

function IconFood({ size = 18, color = '#0F3D3E' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.66 1.34 3 3 3s3-1.34 3-3V2M6 12v10"/>
      <path d="M15 2h-1a1 1 0 00-1 1v5c0 1.66 1.34 3 3 3s3-1.34 3-3V3a1 1 0 00-1-1h-1M15 12v10"/>
    </svg>
  )
}

function IconFuel({ size = 18, color = '#0F3D3E' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16"/>
      <line x1="3" y1="22" x2="15" y2="22"/>
      <line x1="9" y1="4" x2="9" y2="10"/>
      <path d="M15 6l4 2v10a1 1 0 01-1 1h-2"/>
    </svg>
  )
}

function IconBot({ size = 12, color = '#FAF7F0' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="3"/>
      <path d="M9 8V6a3 3 0 016 0v2"/>
      <circle cx="9" cy="14" r="1.5" fill={color} stroke="none"/>
      <circle cx="15" cy="14" r="1.5" fill={color} stroke="none"/>
      <line x1="9" y1="18" x2="15" y2="18"/>
    </svg>
  )
}

function FeatureIconBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(15,61,62,0.25)', border: '1px solid rgba(15,61,62,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function CheckItem({ light, children }: { light?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: light ? 'rgba(212,163,115,0.15)' : 'rgba(15,61,62,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke={light ? '#F5D060' : '#0F3D3E'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <span style={{ fontSize: 14, color: light ? 'rgba(250,247,240,0.75)' : '#444' }}>{children}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const S = { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }

  return (
    <div style={{ background: '#060f0f', color: '#FAF7F0', ...S, overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <div style={{ position: 'sticky', top: 16, zIndex: 100, display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
        <nav style={{
          background: 'rgba(15,61,62,0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999, padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 32,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          maxWidth: 640, width: '100%',
        }} className="landing-nav">
          <Image src="/logo-verde.svg" alt="Contaí" width={88} height={26} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }} priority />
          <div style={{ flex: 1 }} />
          <Link href="/login" className="landing-nav-entrar" style={{ fontSize: 14, fontWeight: 600, color: 'rgba(250,247,240,0.65)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Entrar</Link>
          <Link href="/signup" style={{ fontSize: 13, fontWeight: 700, color: '#0F3D3E', background: '#F5D060', borderRadius: 999, padding: '8px 20px', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 12px rgba(212,163,115,0.35)' }}>
            Começar grátis
          </Link>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(15,61,62,0.6) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '35%', left: '30%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(212,163,115,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '35%', right: '25%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(15,61,62,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', maxWidth: 720, position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,208,96,0.1)', border: '1px solid rgba(245,208,96,0.2)', borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#F5D060', letterSpacing: '.5px', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5D060', display: 'inline-block' }} />
            7 DIAS GRÁTIS · SEM CARTÃO · SEM ACESSO AO BANCO
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24, color: '#FAF7F0' }}>
            Pare de perder o controle<br />
            <span style={{ background: 'linear-gradient(90deg, #F5D060, #e8c090)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              no meio do mês
            </span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(250,247,240,0.55)', lineHeight: 1.65, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            Registre qualquer gasto em segundos digitando do jeito que fala. O Contaí organiza tudo e te avisa antes do dinheiro acabar — sem planilha, sem integração bancária.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <Link href="/signup" style={{ fontSize: 16, fontWeight: 800, color: '#0F3D3E', background: '#F5D060', borderRadius: 999, padding: '16px 36px', textDecoration: 'none', boxShadow: '0 4px 24px rgba(245,208,96,0.35)', letterSpacing: '-.2px' }}>
              Começar 7 dias grátis
            </Link>
            <Link href="#demo" style={{ fontSize: 16, fontWeight: 600, color: 'rgba(250,247,240,0.7)', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: '16px 28px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
              Ver demo ao vivo →
            </Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(250,247,240,0.25)', marginTop: 12 }}>Sem cartão de crédito · Cancele quando quiser</p>
        </div>

        {/* 3 phones fan */}
        <div className="landing-phones" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0, marginTop: 64, position: 'relative', zIndex: 1 }}>
          {/* Glow under phones */}
          <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 700, height: 200, background: 'radial-gradient(ellipse, rgba(15,61,62,0.5) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ transform: 'translateY(40px) rotate(-9deg) translateX(30px)', transformOrigin: 'bottom center', zIndex: 1, opacity: 0.85 }}>
            <PhoneShell><ScreenChat /></PhoneShell>
          </div>
          <div style={{ zIndex: 3, transform: 'translateY(-20px)' }}>
            <PhoneShell style={{ boxShadow: '0 60px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1), 0 0 80px rgba(15,61,62,0.4)' }}>
              <ScreenDashboard />
            </PhoneShell>
          </div>
          <div style={{ transform: 'translateY(40px) rotate(9deg) translateX(-30px)', transformOrigin: 'bottom center', zIndex: 1, opacity: 0.85 }}>
            <PhoneShell><ScreenAnalysis /></PhoneShell>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ padding: '32px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Não acessa sua conta bancária', 'Funciona como app no celular', 'Seus dados nunca são compartilhados', '7 dias grátis sem cartão'].map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />}
              <span style={{ fontSize: 13, color: 'rgba(250,247,240,0.45)', fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── NA PRÁTICA ── */}
      <section style={{ padding: '20px 24px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F5D060', letterSpacing: '2px', marginBottom: 12 }}>NA PRÁTICA</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#FAF7F0', letterSpacing: '-1px' }}>
            É só digitar do jeito que você fala
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            {
              msg: '"gastei 150 na gasolina hoje"',
              resp: 'Registrado! R$ 150,00 em Gasolina — você usou 62% do limite dessa categoria.',
              tag: 'Registro simples',
            },
            {
              msg: '"mercado 87,40 no débito"',
              resp: 'Salvo! R$ 87,40 em Alimentação via débito. Restam R$ 312,60 no ciclo.',
              tag: 'Forma de pagamento',
            },
            {
              msg: '"quanto gastei esse mês?"',
              resp: 'Você gastou R$ 1.374,63 de R$ 2.000,00. Faltam 25 dias — sua média ideal é R$ 25/dia.',
              tag: 'Consulta em linguagem natural',
            },
          ].map(c => (
            <div key={c.tag} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#F5D060', letterSpacing: '1px' }}>{c.tag.toUpperCase()}</div>
              <div style={{ background: 'rgba(15,61,62,0.7)', border: '1px solid rgba(15,61,62,0.9)', borderRadius: '12px 12px 3px 12px', padding: '10px 14px', alignSelf: 'flex-end', maxWidth: '90%' }}>
                <span style={{ fontSize: 13, color: '#FAF7F0', fontStyle: 'italic' }}>{c.msg}</span>
              </div>
              <div style={{ background: 'rgba(250,247,240,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px 12px 12px 3px', padding: '10px 14px', maxWidth: '90%' }}>
                <span style={{ fontSize: 13, color: 'rgba(250,247,240,0.75)', lineHeight: 1.5 }}>{c.resp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F5D060', letterSpacing: '2px', marginBottom: 16 }}>FUNCIONALIDADES</div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 14, letterSpacing: '-1px' }}>
            Tudo que você precisa para<br />nunca mais perder o controle
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.45)', maxWidth: 480, margin: '0 auto' }}>
            Sem integração com banco. Sem compartilhar senha. Você lança os gastos e o Contaí faz o resto.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {([
            { icon: <IconMic size={22} color="#F5D060" />, title: 'Registro em linguagem natural', desc: 'Digite ou fale o gasto do jeito que você fala no dia a dia. O Contaí identifica valor, categoria e forma de pagamento automaticamente.' },
            { icon: <IconBell size={22} color="#F5D060" />, title: 'Saiba antes do orçamento estourar', desc: 'Defina um limite por ciclo e acompanhe o percentual consumido em tempo real. O app projeta se você vai passar antes do fim do mês.' },
            { icon: <IconChart size={22} color="#F5D060" />, title: 'Score de saúde financeira 0–100', desc: 'Sua situação financeira em um número. Calculado com base no uso do limite, variação entre ciclos e padrão de gastos.' },
            { icon: <IconCalendar size={22} color="#F5D060" />, title: 'Mapa de calor do ciclo', desc: 'Veja de uma olhada quais foram os dias de maior gasto no mês. Identifique padrões e pontos de atenção no seu comportamento.' },
            { icon: <IconLightbulb size={22} color="#F5D060" />, title: 'Onde você pode economizar', desc: 'O Contaí compara seu gasto atual com o ciclo anterior e aponta em quais categorias você gastou mais — com o valor exato da diferença.' },
            { icon: <IconRepeat size={22} color="#F5D060" />, title: 'Detecção de gastos recorrentes', desc: 'Assinaturas e cobranças fixas são identificadas automaticamente. Você vê quanto dessas despesas fixas pesam no seu orçamento.' },
          ] as { icon: React.ReactNode; title: string; desc: string }[]).map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px' }}>
              <FeatureIconBox>{f.icon}</FeatureIconBox>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#FAF7F0', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(250,247,240,0.45)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO SIMULATOR ── */}
      <div id="demo">
        <LandingDemo />
      </div>

      {/* ── SHOWCASE: Chat ── */}
      <section style={{ padding: '100px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 72, flexWrap: 'wrap', justifyContent: 'center' }}>
          <PhoneShell style={{ boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 60px rgba(15,61,62,0.3), 0 0 0 1px rgba(255,255,255,0.08)' }}>
            <ScreenChat />
          </PhoneShell>
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F5D060', letterSpacing: '2px', marginBottom: 16 }}>REGISTRO INTELIGENTE</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 18, lineHeight: 1.15, letterSpacing: '-1px' }}>
              Acabou de pagar? Registre em 5 segundos
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(250,247,240,0.5)', lineHeight: 1.7, marginBottom: 28 }}>
              Sem abrir campos, sem selecionar categoria. Você digita do jeito que fala e o Contaí entende, categoriza e salva automaticamente — inclusive a forma de pagamento.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {['"pizza 38 reais no jantar"', '"gasolina 150 pix"', '"mercado 87,40 no débito"'].map(ex => (
                <div key={ex} style={{ background: 'rgba(15,61,62,0.6)', border: '1px solid rgba(15,61,62,0.8)', color: '#FAF7F0', borderRadius: '14px 14px 3px 14px', padding: '10px 16px', fontSize: 14, display: 'inline-block', alignSelf: 'flex-end', fontWeight: 500 }}>
                  {ex}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CheckItem light>Categorização automática sem IA externa</CheckItem>
              <CheckItem light>Detecta forma de pagamento (pix, débito, crédito)</CheckItem>
              <CheckItem light>Histórico completo salvo na conversa</CheckItem>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE: Resumo ── */}
      <section style={{ padding: '100px 24px', background: 'rgba(15,61,62,0.08)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 72, flexWrap: 'wrap-reverse', justifyContent: 'center' }}>
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F5D060', letterSpacing: '2px', marginBottom: 16 }}>RESUMO DO CICLO</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 18, lineHeight: 1.15, letterSpacing: '-1px' }}>
              Aja antes do dinheiro acabar
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(250,247,240,0.5)', lineHeight: 1.7, marginBottom: 28 }}>
              Total gasto, quanto ainda pode gastar por dia e onde o dinheiro foi. Uma tela só, sem precisar abrir calculadora ou checar o extrato bancário.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CheckItem light>Total gasto e restante no ciclo em destaque</CheckItem>
              <CheckItem light>Média ideal de gasto por dia para fechar no zero</CheckItem>
              <CheckItem light>Barras por categoria — veja onde está pesando</CheckItem>
              <CheckItem light>Dias restantes no ciclo em tempo real</CheckItem>
            </div>
          </div>
          <PhoneShell style={{ boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 60px rgba(15,61,62,0.25), 0 0 0 1px rgba(255,255,255,0.08)' }}>
            <ScreenDashboard />
          </PhoneShell>
        </div>
      </section>

      {/* ── SHOWCASE: Análise ── */}
      <section style={{ padding: '100px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 72, flexWrap: 'wrap', justifyContent: 'center' }}>
          <PhoneShell style={{ boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 60px rgba(15,61,62,0.3), 0 0 0 1px rgba(255,255,255,0.08)' }}>
            <ScreenAnalysis />
          </PhoneShell>
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F5D060', letterSpacing: '2px', marginBottom: 16 }}>ANÁLISE DO COMPORTAMENTO</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 18, lineHeight: 1.15, letterSpacing: '-1px' }}>
              Descubra os padrões que drenam seu dinheiro
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(250,247,240,0.5)', lineHeight: 1.7, marginBottom: 28 }}>
              Você gasta mais às sextas? Seus supérfluos estão crescendo? O Contaí responde essas perguntas com dados reais do seu ciclo — não com achismos.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CheckItem light>Score de saúde financeira 0–100 com diagnóstico</CheckItem>
              <CheckItem light>Mapa de calor: veja seus dias mais pesados</CheckItem>
              <CheckItem light>% de gastos essenciais vs supérfluos</CheckItem>
              <CheckItem light>Comparativo direto com o ciclo anterior</CheckItem>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRIVACIDADE ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F5D060', letterSpacing: '2px', marginBottom: 16 }}>PRIVACIDADE</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 14, letterSpacing: '-1px' }}>
            Seus dados são seus. Ponto.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.45)', maxWidth: 520, margin: '0 auto 48px' }}>
            O Contaí não acessa sua conta bancária, não lê seu extrato e não pede suas senhas. Você tem controle total sobre o que registra.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {([
              { icon: <IconLock size={22} color="#F5D060" />, title: 'Sem acesso bancário', desc: 'Você registra os gastos manualmente. O Contaí nunca acessa sua conta, cartão ou extrato.' },
              { icon: <IconEyeOff size={22} color="#F5D060" />, title: 'Dados não são vendidos', desc: 'Suas informações financeiras são suas. Jamais serão compartilhadas ou usadas para publicidade.' },
              { icon: <IconShield size={22} color="#F5D060" />, title: 'Armazenamento seguro', desc: 'Todos os dados ficam em servidores com criptografia. Só você acessa sua conta.' },
            ] as { icon: React.ReactNode; title: string; desc: string }[]).map(p => (
              <div key={p.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px', textAlign: 'left' }}>
                <FeatureIconBox>{p.icon}</FeatureIconBox>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FAF7F0', marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(250,247,240,0.45)', lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 14, letterSpacing: '-1px' }}>Comece em 4 passos</h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.4)', marginBottom: 64 }}>Sem configuração complicada. Você está registrando gastos em menos de 2 minutos.</p>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            {[
              { n: '1', title: 'Crie sua conta', desc: 'Cadastro rápido, sem cartão de crédito. 7 dias grátis para testar à vontade.' },
              { n: '2', title: 'Defina seu limite do ciclo', desc: 'Coloque o valor máximo que quer gastar no mês. É esse número que o Contaí vai proteger.' },
              { n: '3', title: 'Registre seus gastos do jeito que preferir', desc: 'Digite em linguagem natural, use o microfone ou preencha o formulário manual.' },
              { n: '4', title: 'Acompanhe e ajuste o comportamento', desc: 'Veja onde o dinheiro foi, compare com meses anteriores e tome decisões antes de estourar o orçamento.' },
            ].map((s, i, arr) => (
              <div key={s.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F5D060', color: '#0F3D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>{s.n}</div>
                  {i < arr.length - 1 && <div style={{ width: 1, height: 44, background: 'rgba(212,163,115,0.2)', margin: '4px 0' }} />}
                </div>
                <div style={{ paddingTop: 10, paddingBottom: i < arr.length - 1 ? 44 : 0 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#FAF7F0', marginBottom: 4 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(250,247,240,0.45)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREÇO ── */}
      <section style={{ padding: '100px 24px', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 12, letterSpacing: '-1px' }}>Simples assim</h2>
        <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.4)', marginBottom: 48 }}>Um plano único. Acesso completo. Sem pegadinha.</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '40px 36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(245,208,96,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 16, right: 16, background: '#F5D060', color: '#0F3D3E', fontSize: 11, fontWeight: 800, letterSpacing: '.5px', borderRadius: 999, padding: '4px 12px' }}>7 DIAS GRÁTIS</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,247,240,0.35)', letterSpacing: '1px', marginBottom: 16 }}>PLANO MENSAL</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#F5D060', alignSelf: 'flex-start', marginTop: 12 }}>R$</span>
            <span style={{ fontSize: 64, fontWeight: 900, color: '#FAF7F0', lineHeight: 1 }}>9</span>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#FAF7F0', lineHeight: 1, marginBottom: 5 }}>,90</span>
            <span style={{ fontSize: 14, color: 'rgba(250,247,240,0.35)', marginBottom: 10 }}>/mês</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(250,247,240,0.3)', marginBottom: 36 }}>Após 7 dias grátis · Cancele a qualquer momento</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 36, textAlign: 'left' }}>
            {[
              'Registro por texto em linguagem natural',
              'Limite de gastos por ciclo com alertas visuais',
              'Score de saúde financeira 0–100',
              'Mapa de calor por dia do ciclo',
              'Comparativo automático com o mês anterior',
              'Detecção de gastos recorrentes',
              'Divisão entre essencial e supérfluo',
              'Funciona como app instalado no celular',
              'Seus dados nunca são compartilhados',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,208,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#F5D060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(250,247,240,0.7)' }}>{item}</span>
              </div>
            ))}
          </div>
          <Link href="/signup" style={{ display: 'block', textAlign: 'center', fontSize: 16, fontWeight: 800, color: '#0F3D3E', background: '#F5D060', borderRadius: 999, padding: '16px', textDecoration: 'none', boxShadow: '0 4px 24px rgba(245,208,96,0.3)' }}>
            Começar 7 dias grátis
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(250,247,240,0.2)', marginTop: 16 }}>Sem cartão de crédito necessário</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#FAF7F0', textAlign: 'center', marginBottom: 48, letterSpacing: '-1px' }}>Dúvidas frequentes</h2>
          {[
            { q: 'Preciso cadastrar cartão de crédito para começar?', a: 'Não. Os 7 dias de trial são 100% gratuitos e sem necessidade de informar qualquer forma de pagamento. Você só assina se quiser continuar depois do período.' },
            { q: 'O Contaí acessa minha conta bancária ou cartão?', a: 'Não. O Contaí funciona com registro manual — você digita o gasto do jeito que fala e o app categoriza. Nenhuma senha bancária é solicitada e nenhum extrato é lido.' },
            { q: 'Como o app funciona sem integração bancária?', a: 'Você registra os gastos na hora em que acontecem, como uma espécie de diário financeiro rápido. A proposta é justamente te manter consciente do que está saindo — e não depender de sincronização automática que às vezes falha ou atrasa.' },
            { q: 'Funciona como aplicativo no celular?', a: 'Sim. Ao abrir o Contaí no celular, você pode adicionar o atalho à tela inicial e ele se comporta exatamente como um app instalado — com ícone, tela cheia e acesso offline parcial. Sem precisar de App Store ou Play Store.' },
            { q: 'Posso cancelar a qualquer momento?', a: 'Sim, sem multa e sem burocracia. Cancele quando quiser pelo próprio app. Você continua com acesso até o fim do período já pago.' },
            { q: 'Meus dados ficam seguros?', a: 'Seus dados são armazenados com criptografia e jamais são compartilhados ou usados para publicidade. Só você tem acesso à sua conta.' },
          ].map(item => (
            <details key={item.q} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 20, marginBottom: 20 }}>
              <summary style={{ fontSize: 16, fontWeight: 600, color: 'rgba(250,247,240,0.85)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                {item.q}
                <span style={{ color: '#F5D060', fontSize: 20, fontWeight: 300, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ fontSize: 14, color: 'rgba(250,247,240,0.45)', lineHeight: 1.7, marginTop: 12 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(15,61,62,0.5) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 900, color: '#FAF7F0', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-1.5px' }}>
            Chega de chegar no fim do mês sem saber onde o dinheiro foi
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.45)', marginBottom: 40, lineHeight: 1.6 }}>Teste grátis por 7 dias. Sem cartão. Cancele quando quiser.</p>
          <Link href="/signup" style={{ display: 'inline-block', fontSize: 17, fontWeight: 800, color: '#0F3D3E', background: '#F5D060', borderRadius: 999, padding: '18px 48px', textDecoration: 'none', boxShadow: '0 4px 40px rgba(245,208,96,0.35)', letterSpacing: '-.2px' }}>
            Criar conta grátis agora
          </Link>
        </div>
      </section>

      {/* ── MOBILE CSS ── */}
      <style>{`
        @media (max-width: 600px) {
          .landing-nav { gap: 16px !important; padding: 8px 14px !important; }
          .landing-nav-entrar { display: none !important; }
          .landing-phones { display: none !important; }
          .landing-showcase { gap: 40px !important; padding: 60px 24px !important; }
          .landing-section { padding: 60px 24px !important; }
        }
      `}</style>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
        <Image src="/logo.png" alt="Contaí" width={80} height={24} style={{ objectFit: 'contain', opacity: 0.35 }} />
        <p style={{ fontSize: 12, color: 'rgba(250,247,240,0.2)' }}>© {new Date().getFullYear()} Contaí · Todos os direitos reservados</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/login" style={{ fontSize: 12, color: 'rgba(250,247,240,0.3)', textDecoration: 'none' }}>Entrar</Link>
          <Link href="/signup" style={{ fontSize: 12, color: 'rgba(250,247,240,0.3)', textDecoration: 'none' }}>Criar conta</Link>
        </div>
      </footer>
    </div>
  )
}
