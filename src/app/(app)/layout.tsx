import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: 480, margin: '0 auto',
      minHeight: '100vh',
      position: 'relative',
      background: 'var(--bg)',
    }}>
      {children}
      <BottomNav />
    </div>
  )
}
