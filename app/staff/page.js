"use client";
import { useState, useEffect } from 'react';
import OrderCard from '@/components/staff/OrderCard';

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/staff');
      if (res.ok) {
        const data = await res.json();
        // Filter out completed and cancelled orders
        const activeOrders = data.orders.filter(o => o && o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'pending');
        setOrders(activeOrders);
      } else {
        if (res.status === 401 || res.redirected) {
           window.location.href = '/staff/login';
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Use polling as fallback for SSE
    const interval = setInterval(fetchOrders, 5000);
    
    // SSE Stream setup
    const eventSource = new EventSource('/api/orders/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order_updated' || data.type === 'new_order') {
        fetchOrders();
        // Play audio alert (optional)
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio autoplay blocked'));
      }
    };
    
    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newStatus === 'completed' ? 'completed' : newStatus === 'ready' ? 'ready' : 'confirm' })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <header style={{ background: 'var(--surface)', padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ color: 'var(--primary)' }}>Staff Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span className="badge badge-confirmed">New Orders: {orders.filter(o => o.status === 'confirmed').length}</span>
        </div>
      </header>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="staff-grid">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
          ))}
          {orders.length === 0 && (
            <p style={{ color: 'var(--secondary)' }}>No active orders.</p>
          )}
        </div>
      </main>
    </div>
  );
}
