import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 480, marginInline: 'auto', background: 'var(--bg)', minHeight: '100dvh' }}>
      {children}
      <BottomNav />
    </div>
  )
}
