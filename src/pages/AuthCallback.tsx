import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    async function handleCallback() {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      } else {
        // hash-based flow — supabase handles it automatically on getSession
        await supabase.auth.getSession()
      }
      navigate('/', { replace: true })
    }

    handleCallback()
  }, [navigate])

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F3D3E' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#F5D060', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
