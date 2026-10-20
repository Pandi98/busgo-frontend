import { useLocation, useNavigate } from 'react-router-dom';

export default function BookingSuccessPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const booking   = state?.booking;

  if (!booking) { navigate('/'); return null; }

  return (
    <div className="page flex-center" style={{ minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontFamily: 'Sora', fontSize: '2rem', fontWeight: 800, marginBottom: '.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
          Your seats are reserved. Have a great journey!
        </p>

        <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div className="flex-between mb-2">
            <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Booking Reference</span>
            <span style={{ fontWeight: 700, fontFamily: 'Sora', color: 'var(--primary)', fontSize: '1.1rem' }}>
              {booking.bookingReference}
            </span>
          </div>
          <div className="flex-between mb-2">
            <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Route</span>
            <span style={{ fontWeight: 600 }}>
              {booking.schedule?.route?.source} → {booking.schedule?.route?.destination}
            </span>
          </div>
          <div className="flex-between mb-2">
            <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Travel Date</span>
            <span>{booking.schedule?.travelDate}</span>
          </div>
          <div className="flex-between mb-2">
            <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Seats</span>
            <span>{booking.selectedSeats}</span>
          </div>
          <div className="flex-between">
            <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Amount Paid</span>
            <span style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{booking.totalAmount?.toFixed(0)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate('/my-bookings')}>
            View Bookings
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Book Another
          </button>
        </div>
      </div>
    </div>
  );
}
