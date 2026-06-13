import Image from 'next/image'

export default function Loading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0F3D3E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 32,
    }}>
      <Image
        src="/logo.png"
        alt="Contaí"
        width={160}
        height={50}
        style={{ objectFit: 'contain', mixBlendMode: 'screen' }}
        priority
      />

      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#D4A373',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
