"use client";

export default function OrderCard({ order, onUpdateStatus }) {
  return (
    <div className="card animate-slide-in" style={{ borderLeft: `4px solid ${order.status === 'confirmed' ? 'var(--accent)' : 'var(--warning)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>{order.customerName}</h3>
        <span className={`badge badge-${order.status}`}>{order.status}</span>
      </div>
      
      <ul style={{ marginBottom: '1.5rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {order.items.map((item, i) => (
          <li key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.qty}x {item.name}</span>
          </li>
        ))}
      </ul>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {order.status === 'confirmed' && (
          <button className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--warning)' }} onClick={() => onUpdateStatus(order.id, 'preparing')}>
            Start Preparing
          </button>
        )}
        {order.status === 'preparing' && (
          <button className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--success)' }} onClick={() => onUpdateStatus(order.id, 'ready')}>
            Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--border)', color: 'var(--foreground)' }} onClick={() => onUpdateStatus(order.id, 'completed')}>
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
