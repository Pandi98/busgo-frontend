import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PassengerDetailsPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { schedule, selectedSeats } = state || {};

  const [passengers, setPassengers] = useState(
    (selectedSeats || []).map(seat => ({
      name: '', age: '', gender: '', seatNumber: seat, idProofType: 'AADHAAR', idProofNumber: ''
    }))
  );

  if (!schedule || !selectedSeats) { navigate('/search'); return null; }

  const update = (i, key, val) => {
    setPassengers(prev => prev.map((p, idx) => idx === i ? { ...p, [key]: val } : p));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/booking/payment', { state: { schedule, selectedSeats, passengers } });
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 740 }}>
        {/* Steps */}
        <div className="steps mb-2">
          {['Seats', 'Passengers', 'Payment', 'Confirm'].map((s, i) => (
            <div key={s} className={`step ${i < 1 ? 'done' : i === 1 ? 'active' : ''}`}>
              <div className="step-circle">{i < 1 ? '✓' : i + 1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Passenger <span>Details</span></h2>

        <form onSubmit={handleContinue}>
          {passengers.map((p, i) => (
            <div key={i} className="card mb-2">
              <h3 style={{ fontWeight: 700, marginBottom: '1.2rem', color: 'var(--accent)', fontSize: '1rem' }}>
                Passenger {i + 1} — Seat {p.seatNumber}
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={p.name} onChange={e => update(i, 'name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input type="number" min={1} max={120} className="form-control" value={p.age} onChange={e => update(i, 'age', e.target.value)} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select className="form-control" value={p.gender} onChange={e => update(i, 'gender', e.target.value)} required>
                    <option value="">Select</option>
                    <option>MALE</option>
                    <option>FEMALE</option>
                    <option>OTHER</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ID Proof Type</label>
                  <select className="form-control" value={p.idProofType} onChange={e => update(i, 'idProofType', e.target.value)}>
                    <option value="AADHAAR">Aadhaar</option>
                    <option value="PAN">PAN</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">ID Proof Number</label>
                <input className="form-control" value={p.idProofNumber} onChange={e => update(i, 'idProofNumber', e.target.value)} />
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
            <button type="submit" className="btn btn-accent">Continue to Payment →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
