import { useState } from 'react';
import { TEXT, ARRIVAL_TIMES } from '../../lib/constants';

export default function Cart({ items, onClose, onRemove, onUpdateQuantity, onCheckout }) {
  const [arrivalTime, setArrivalTime] = useState(ARRIVAL_TIMES[1]); // Default 10 mins
  const [notes, setNotes] = useState('');
  const [itemOptions, setItemOptions] = useState({}); // { itemId: { sugar: 'Μέτριος' } }

  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    // Add options to items
    const itemsWithDetails = items.map(item => ({
      ...item,
      sugar: itemOptions[item.id]?.sugar || 'Μέτριος',
    }));
    
    onCheckout({
      items: itemsWithDetails,
      arrivalTime,
      notes,
      total
    });
  };

  const updateOption = (itemId, option, value) => {
    setItemOptions(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [option]: value }
    }));
  };

  return (
    <div className="cart-overlay" onClick={onClose} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div className="cart-panel" onClick={e => e.stopPropagation()} style={{ 
        width: '100%', 
        maxWidth: '500px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '3rem 0 0 3rem',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Το Καλάθι μου</h2>
          <button onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--foreground)', opacity: 0.3 }}>&times;</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.3 }}>
              <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>Το καλάθι είναι άδειο</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ 
                  background: 'var(--primary-light)', 
                  padding: '2rem', 
                  borderRadius: '2rem',
                  border: '1px solid var(--primary)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '900' }}>{item.name}</h4>
                      <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>€{item.price.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.5rem', borderRadius: '1rem' }}>
                      <button onClick={() => onUpdateQuantity(item.id, -1)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--border)', borderRadius: '0.5rem', fontWeight: '900' }}>-</button>
                      <span style={{ width: '20px', textAlign: 'center', fontWeight: '900' }}>{item.qty}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--border)', borderRadius: '0.5rem', fontWeight: '900' }}>+</button>
                    </div>
                  </div>

                  {/* Sugar Selection */}
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.75rem' }}>
                      {TEXT.selectionTitle}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {TEXT.sugarOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => updateOption(item.id, 'sugar', option)}
                          style={{
                            flex: 1,
                            padding: '0.6rem',
                            borderRadius: '0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: '800',
                            transition: 'all 0.2s',
                            background: (itemOptions[item.id]?.sugar || 'Μέτριος') === option ? 'var(--primary)' : 'white',
                            color: (itemOptions[item.id]?.sugar || 'Μέτριος') === option ? 'white' : 'var(--foreground)',
                            border: '1px solid var(--primary)'
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onRemove(item.id)} 
                    style={{ position: 'absolute', top: '-10px', right: '-10px', width: '24px', height: '24px', background: 'var(--danger)', color: 'white', borderRadius: '50%', fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    &times;
                  </button>
                </div>
              ))}

              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', opacity: 0.6, marginBottom: '1rem' }}>
                  {TEXT.timeTitle}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {ARRIVAL_TIMES.map(time => (
                    <button
                      key={time}
                      onClick={() => setArrivalTime(time)}
                      style={{
                        padding: '1rem',
                        borderRadius: '1rem',
                        fontWeight: '900',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s',
                        background: arrivalTime === time ? 'var(--secondary)' : 'white',
                        color: arrivalTime === time ? 'white' : 'var(--foreground)',
                        border: '2px solid var(--secondary)'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', opacity: 0.6, marginBottom: '1rem' }}>
                  {TEXT.notes}
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="π.χ. Έξτρα πάγο, χωρίς καλαμάκι..."
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    borderRadius: '1.5rem',
                    border: '2px solid var(--border)',
                    fontFamily: 'inherit',
                    minHeight: '100px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div style={{ padding: '2.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>{TEXT.total}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>€{total.toFixed(2)}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem', borderRadius: '1.5rem', fontWeight: '900' }} onClick={handleCheckout}>
              {TEXT.cta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
