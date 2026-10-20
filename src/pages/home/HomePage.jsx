import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';

const POPULAR = [
  { from: 'Chennai', to: 'Bangalore' },
  { from: 'Mumbai',  to: 'Pune' },
  { from: 'Delhi',   to: 'Agra' },
  { from: 'Hyderabad', to: 'Chennai' },
  { from: 'Kolkata', to: 'Bhubaneswar' },
  { from: 'Coimbatore', to: 'Chennai' },
];

const FEATURES = [
  { icon: '🛡️', title: 'Secure Booking',    desc: 'End-to-end encrypted payments and safe transactions.' },
  { icon: '⚡', title: 'Instant Confirmation', desc: 'Get your ticket confirmed within seconds of payment.' },
  { icon: '🎫', title: 'Easy Cancellation', desc: 'Cancel anytime and get a hassle-free refund.' },
  { icon: '🚌', title: '500+ Operators',    desc: 'Choose from a wide network of verified bus operators.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const [form, setForm] = useState({ source: '', destination: '', travelDate: today });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.source || !form.destination || !form.travelDate) return;
    navigate(`/buses?source=${form.source}&destination=${form.destination}&date=${form.travelDate}`);
  };

  const fillPopular = (route) => {
    setForm(f => ({ ...f, source: route.from, destination: route.to }));
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Travel Smarter,<br /><span className="highlight">Book Faster</span>
          </h1>
          <p className="hero-sub">Search, compare, and book bus tickets across India — all in one place.</p>

          {/* Search box */}
          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-grid">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">From</label>
                <input
                  className="form-control"
                  placeholder="City or stop"
                  value={form.source}
                  onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">To</label>
                <input
                  className="form-control"
                  placeholder="City or stop"
                  value={form.destination}
                  onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={today}
                  value={form.travelDate}
                  onChange={e => setForm(f => ({ ...f, travelDate: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
                Search 🔍
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Popular Routes ────────────────────────────────── */}
      <section className="page">
        <div className="container">
          <h2 className="section-title">Popular <span>Routes</span></h2>
          <div className="grid-3" style={{ marginBottom: '4rem' }}>
            {POPULAR.map((r, i) => (
              <div
                key={i}
                className="card"
                style={{ cursor: 'pointer', transition: 'border-color .2s' }}
                onClick={() => {
                  fillPopular(r);
                  navigate(`/buses?source=${r.from}&destination=${r.to}&date=${today}`);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: 700 }}>{r.from}</div>
                  <div style={{ flex: 1, textAlign: 'center', color: 'var(--primary)' }}>→</div>
                  <div style={{ fontWeight: 700 }}>{r.to}</div>
                </div>
                <div style={{ marginTop: '.5rem', fontSize: '.82rem', color: 'var(--muted)' }}>
                  Buses available daily
                </div>
              </div>
            ))}
          </div>

          {/* ── Features ─────────────────────────────────── */}
          <h2 className="section-title">Why <span>BusGo</span>?</h2>
          <div className="grid-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '.75rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '.4rem', fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
