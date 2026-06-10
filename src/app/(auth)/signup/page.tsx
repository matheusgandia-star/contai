'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0F3D3E' }}>
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0F3D3E' }}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <Image src="/logo.png" alt="Contaí" width={160} height={45} style={{ objectFit: 'contain', margin: '0 auto' }} priority />
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.55)' }}>Crie sua conta gratuita</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full rounded-2xl px-4 py-3.5 text-base outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          {error && (
            <p className="text-sm text-center font-medium" style={{ color: '#FCA5A5' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-base font-bold transition-opacity mt-2"
            style={{ background: 'var(--gold)', color: '#0F3D3E', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Já tem conta?{' '}
          <a href="/login" className="font-semibold" style={{ color: 'var(--gold)' }}>
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}
