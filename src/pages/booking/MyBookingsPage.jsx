import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingApi } from '../../api/bookingApi';
import { Spinner, EmptyState, Badge } from '../../components/common';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  const fetchBookings = () => {
    bookingApi.getMyBookings()
      .then(res => setBookings(res.data.data || []))
      .catch(() => toast.error('Failed to fetch bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingApi.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const fmtDate = (dt) => dt ? new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">My <span>Bookings</span></h2>

        {loading ? <Spinner /> : bookings.length === 0 ? (
          <EmptyState icon="🎫" title="No bookings yet" desc="Book a bus to see your trips here" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(b => (
              <div key={b.id} className="card">
                <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '.5rem' }}>
                  <div>
                    <span style={{ fontFamily: 'Sora', fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                      {b.bookingReference}
                    </span>
                    <span style={{ marginLeft: '1rem' }}><Badge status={b.status} /></span>
                  </div>
                  <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{fmtDate(b.bookingDate)}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.2rem' }}>Route</div>
                    <div style={{ fontWeight: 600 }}>
                      {b.schedule?.route?.source} → {b.schedule?.route?.destination}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.2rem' }}>Travel Date</div>
                    <div style={{ fontWeight: 600 }}>{b.schedule?.travelDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.2rem' }}>Bus</div>
                    <div style={{ fontWeight: 600 }}>{b.schedule?.bus?.busName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.2rem' }}>Seats</div>
                    <div style={{ fontWeight: 600 }}>{b.selectedSeats}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.2rem' }}>Amount</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{b.totalAmount?.toFixed(0)}</div>
                  </div>
                </div>

                {/* Passengers */}
                {b.passengers?.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.5rem' }}>Passengers</div>
                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                      {b.passengers.map((p, i) => (
                        <div key={i} style={{
                          background: 'var(--surface2)', border: '1px solid var(--border)',
                          borderRadius: 8, padding: '.35rem .75rem', fontSize: '.82rem'
                        }}>
                          {p.name} · {p.seatNumber}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment status */}
                {b.payment && (
                  <div style={{ marginBottom: '1rem', fontSize: '.85rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Payment: </span>
                    <Badge status={b.payment.status} />
                    {b.payment.transactionId && (
                      <span style={{ marginLeft: '.75rem', color: 'var(--muted)' }}>
                        TXN: {b.payment.transactionId}
                      </span>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                  {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                      Cancel Booking
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>
                    Book Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
