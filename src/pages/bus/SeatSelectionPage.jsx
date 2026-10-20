import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function SeatSelectionPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const schedule  = state?.schedule;
  const [selected, setSelected] = useState([]);

  if (!schedule) {
    navigate('/search');
    return null;
  }

  const totalSeats = schedule.bus?.totalSeats || 40;
  // Simulate some booked seats
  const booked = [3, 7, 12, 15, 20, 25, 28];

  const toggle = (n) => {
    const key = `S${n}`;
    if (booked.includes(n)) return;
    setSelected(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    navigate('/booking/passengers', {
      state: { schedule, selectedSeats: selected }
    });
  };

  const fmtTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Journey summary */}
        <div className="card mb-2">
          <div className="flex-between">
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{schedule.bus?.busName}</div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{schedule.bus?.busNumber}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 700 }}>{schedule.route?.source}</span>
              <span style={{ margin: '0 .75rem', color: 'var(--primary)' }}>→</span>
              <span style={{ fontWeight: 700 }}>{schedule.route?.destination}</span>
              <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
                {fmtTime(schedule.departureTime)} — {fmtTime(schedule.arrivalTime)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Sora', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>
                ₹{schedule.farePerSeat?.toFixed(0)}
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>per seat</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
          {/* Seat map */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Select Seats</h3>

            {/* Bus front indicator */}
            <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '.8rem', color: 'var(--muted)', borderBottom: '1px dashed var(--border)', paddingBottom: '1rem' }}>
              🚗 Driver · Front of Bus
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', justifyItems: 'center' }}>
              {Array.from({ length: totalSeats }, (_, i) => {
                const n = i + 1;
                const key = `S${n}`;
                const isBooked   = booked.includes(n);
                const isSelected = selected.includes(key);
                return (
                  <div
                    key={n}
                    className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                    onClick={() => toggle(n)}
                    title={isBooked ? 'Booked' : `Seat ${key}`}
                  >
                    {key}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="seat-legend" style={{ marginTop: '1.5rem' }}>
              <div className="seat-legend-item">
                <div className="seat-dot" style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)' }} />
                Available
              </div>
              <div className="seat-legend-item">
                <div className="seat-dot" style={{ background: 'var(--primary)' }} />
                Selected
              </div>
              <div className="seat-legend-item">
                <div className="seat-dot" style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', opacity: .4 }} />
                Booked
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Booking Summary</h3>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.4rem' }}>Selected Seats</div>
                {selected.length === 0
                  ? <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>None selected</span>
                  : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                      {selected.map(s => (
                        <span key={s} className="badge badge-primary">{s}</span>
                      ))}
                    </div>
                }
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div className="flex-between" style={{ marginBottom: '.4rem', fontSize: '.9rem' }}>
                  <span className="text-muted">Fare × {selected.length}</span>
                  <span>₹{(schedule.farePerSeat * selected.length).toFixed(0)}</span>
                </div>
                <div className="flex-between" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>₹{(schedule.farePerSeat * selected.length).toFixed(0)}</span>
                </div>
              </div>
              <button
                className="btn btn-accent btn-full"
                disabled={selected.length === 0}
                onClick={handleContinue}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
