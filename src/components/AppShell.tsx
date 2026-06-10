'use client'

import Image from 'next/image'

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
        <Image
          src="/logo.png"
          alt="Contaí"
          height={22}
          width={78}
          style={{ objectFit: 'contain', mixBlendMode: 'screen' }}
          priority
        />
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', textAlign: 'right' }}>
          {right ?? title ?? null}
        </div>
      </header>

      <div style={{ padding: '16px 16px 80px' }}>
        {children}
      </div>
    </>
  )
}
