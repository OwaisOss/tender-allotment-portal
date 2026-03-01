'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  fromDate: string;
  toDate: string;
  status: 'Active' | 'Inactive';
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  maxLength,
  disabled,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        marginBottom: '0.4rem',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          background: 'var(--bg)',
          border: `1px solid ${focused ? 'var(--text-primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          transition: 'border-color 0.15s',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default function EditUserModal({ user, onClose, onUserUpdated }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [fromDate, setFromDate] = useState(user.fromDate);
  const [toDate, setToDate] = useState(user.toDate);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/users/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, name, phoneNumber, fromDate, toDate }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to update user'); setLoading(false); return; }
      onUserUpdated();
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50,
      }}
    >
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        width: '100%',
        maxWidth: 420,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}>
              Edit user
            </h2>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.name}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'all 0.12s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-muted)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required />
            <Field
              label="Phone number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
              disabled={loading}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="From" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} disabled={loading} required />
              <Field label="To" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} disabled={loading} required />
            </div>

            {error && (
              <div style={{
                padding: '0.625rem 0.875rem',
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
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.55rem 1rem',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.12s',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.55rem 1.125rem',
                background: loading ? 'var(--bg-muted)' : 'var(--text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: loading ? 'var(--text-muted)' : 'var(--accent-fg)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.8'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
