"use client";
import { useEffect, useState } from 'react';

export default function UndoToast({ orderId, onCancel, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  return (
    <div className="toast-container">
      <div className="toast">
        <div>
          <h4 style={{ fontWeight: 600 }}>Order Placed</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>You have {timeLeft}s to cancel</p>
        </div>
        <button className="btn-primary" style={{ backgroundColor: 'var(--danger)', padding: '0.5rem 1rem' }} onClick={() => onCancel(orderId)}>
          Cancel
        </button>
        <div className="progress-bar" style={{ animationDuration: '30s' }} />
      </div>
    </div>
  );
}
