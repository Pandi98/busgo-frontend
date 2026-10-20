import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { bookingApi, paymentApi } from '../../api/bookingApi';
import AdminSidebar from '../../components/common/AdminSidebar';
import { Spinner, EmptyState, Badge } from '../../components/common';

export default function BookingManagementPage() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('ALL');
  const [search, setSearch]       = useState('');
  const [expanded, setExpanded]   = useState(null);

  const fetchBookings = () => {
    bookingApi.getAll()
      .then(res => setBookings(res.data.data || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleRefund = async (bookingId) => {
    if (!window.confirm('Process refund for this booking?')) return;
    try {
      await paymentApi.refund(bookingId);
      toast.success('Refund processed');
      fetchBookings();
    } catch {
      toast.error('Refund failed');
    }
  };

  const fmtDate = (dt) =>
    dt ? new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  const filtered = bookings
    .filter(b => filter === 'ALL' || b.status === filter)
    .filter(b =>
      search === '' ||
      b.bookingReference?.toLowerCase().includes(search.toLowerCase()) ||
      b.userName?.toLowerCase().includes(search.toLowerCase()) ||
      b.schedule?.route?.source?.toLowerCase().includes(search.toLowerCase()) ||
      b.schedule?.route?.destination?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Booking <span>Management</span></h2>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <input
              className="form-control"
              placeholder="Search by ref, user, route…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 240 }}
            />
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="🎫" title="No bookings found" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>User</th>
                  <th>Route</th>
                  <th>Travel Date</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <>
                    <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{b.bookingReference}</td>
                      <td>{b.userName}</td>
                      <td>
                        {b.schedule?.route?.source} → {b.schedule?.route?.destination}
                      </td>
                      <td>{b.schedule?.travelDate}</td>
                      <td>{b.selectedSeats}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{b.totalAmount?.toFixed(0)}</td>
                      <td><Badge status={b.status} /></td>
                      <td>
                        {b.payment ? <Badge status={b.payment.status} /> : <span style={{ color: 'var(--muted)' }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '.4rem' }}>
                          {b.payment?.status === 'SUCCESS' && b.status === 'CANCELLED' && (
                            <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); handleRefund(b.id); }}>
                              Refund
                            </button>
                          )}
                          <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>
                            {expanded === b.id ? '▲' : '▼'}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded passenger details */}
                    {expanded === b.id && (
                      <tr key={`exp-${b.id}`}>
                        <td colSpan={9} style={{ background: 'var(--surface2)', padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: 700, marginBottom: '.5rem', fontSize: '.88rem' }}>Passengers</div>
                              {b.passengers?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                                  {b.passengers.map((p, i) => (
                                    <div key={i} style={{ fontSize: '.84rem', color: 'var(--muted)' }}>
                                      {p.name} · {p.gender} · Age {p.age} · Seat {p.seatNumber}
                                    </div>
                                  ))}
                                </div>
                              ) : <span style={{ color: 'var(--muted)', fontSize: '.84rem' }}>No passenger data</span>}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, marginBottom: '.5rem', fontSize: '.88rem' }}>Payment Details</div>
                              {b.payment ? (
                                <div style={{ fontSize: '.84rem', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                                  <div>Method: {b.payment.paymentMethod}</div>
                                  <div>TXN: {b.payment.transactionId || '—'}</div>
                                  <div>Date: {fmtDate(b.payment.paymentDate)}</div>
                                  {b.payment.failureReason && <div style={{ color: 'var(--danger)' }}>Reason: {b.payment.failureReason}</div>}
                                </div>
                              ) : <span style={{ color: 'var(--muted)', fontSize: '.84rem' }}>No payment yet</span>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
