import Link from 'next/link';

export default function Home() {
  return (
    <div
      style={{ background: 'var(--bg)', minHeight: '100vh' }}
      className="flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm">
        {/* Logo / Icon area */}
        <div className="flex justify-center mb-8">
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--bg)',
              boxShadow: '8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        {/* Main card */}
        <div
          style={{
            background: 'var(--bg)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--neu-flat)',
            padding: '2.5rem',
          }}
        >
          <h1
            style={{ color: 'var(--text-primary)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}
          >
            Subscription Portal
          </h1>
          <p
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6 }}
          >
            Manage your mobile app subscriptions and check subscription status.
          </p>

          <Link
            href="/admin"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: '0.85rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(145deg, #7b8ef5, #5a6cd4)',
              boxShadow: '4px 4px 8px var(--shadow-dark), -2px -2px 6px rgba(255,255,255,0.5)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              letterSpacing: '0.02em',
            }}
          >
            Admin Portal
          </Link>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0' }}>
            <div
              style={{
                flex: 1,
                height: 1,
                background: 'none',
                boxShadow: 'inset 0 1px 2px var(--shadow-dark)',
                borderRadius: 2,
              }}
            />
            <span style={{ padding: '0 0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em' }}>
              OR
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: 'none',
                boxShadow: 'inset 0 1px 2px var(--shadow-dark)',
                borderRadius: 2,
              }}
            />
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.6 }}>
            For mobile app developers: Use the{' '}
            <code
              style={{
                background: 'var(--bg)',
                boxShadow: 'var(--neu-pressed)',
                borderRadius: 'var(--radius-xs)',
                padding: '2px 6px',
                fontSize: '0.7rem',
                color: 'var(--accent)',
                fontFamily: 'var(--font-geist-mono)',
              }}
            >
              /api/check-subscription
            </code>{' '}
            endpoint to verify subscriptions.
          </p>

          {/* API info */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1.25rem',
              background: 'var(--bg)',
              boxShadow: 'var(--neu-inset)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <h3 style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.75rem', fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              API Endpoints
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.65rem' }}>POST</span>
                <code style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-geist-mono)' }}>/api/check-subscription</code>
              </li>
              <li style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.65rem' }}>POST</span>
                <code style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-geist-mono)' }}>/api/check-user</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
