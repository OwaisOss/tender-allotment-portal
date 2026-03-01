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

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onUpdate: () => void;
}

export default function UserActions({ user, onEdit, onUpdate }: UserActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      const res = await fetch('/api/users/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      if (res.ok) onUpdate();
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${user.name}?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
      });
      if (res.ok) onUpdate();
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const ghostBtn: React.CSSProperties = {
    padding: '0.3rem 0.6rem',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xs)',
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.4 : 1,
    transition: 'all 0.12s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
        style={ghostBtn}
        onMouseEnter={(e) => {
          if (!loading) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
        }}
      >
        {loading ? '…' : user.status === 'Active' ? 'Deactivate' : 'Activate'}
      </button>

      <button
        onClick={() => onEdit(user)}
        disabled={loading}
        title="Edit"
        style={ghostBtn}
        onMouseEnter={(e) => {
          if (!loading) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
        }}
      >
        Edit
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        title="Delete"
        style={ghostBtn}
        onMouseEnter={(e) => {
          if (!loading) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#fca5a5';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)';
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--danger-bg)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
      >
        Delete
      </button>
    </div>
  );
}
