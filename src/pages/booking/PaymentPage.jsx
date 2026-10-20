import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingApi, paymentApi } from '../../api/bookingApi';

const METHODS = [
  { id: 'UPI',          label: '📱 UPI',          desc: 'GPay, PhonePe, Paytm' },
  { id: 'CREDIT_CARD',  label: '💳 Credit Card',  desc: 'Visa, Mastercard, Amex' },
  { id: 'DEBIT_CARD',   label: '🏧 Debit Card',   desc: 'All banks' },
  { id: 'NET_BANKING',  label: '🏦 Net Banking',  desc: 'All major banks' },
];

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { schedule, selectedSeats, passengers } = state || {};
  const [method, setMethod]   = useState('UPI');
  const [loading, setLoading] = useState(false);

  if (!schedule) { navigate('/search'); return null; }

  const total = schedule.farePerSeat * selectedSeats.length;

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Create booking
      const bookingRes = await bookingApi.create({
        scheduleId:    schedule.id,
        selectedSeats,
        passengers:    passengers.map(p => ({ ...p, age: parseInt(p.age) })),
      });
      const booking = bookingRes.data.data;

      // 2. Process payment
      await paymentApi.process({ bookingId: booking.id, paymentMethod: method });

      toast.success('Payment successful! 🎉');
      navigate('/booking/success', { state: { booking } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 740 }}>
        {/* Steps */}
        <div className="steps mb-2">
          {['Seats', 'Passengers', 'Payment', 'Confirm'].map((s, i) => (
            <div key={s} className={`step ${i < 2 ? 'done' : i === 2 ? 'active' : ''}`}>
              <div className="step-circle">{i < 2 ? '✓' : i + 1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Choose <span>Payment</span></h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Methods */}
          <div>
            {METHODS.map(m => (
              <div
                key={m.id}
                className="card mb-2"
                style={{
                  cursor: 'pointer',
                  borderColor: method === m.id ? 'var(--primary)' : 'var(--border)',
                  transition: 'border-color .2s',
                }}
                onClick={() => setMethod(m.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${method === m.id ? 'var(--primary)' : 'var(--border)'}`,
                    background: method === m.id ? 'var(--primary)' : 'transparent',
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{m.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
            <div style={{ fontSize: '.88rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
              {schedule.route?.source} → {schedule.route?.destination}
            </div>
            <div style={{ fontSize: '.88rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              Seats: {selectedSeats.join(', ')}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div className="flex-between" style={{ marginBottom: '.4rem', fontSize: '.9rem' }}>
                <span className="text-muted">Fare × {selectedSeats.length}</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className="flex-between" style={{ marginBottom: '.4rem', fontSize: '.9rem' }}>
                <span className="text-muted">Convenience fee</span>
                <span>₹0</span>
              </div>
              <div className="flex-between" style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: '.75rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>₹{total.toFixed(0)}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-full mt-2"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Processing…' : `Pay ₹${total.toFixed(0)}`}
            </button>
            <p style={{ fontSize: '.75rem', color: 'var(--muted)', textAlign: 'center', marginTop: '.75rem' }}>
              🔒 Secured by 256-bit encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
