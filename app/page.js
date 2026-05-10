"use client";
import { useState, useEffect } from 'react';
import Menu from '@/components/customer/Menu';
import Cart from '@/components/customer/Cart';
import UndoToast from '@/components/customer/UndoToast';
import OrderStatus from '@/components/customer/OrderStatus';

import { TEXT } from '@/lib/constants';

export default function CustomerHome() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  // Simple polling for order updates
  useEffect(() => {
    let interval;
    if (activeOrder && activeOrder.status !== 'cancelled' && activeOrder.status !== 'completed') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/orders/${activeOrder.id}`);
          if (res.ok) {
            const data = await res.json();
            setActiveOrder(data.order);
          }
        } catch (err) {
          console.error('Failed to poll order status');
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = async (checkoutData) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Πελάτης ' + Math.floor(Math.random() * 100),
          ...checkoutData
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setActiveOrder({ id: data.orderId, status: 'pending' });
        setCartItems([]);
        setIsCartOpen(false);
        setShowUndo(true);
        
        // Request push permission
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
              });
              await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription, customerId: data.orderId })
              });
            }
          } catch (err) {
            console.error('Failed to register push', err);
          }
        }
      }
    } catch (error) {
      alert('Failed to place order.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      });
      if (res.ok) {
        setShowUndo(false);
        setActiveOrder(prev => ({ ...prev, status: 'cancelled' }));
      }
    } catch (error) {
      console.error('Failed to cancel order');
    }
  };

  const handleUndoTimeout = async () => {
    setShowUndo(false);
    if (activeOrder && activeOrder.status === 'pending') {
      try {
        const res = await fetch(`/api/orders/${activeOrder.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'submit' })
        });
        if (res.ok) {
          const data = await res.json();
          setActiveOrder(data.order);
        }
      } catch (error) {
        console.error('Failed to submit order after grace period');
      }
    }
  };

  return (
    <main className="container" style={{ padding: '4rem 1.5rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '5rem',
        background: 'var(--secondary)',
        padding: '2.5rem 3.5rem',
        borderRadius: '3rem',
        color: 'white',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>AVIN <span style={{ color: 'var(--primary)' }}>SOLOMOS</span></h1>
          <p style={{ opacity: 0.6, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', marginTop: '0.5rem' }}>
            {TEXT.businessName}
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsCartOpen(true)}
          style={{ 
            padding: '1rem 2rem', 
            borderRadius: '1.5rem', 
            fontSize: '0.9rem', 
            fontWeight: '900',
            boxShadow: '0 10px 15px -3px rgba(194, 163, 130, 0.3)'
          }}
        >
          ΚΑΛΑΘΙ ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
        </button>
      </header>

      <Menu onAddToCart={addToCart} />

      {activeOrder && <OrderStatus order={activeOrder} />}

      {isCartOpen && (
        <Cart 
          items={cartItems} 
          onClose={() => setIsCartOpen(false)} 
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
        />
      )}

      {showUndo && activeOrder && (
        <UndoToast 
          orderId={activeOrder.id} 
          onCancel={handleCancelOrder} 
          onTimeout={handleUndoTimeout} 
        />
      )}

      <footer style={{ marginTop: '8rem', borderTop: '1px solid var(--border)', paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <p style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '1rem' }}>{TEXT.businessName}</p>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>{TEXT.location} | {TEXT.phone}</p>
      </footer>
    </main>
  );
}
