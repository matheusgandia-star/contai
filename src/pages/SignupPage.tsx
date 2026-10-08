import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0F3D3E' }}>
        <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#FAF7F0' }}>Confirme seu e-mail</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            Enviamos um link de confirmação para <strong style={{ color: '#FAF7F0' }}>{email}</strong>. Verifique sua caixa de entrada.
          </p>
          <a href="/login" style={{ display: 'block', marginTop: 24, fontSize: 14, fontWeight: 600, color: 'var(--gold)', textDecoration: 'none' }}>
            Voltar ao login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0F3D3E' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/logo.png" alt="Contaí" width={160} height={45} style={{ objectFit: 'contain', margin: '0 auto', display: 'block' }} />
          <p style={{ fontSize: 14, marginTop: 12, color: 'rgba(255,255,255,0.55)' }}>Crie sua conta gratuita</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', color: 'rgba(255,255,255,0.6)' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{ width: '100%', borderRadius: 16, padding: '14px 16px', fontSize: 16, outline: 'none', transition: 'border-color .2s', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff' }}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', color: 'rgba(255,255,255,0.6)' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="mínimo 6 caracteres"
              minLength={6}
              required
              style={{ width: '100%', borderRadius: 16, padding: '14px 16px', fontSize: 16, outline: 'none', transition: 'border-color .2s', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff' }}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
          </div>

          {error && <p style={{ fontSize: 14, textAlign: 'center', fontWeight: 500, color: '#FCA5A5' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, background: 'var(--gold)', color: '#0F3D3E', opacity: loading ? 0.7 : 1, transition: 'opacity .2s' }}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, marginTop: 24, color: 'rgba(255,255,255,0.5)' }}>
          Já tem conta?{' '}
          <a href="/login" style={{ fontWeight: 600, color: 'var(--gold)', textDecoration: 'none' }}>
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}
