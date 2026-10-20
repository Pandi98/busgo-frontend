import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { scheduleApi } from '../../api/busApi';
import { Spinner, EmptyState } from '../../components/common';
import toast from 'react-hot-toast';

export default function BusListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const source      = params.get('source') || '';
  const destination = params.get('destination') || '';
  const date        = params.get('date') || '';

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all'); // all | AC | NON_AC | SLEEPER

  useEffect(() => {
    if (!source || !destination || !date) { setLoading(false); return; }
    scheduleApi.search(source, destination, date)
      .then(res => setSchedules(res.data.data || []))
      .catch(() => toast.error('Failed to fetch schedules'))
      .finally(() => setLoading(false));
  }, [source, destination, date]);

  const filtered = filter === 'all' ? schedules
    : schedules.filter(s => s.bus?.busType === filter);

  const fmtTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const duration = (dep, arr) => {
    if (!dep || !arr) return '';
    const [dh, dm] = dep.split(':').map(Number);
    const [ah, am] = arr.split(':').map(Number);
    let mins = (ah * 60 + am) - (dh * 60 + dm);
    if (mins < 0) mins += 1440;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-2">
          <div>
            <h2 className="section-title" style={{ marginBottom: '.25rem' }}>
              {source} <span>→</span> {destination}
            </h2>
            <p className="text-muted" style={{ fontSize: '.9rem' }}>{date} · {filtered.length} bus(es) found</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/search')}>Change Search</button>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'AC', 'NON_AC', 'SLEEPER', 'SEMI_SLEEPER'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Types' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="🚌" title="No buses found" desc="Try a different date or route" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(s => (
              <div key={s.id} className="bus-card">
                <div className="bus-card-header">
                  <div>
                    <div className="bus-name">{s.bus?.busName}</div>
                    <div className="bus-number">{s.bus?.busNumber} · {s.bus?.busType?.replace('_', ' ')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="bus-fare">₹{s.farePerSeat?.toFixed(0)}</div>
                    <div className="bus-seats">{s.availableSeats} seats left</div>
                  </div>
                </div>

                <div className="bus-route">
                  <div>
                    <div className="bus-route-city">{fmtTime(s.departureTime)}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{s.route?.source}</div>
                  </div>
                  <div className="bus-route-line" />
                  <div style={{ textAlign: 'right' }}>
                    <div className="bus-route-city">{fmtTime(s.arrivalTime)}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{s.route?.destination}</div>
                  </div>
                </div>

                <div className="bus-meta">
                  <span>⏱ {duration(s.departureTime, s.arrivalTime)}</span>
                  <span>📍 {s.route?.distanceKm} km</span>
                  {s.bus?.amenities && <span>✨ {s.bus.amenities}</span>}
                </div>

                <div className="flex-between">
                  <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
                    {s.availableSeats > 0 ? '🟢 Available' : '🔴 Sold out'}
                  </span>
                  <button
                    className="btn btn-accent btn-sm"
                    disabled={s.availableSeats === 0}
                    onClick={() => navigate(`/seats/${s.id}`, { state: { schedule: s } })}
                  >
                    Select Seats →
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
