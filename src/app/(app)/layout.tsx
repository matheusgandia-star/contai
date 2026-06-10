import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: 480, margin: '0 auto',
      background: 'var(--bg)',
    }}>
      {children}
      <BottomNav />
    </div>
  )
}
