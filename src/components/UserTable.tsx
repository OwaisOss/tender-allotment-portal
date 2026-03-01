'use client';

import { useState } from 'react';
import UserActions from './UserActions';
import EditUserModal from './EditUserModal';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  fromDate: string;
  toDate: string;
  status: 'Active' | 'Inactive';
}

interface UserTableProps {
  users: User[];
  onUpdate: () => void;
}

function displayDate(d: string): string {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const [y, m, day] = d.split('-');
  return `${day}-${m}-${y}`;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const avatarHues = ['#e8e8ff', '#e8f5ee', '#fff3e8', '#f3e8ff', '#e8f3ff'];
const avatarText = ['#4040c0', '#1a7a42', '#b05010', '#6b20b0', '#1060b0'];

export default function UserTable({ users, onUpdate }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (users.length === 0) {
    return (
      <div style={{
        padding: '4rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}>
        No users yet. Add one to get started.
      </div>
    );
  }

  const thStyle: React.CSSProperties = {
    padding: '0 1.25rem 0.75rem',
    textAlign: 'left',
    fontSize: '0.7rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    whiteSpace: 'nowrap',
  };

  const tdStyle: React.CSSProperties = {
    padding: '0.875rem 1.25rem',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    borderTop: '1px solid var(--border)',
    verticalAlign: 'middle',
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, paddingTop: '0.875rem', paddingLeft: '1.25rem' }}>User</th>
              <th style={{ ...thStyle, paddingTop: '0.875rem' }}>Phone</th>
              <th style={{ ...thStyle, paddingTop: '0.875rem' }}>From</th>
              <th style={{ ...thStyle, paddingTop: '0.875rem' }}>To</th>
              <th style={{ ...thStyle, paddingTop: '0.875rem' }}>Status</th>
              <th style={{ ...thStyle, paddingTop: '0.875rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => {
              const bg = avatarHues[idx % avatarHues.length];
              const fg = avatarText[idx % avatarText.length];
              return (
                <tr
                  key={user.id}
                  style={{ transition: 'background 0.1s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-subtle)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td style={{ ...tdStyle, color: 'var(--text-primary)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: fg,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        letterSpacing: '0.02em',
                      }}>
                        {getInitials(user.name)}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-geist-mono), monospace' }}>
                    {user.phoneNumber}
                  </td>
                  <td style={tdStyle}>{displayDate(user.fromDate)}</td>
                  <td style={tdStyle}>{displayDate(user.toDate)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: user.status === 'Active' ? 'var(--success)' : 'var(--text-muted)',
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: user.status === 'Active' ? 'var(--success)' : 'var(--border-strong)',
                        flexShrink: 0,
                      }} />
                      {user.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <UserActions user={user} onEdit={setEditingUser} onUpdate={onUpdate} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {users.map((user, idx) => {
          const bg = avatarHues[idx % avatarHues.length];
          const fg = avatarText[idx % avatarText.length];
          return (
            <div
              key={user.id}
              style={{
                padding: '1rem 1.25rem',
                borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: fg,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{user.phoneNumber}</p>
                  </div>
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: user.status === 'Active' ? 'var(--success)' : 'var(--text-muted)',
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: user.status === 'Active' ? 'var(--success)' : 'var(--border-strong)',
                  }} />
                  {user.status}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '0.875rem',
                padding: '0.75rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div>
                  <p style={{ margin: '0 0 0.15rem', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>From</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{displayDate(user.fromDate)}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.15rem', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>To</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{displayDate(user.toDate)}</p>
                </div>
              </div>

              <UserActions user={user} onEdit={setEditingUser} onUpdate={onUpdate} />
            </div>
          );
        })}
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={() => { setEditingUser(null); onUpdate(); }}
        />
      )}
    </>
  );
}
