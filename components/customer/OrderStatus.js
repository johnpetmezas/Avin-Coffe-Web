"use client";

export default function OrderStatus({ order }) {
  if (!order) return null;

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Awaiting confirmation...';
      case 'preparing': return 'Your coffee is being prepared! ☕';
      case 'ready': return 'Ready for pickup! 🎉';
      case 'cancelled': return 'Order cancelled.';
      default: return 'Confirmed';
    }
  };

  return (
    <div className="card animate-slide-in" style={{ marginTop: '2rem', border: '2px solid var(--primary)' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Order Status</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: '1.25rem' }}>{getStatusText(order.status)}</p>
          <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Order ID: {order.id}</p>
        </div>
        <span className={`badge badge-${order.status}`}>{order.status}</span>
      </div>
    </div>
  );
}
