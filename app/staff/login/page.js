"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      
      if (res.ok) {
        router.push('/staff');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid PIN');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>AVIN Staff</h1>
        <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>Enter your PIN to access the dashboard</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            value={pin}
            onChange={e => {
              setPin(e.target.value);
              setError('');
            }}
            placeholder="****"
            style={{ 
              padding: '1rem', 
              fontSize: '2rem', 
              textAlign: 'center', 
              letterSpacing: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              background: 'var(--surface-hover)',
              color: 'var(--foreground)'
            }}
          />
          {error && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</span>}
          <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
