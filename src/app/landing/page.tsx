import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Contaí — Controle financeiro que cabe no seu dia',
  description: 'Registre gastos por voz, acompanhe limites e entenda seus hábitos financeiros. Simples, rápido e sem complicação.',
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17.91 11c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
      </svg>
    ),
    title: 'Registre por voz',
    desc: 'Fale "gastei 50 em gasolina" e o Contaí categoriza, salva e confirma. Sem digitar, sem perder tempo.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-6"/>
      </svg>
    ),
    title: 'Análise inteligente',
    desc: 'Score de saúde financeira, mapa de calor do mês, comparativo com ciclo anterior e previsão de gastos.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Limite por ciclo',
    desc: 'Defina quanto quer gastar no mês ou na fatura. O app avisa quando está chegando no limite.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    title: 'Resumo em segundos',
    desc: 'Painel visual com total gasto, média diária, categorias e dias restantes no ciclo. Tudo no primeiro olhar.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Oportunidades de economia',
    desc: 'O Contaí identifica onde você gastou mais que no mês anterior e mostra quanto pode economizar.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Seus dados, só seus',
    desc: 'Nenhuma informação é compartilhada com terceiros. Seus gastos ficam seguros e privados.',
  },
]

const steps = [
  { n: '1', title: 'Crie sua conta', desc: 'Cadastro em menos de 1 minuto, sem cartão de crédito.' },
  { n: '2', title: 'Defina seu limite', desc: 'Coloque o quanto quer gastar no mês ou na fatura do cartão.' },
  { n: '3', title: 'Registre seus gastos', desc: 'Por voz, por texto ou pelo formulário — do jeito que preferir.' },
  { n: '4', title: 'Acompanhe e melhore', desc: 'Veja onde o dinheiro vai e tome decisões melhores todo mês.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#FAF7F0', color: '#222', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,247,240,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(15,61,62,0.08)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <Image src="/logo.png" alt="Contaí" width={90} height={28} style={{ objectFit: 'contain' }} priority />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: '#0F3D3E', textDecoration: 'none' }}>
            Entrar
          </Link>
          <Link href="/auth/signup" style={{
            fontSize: 14, fontWeight: 700, color: '#FAF7F0',
            background: '#0F3D3E', borderRadius: 10, padding: '8px 18px',
            textDecoration: 'none',
          }}>
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0F3D3E 0%, #1a5c5d 60%, #0F3D3E 100%)',
        padding: '72px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(212,163,115,0.18)',
            border: '1px solid rgba(212,163,115,0.4)',
            borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700,
            color: '#D4A373', letterSpacing: '.5px', marginBottom: 24,
          }}>
            7 DIAS GRÁTIS · SEM CARTÃO
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 8vw, 52px)', fontWeight: 900, lineHeight: 1.1,
            color: '#FAF7F0', marginBottom: 20,
          }}>
            Controle financeiro que{' '}
            <span style={{ color: '#D4A373' }}>cabe no seu dia</span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(250,247,240,0.75)', lineHeight: 1.6, marginBottom: 40 }}>
            Registre gastos por voz em segundos, acompanhe seus limites e entenda seus hábitos — sem planilha, sem complicação.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{
              fontSize: 16, fontWeight: 800, color: '#0F3D3E',
              background: '#D4A373', borderRadius: 14, padding: '16px 32px',
              textDecoration: 'none', display: 'inline-block',
              boxShadow: '0 4px 24px rgba(212,163,115,0.4)',
            }}>
              Começar 7 dias grátis
            </Link>
            <Link href="#como-funciona" style={{
              fontSize: 16, fontWeight: 700, color: '#FAF7F0',
              background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 28px',
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Ver como funciona
            </Link>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(250,247,240,0.45)' }}>
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section style={{
        background: '#0F3D3E', padding: '18px 24px',
        display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap',
      }}>
        {[
          { n: '7 dias', l: 'de trial grátis' },
          { n: '100%', l: 'seus dados privados' },
          { n: '0', l: 'planilhas necessárias' },
        ].map(item => (
          <div key={item.l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#D4A373' }}>{item.n}</div>
            <div style={{ fontSize: 12, color: 'rgba(250,247,240,0.6)', fontWeight: 600 }}>{item.l}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#0F3D3E', marginBottom: 12 }}>
            Tudo que você precisa, nada que não precisa
          </h2>
          <p style={{ fontSize: 16, color: '#888', maxWidth: 480, margin: '0 auto' }}>
            O Contaí foi feito para quem quer controle financeiro sem burocracia.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: '#fff', borderRadius: 18, padding: '28px 24px',
              border: '1px solid rgba(15,61,62,0.08)',
              boxShadow: '0 2px 16px rgba(15,61,62,0.05)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(15,61,62,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0F3D3E', marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F3D3E', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ background: '#0F3D3E', padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#FAF7F0', marginBottom: 12 }}>
            Pronto em 4 passos
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.6)', marginBottom: 56 }}>
            Sem configuração complicada. Você começa a usar no primeiro minuto.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#D4A373', color: '#0F3D3E',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 900,
                  }}>{s.n}</div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 2, height: 40, background: 'rgba(212,163,115,0.25)', margin: '4px 0' }} />
                  )}
                </div>
                <div style={{ paddingTop: 10, paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#FAF7F0', marginBottom: 4 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(250,247,240,0.6)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇO */}
      <section style={{ padding: '80px 24px', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#0F3D3E', marginBottom: 12 }}>
          Simples assim
        </h2>
        <p style={{ fontSize: 16, color: '#888', marginBottom: 48 }}>
          Um plano único. Sem surpresas.
        </p>

        <div style={{
          background: '#0F3D3E', borderRadius: 24, padding: '40px 32px',
          boxShadow: '0 8px 48px rgba(15,61,62,0.2)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 16, right: 16,
            background: '#D4A373', color: '#0F3D3E',
            fontSize: 11, fontWeight: 800, letterSpacing: '.5px',
            borderRadius: 8, padding: '4px 10px',
          }}>
            7 DIAS GRÁTIS
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(250,247,240,0.6)', letterSpacing: '.5px', marginBottom: 12 }}>
            PLANO MENSAL
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#D4A373', alignSelf: 'flex-start', marginTop: 10 }}>R$</span>
            <span style={{ fontSize: 56, fontWeight: 900, color: '#FAF7F0', lineHeight: 1 }}>9</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#FAF7F0', lineHeight: 1, marginBottom: 4 }}>,90</span>
            <span style={{ fontSize: 14, color: 'rgba(250,247,240,0.5)', marginBottom: 8 }}>/mês</span>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(250,247,240,0.45)', marginBottom: 32 }}>
            Após 7 dias grátis · Cancele quando quiser
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, textAlign: 'left' }}>
            {[
              'Registro por voz e texto',
              'Análise e score de saúde financeira',
              'Comparativo entre ciclos',
              'Limite por categoria',
              'Histórico completo',
              'Acesso pelo celular como app',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(212,163,115,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#D4A373" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(250,247,240,0.8)' }}>{item}</span>
              </div>
            ))}
          </div>

          <Link href="/auth/signup" style={{
            display: 'block', textAlign: 'center',
            fontSize: 16, fontWeight: 800, color: '#0F3D3E',
            background: '#D4A373', borderRadius: 14, padding: '16px',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(212,163,115,0.35)',
          }}>
            Começar 7 dias grátis
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#F4F0E6', padding: '72px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#0F3D3E', textAlign: 'center', marginBottom: 48 }}>
            Dúvidas frequentes
          </h2>

          {[
            {
              q: 'Preciso de cartão de crédito para começar?',
              a: 'Não. Os 7 dias de trial são completamente gratuitos, sem precisar cadastrar nenhuma forma de pagamento.',
            },
            {
              q: 'O Contaí acessa minha conta bancária?',
              a: 'Não. Você registra os gastos manualmente — por voz, por texto ou pelo formulário. Seus dados bancários nunca são acessados.',
            },
            {
              q: 'Funciona como aplicativo no celular?',
              a: 'Sim. Você pode adicionar o Contaí à tela inicial do seu celular e ele funciona exatamente como um app — sem precisar baixar nada na loja.',
            },
            {
              q: 'Posso cancelar a qualquer momento?',
              a: 'Sim. Sem multa e sem burocracia. Cancele quando quiser e você continua com acesso até o fim do período pago.',
            },
            {
              q: 'Meus dados ficam seguros?',
              a: 'Sim. Seus dados ficam armazenados com segurança e nunca são compartilhados com terceiros ou usados para publicidade.',
            },
          ].map(item => (
            <details key={item.q} style={{
              borderBottom: '1px solid rgba(15,61,62,0.1)', paddingBottom: 20, marginBottom: 20,
            }}>
              <summary style={{
                fontSize: 16, fontWeight: 700, color: '#0F3D3E',
                cursor: 'pointer', listStyle: 'none', paddingBottom: 0,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {item.q}
                <span style={{ color: '#D4A373', fontSize: 22, fontWeight: 400 }}>+</span>
              </summary>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginTop: 12 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        background: 'linear-gradient(135deg, #0F3D3E 0%, #1a5c5d 100%)',
        padding: '80px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px, 6vw, 40px)', fontWeight: 900, color: '#FAF7F0', marginBottom: 16, lineHeight: 1.15 }}>
            Comece a entender para onde vai seu dinheiro
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,0.65)', marginBottom: 40, lineHeight: 1.6 }}>
            7 dias grátis. Sem cartão. Cancele quando quiser.
          </p>
          <Link href="/auth/signup" style={{
            display: 'inline-block', fontSize: 17, fontWeight: 800,
            color: '#0F3D3E', background: '#D4A373',
            borderRadius: 14, padding: '18px 40px',
            textDecoration: 'none',
            boxShadow: '0 4px 32px rgba(212,163,115,0.45)',
          }}>
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#0a2829', padding: '32px 24px',
        textAlign: 'center',
      }}>
        <Image src="/logo.png" alt="Contaí" width={80} height={25} style={{ objectFit: 'contain', marginBottom: 16, opacity: 0.6 }} />
        <p style={{ fontSize: 12, color: 'rgba(250,247,240,0.3)' }}>
          © {new Date().getFullYear()} Contaí · Todos os direitos reservados
        </p>
      </footer>

    </div>
  )
}
