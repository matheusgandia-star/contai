'use client'

interface Props {
  title?: string
  right?: React.ReactNode
  children: React.ReactNode
}

export default function AppShell({ title, right, children }: Props) {
  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--accent)', borderBottom: '1px solid rgba(15,61,62,.8)',
        padding: '0 18px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#FAF7F0', lineHeight: 1 }}>
          Conta<span style={{ color: 'var(--gold)' }}>í</span>
        </span>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', textAlign: 'right' }}>
          {right ?? title ?? null}
        </div>
      </header>

      <div style={{ padding: '14px 14px 72px' }}>
        {children}
      </div>
    </>
  )
}
