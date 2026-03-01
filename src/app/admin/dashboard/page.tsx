'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from '@/components/UserTable';
import AddUserModal from '@/components/AddUserModal';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  fromDate: string;
  toDate: string;
  status: 'Active' | 'Inactive';
}

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { fetchUsers(); }, [refreshKey]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users/list', { cache: 'no-store' });
      if (res.status === 401) { router.push('/admin'); return; }
      if (!res.ok) return;
      setUsers(await res.json() || []);
    } catch {
      console.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-subtle)' }}>
      {/* Top bar */}
      <header style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 22,
            height: 22,
            background: 'var(--text-primary)',
            borderRadius: 5,
            flexShrink: 0,
          }} />
          <span style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            Subscription Portal
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Page heading */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{
            fontSize: '1.35rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Users
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage subscription access
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}>
          {[
            { label: 'Total', value: users.length },
            { label: 'Active', value: activeCount, accent: 'var(--success)' },
            { label: 'Inactive', value: inactiveCount },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1.125rem 1.25rem',
              }}
            >
              <p style={{
                margin: 0,
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.4rem',
              }}>
                {stat.label}
              </p>
              <p style={{
                margin: 0,
                fontSize: '2rem',
                fontWeight: 700,
                color: stat.accent ?? 'var(--text-primary)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}>
                {loading ? '—' : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}>
          {/* Table toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}>
              {loading ? 'Loading…' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.875rem',
                background: 'var(--text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-fg)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.15s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add user
            </button>
          </div>

          {loading ? (
            <div style={{
              padding: '4rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}>
              Loading…
            </div>
          ) : (
            <UserTable users={users} onUpdate={() => setRefreshKey(p => p + 1)} />
          )}
        </div>
      </main>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={() => { setShowAddModal(false); setRefreshKey(p => p + 1); }}
        />
      )}
    </div>
  );
}
