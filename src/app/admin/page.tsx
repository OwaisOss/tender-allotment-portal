'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Wordmark */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--text-primary)',
            borderRadius: 8,
            marginBottom: '1.25rem',
          }} />
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Admin Portal
          </h1>
          <p style={{
            marginTop: '0.35rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            margin: '0.35rem 0 0',
          }}>
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '0.4rem',
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              disabled={loading}
              autoComplete="username"
              style={{
                width: '100%',
                padding: '0.65rem 0.875rem',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--text-primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '0.4rem',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.65rem 0.875rem',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--text-primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.65rem 0.875rem',
              background: 'var(--danger-bg)',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.25rem',
              width: '100%',
              padding: '0.7rem',
              background: loading ? 'var(--bg-muted)' : 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: loading ? 'var(--text-muted)' : 'var(--accent-fg)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
