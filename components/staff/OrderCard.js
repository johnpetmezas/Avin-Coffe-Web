export default function OrderCard({ order, onUpdateStatus }) {
  const isUrgent = order.status === 'confirmed';
  
  return (
    <div className="card animate-slide-in" style={{ 
      borderRadius: '3rem',
      padding: '2.5rem',
      border: '2px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      background: 'white',
      borderTop: isUrgent ? '8px solid var(--primary)' : '2px solid var(--border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>{order.customerName}</h3>
          <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
            ID: #{order.id.slice(-4)}
          </p>
        </div>
        <div style={{ 
          background: order.status === 'confirmed' ? 'var(--primary-light)' : '#f0fdf4',
          color: order.status === 'confirmed' ? 'var(--primary)' : '#166534',
          padding: '0.5rem 1rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '900',
          textTransform: 'uppercase'
        }}>
          {order.status === 'confirmed' ? 'ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ' : order.status === 'preparing' ? 'ΠΡΟΕΤΟΙΜΑΣΙΑ' : 'ΕΤΟΙΜΗ'}
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--background)', padding: '0.75rem 1.25rem', borderRadius: '1.5rem', flex: 1 }}>
            <p style={{ fontSize: '0.65rem', fontWeight: '900', opacity: 0.4, textTransform: 'uppercase' }}>Άφιξη</p>
            <p style={{ fontSize: '0.9rem', fontWeight: '900' }}>{order.arrivalTime || 'Άγνωστο'}</p>
          </div>
          <div style={{ background: 'var(--background)', padding: '0.75rem 1.25rem', borderRadius: '1.5rem', flex: 1 }}>
            <p style={{ fontSize: '0.65rem', fontWeight: '900', opacity: 0.4, textTransform: 'uppercase' }}>Σύνολο</p>
            <p style={{ fontSize: '0.9rem', fontWeight: '900' }}>€{order.total?.toFixed(2)}</p>
          </div>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--primary)' }}>
                {item.qty}x
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '900', fontSize: '1rem' }}>{item.name}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>{item.sugar}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order.notes && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--border)' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: '900', opacity: 0.4, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Σημειώσεις</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', fontStyle: 'italic' }}>"{order.notes}"</p>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {order.status === 'confirmed' && (
          <button 
            className="btn-primary" 
            style={{ flex: 1, padding: '1.25rem', borderRadius: '1.5rem', fontSize: '0.875rem' }} 
            onClick={() => onUpdateStatus(order.id, 'preparing')}
          >
            ΕΝΑΡΞΗ ΠΡΟΕΤΟΙΜΑΣΙΑΣ
          </button>
        )}
        {order.status === 'preparing' && (
          <button 
            className="btn-primary" 
            style={{ flex: 1, padding: '1.25rem', borderRadius: '1.5rem', fontSize: '0.875rem', background: '#10b981' }} 
            onClick={() => onUpdateStatus(order.id, 'ready')}
          >
            ΟΛΟΚΛΗΡΩΣΗ & ΕΙΔΟΠΟΙΗΣΗ
          </button>
        )}
        {order.status === 'ready' && (
          <button 
            className="btn-primary" 
            style={{ flex: 1, padding: '1.25rem', borderRadius: '1.5rem', fontSize: '0.875rem', background: 'var(--secondary)' }} 
            onClick={() => onUpdateStatus(order.id, 'completed')}
          >
            ΠΑΡΑΔΟΘΗΚΕ
          </button>
        )}
      </div>
    </div>
  );
}
