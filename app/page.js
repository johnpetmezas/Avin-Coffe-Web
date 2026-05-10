"use client";
import { useState, useEffect } from 'react';
import Menu from '@/components/customer/Menu';
import Cart from '@/components/customer/Cart';
import UndoToast from '@/components/customer/UndoToast';
import OrderStatus from '@/components/customer/OrderStatus';

export default function CustomerHome() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  // Simple polling for order updates instead of SSE on customer side
  // (SSE is mostly for staff, but can be used here too if needed, though polling is fine for this scope)
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

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Guest ' + Math.floor(Math.random() * 1000),
          items: cartItems,
          total
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
              // The applicationServerKey should match the public VAPID key
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
    <main className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem' }}>AVIN Solomos</h1>
          <p style={{ color: 'var(--secondary)' }}>Select your coffee and enjoy</p>
        </div>
        <button className="btn-primary" onClick={() => setIsCartOpen(true)}>
          Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
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
    </main>
  );
}
