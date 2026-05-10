"use client";

const PRODUCTS = [
  { id: 'espresso', name: 'Espresso', price: 2.00, description: 'Rich and bold single shot' },
  { id: 'cappuccino', name: 'Cappuccino', price: 3.50, description: 'Espresso with steamed milk foam' },
  { id: 'freddo_espresso', name: 'Freddo Espresso', price: 3.00, description: 'Iced shaken espresso' },
  { id: 'freddo_cappuccino', name: 'Freddo Cappuccino', price: 3.80, description: 'Iced espresso with cold milk foam' },
  { id: 'latte', name: 'Latte', price: 3.50, description: 'Espresso with lots of steamed milk' },
  { id: 'frappe', name: 'Frappé', price: 2.50, description: 'Classic Greek iced coffee' },
];

export default function Menu({ onAddToCart }) {
  return (
    <section>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Coffee Menu</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {PRODUCTS.map(product => (
          <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
              <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.description}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>€{product.price.toFixed(2)}</span>
              <button className="btn-primary" onClick={() => onAddToCart(product)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
