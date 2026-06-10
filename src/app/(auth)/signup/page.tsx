'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

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
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Confirme seu e-mail</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Enviamos um link de confirmação para <strong style={{ color: 'var(--text)' }}>{email}</strong>. Verifique sua caixa de entrada.
          </p>
          <a href="/login" className="block mt-6 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Voltar ao login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'var(--accent)' }}>
            <span className="text-2xl font-bold" style={{ color: 'var(--card)' }}>C</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Conta<span style={{ color: 'var(--gold)' }}>í</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Crie sua conta gratuita</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full rounded-2xl px-4 py-3.5 text-base outline-none transition-all"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="mínimo 6 caracteres"
              minLength={6}
              required
              className="w-full rounded-2xl px-4 py-3.5 text-base outline-none transition-all"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {error && (
            <p className="text-sm text-center font-medium" style={{ color: 'var(--red)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-base font-bold transition-opacity mt-2"
            style={{ background: 'var(--accent)', color: 'var(--card)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
          Já tem conta?{' '}
          <a href="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}
