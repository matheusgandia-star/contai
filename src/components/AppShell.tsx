'use client'

interface Props {
  title?: string
  right?: React.ReactNode
  children: React.ReactNode
}

export default function AppShell({ title, right, children }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header fixo */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--accent)', borderBottom: '1px solid rgba(15,61,62,.8)',
        padding: '0 18px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#FAF7F0', lineHeight: 1 }}>
          Conta<span style={{ color: 'var(--gold)' }}>í</span>
        </span>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textAlign: 'right' }}>
          {right ?? title ?? null}
        </div>
      </header>

      {/* Conteúdo com espaço para o BottomNav (56px) */}
      <main style={{ flex: 1, padding: '14px 14px 72px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
