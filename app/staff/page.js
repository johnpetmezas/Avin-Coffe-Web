"use client";
import { useState, useEffect } from 'react';
import OrderCard from '@/components/staff/OrderCard';
import { Bell, Coffee } from 'lucide-react';

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [bellFlashing, setBellFlashing] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/staff');
      if (res.ok) {
        const data = await res.json();
        const activeOrders = data.orders.filter(o => o && o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'pending');
        
        if (activeOrders.length > prevCount) {
          setBellFlashing(true);
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Audio autoplay blocked'));
          setTimeout(() => setBellFlashing(false), 5000);
        }
        
        setOrders(activeOrders);
        setPrevCount(activeOrders.length);
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
    const interval = setInterval(fetchOrders, 5000);
    
    const eventSource = new EventSource('/api/orders/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order_updated' || data.type === 'new_order') {
        fetchOrders();
      }
    };
    
    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, [prevCount]);

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
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '5rem' }}>
      <header style={{ 
        background: 'var(--secondary)', 
        padding: '2.5rem 3.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900' }}>Staff Dashboard</h1>
          <p style={{ opacity: 0.5, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em' }}>Live Order Stream</p>
        </div>
        
        <div style={{ 
          background: bellFlashing ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
          padding: '1.25rem',
          borderRadius: '1.5rem',
          position: 'relative',
          transition: 'all 0.3s ease',
          transform: bellFlashing ? 'scale(1.1)' : 'scale(1)'
        }}>
          <Bell size={24} style={{ color: 'white' }} />
          {orders.filter(o => o.status === 'confirmed').length > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-5px', 
              background: 'red', 
              color: 'white', 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.75rem', 
              fontWeight: '900',
              border: '3px solid var(--secondary)'
            }}>
              {orders.filter(o => o.status === 'confirmed').length}
            </span>
          )}
        </div>
      </header>

      <main className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="staff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
          ))}
        </div>
        
        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '10rem 0', opacity: 0.2 }}>
            <Coffee size={80} style={{ margin: '0 auto 2rem' }} />
            <p style={{ fontSize: '1.25rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Αναμονή για παραγγελίες...</p>
          </div>
        )}
      </main>
    </div>
  );
}
