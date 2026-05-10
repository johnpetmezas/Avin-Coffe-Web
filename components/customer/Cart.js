"use client";

export default function Cart({ items, onClose, onRemove, onUpdateQuantity, onCheckout }) {
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Your Cart</h2>
          <button onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>&times;</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <p style={{ color: 'var(--secondary)', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: '600' }}>{item.name}</h4>
                    <span style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>€{item.price.toFixed(2)} each</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => onUpdateQuantity(item.id, -1)} style={{ padding: '0.25rem 0.5rem', background: 'var(--border)', borderRadius: 'var(--radius-sm)' }}>-</button>
                      <span style={{ width: '20px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} style={{ padding: '0.25rem 0.5rem', background: 'var(--border)', borderRadius: 'var(--radius-sm)' }}>+</button>
                    </div>
                    <span style={{ fontWeight: 'bold', width: '60px', textAlign: 'right' }}>€{(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => onRemove(item.id)} style={{ color: 'var(--danger)', fontSize: '1.25rem' }}>&times;</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={onCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
