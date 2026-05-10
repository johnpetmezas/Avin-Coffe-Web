import { PRODUCTS, TEXT } from '../../lib/constants';

export default function Menu({ onAddToCart }) {
  return (
    <section>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
          {TEXT.category}
        </h2>
        <div style={{ width: '60px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {PRODUCTS.map(product => (
          <div key={product.id} className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            padding: '2rem',
            borderRadius: '2.5rem',
            border: '2px solid var(--border)',
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>{product.name}</h3>
              <p style={{ color: 'var(--foreground)', opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '500' }}>
                {product.description}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--primary)' }}>
                €{product.price.toFixed(2)}
              </span>
              <button 
                className="btn-primary" 
                onClick={() => onAddToCart(product)} 
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  fontSize: '0.8rem', 
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {TEXT.add}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
