import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function SearchBusPage() {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({ source: '', destination: '', travelDate: today });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/buses?source=${form.source}&destination=${form.destination}&date=${form.travelDate}`);
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h2 className="section-title">Find Your <span>Bus</span></h2>
        <div className="card">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label className="form-label">From</label>
              <input className="form-control" placeholder="e.g. Chennai" value={form.source} onChange={set('source')} required />
            </div>
            <div className="form-group">
              <label className="form-label">To</label>
              <input className="form-control" placeholder="e.g. Bangalore" value={form.destination} onChange={set('destination')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Travel Date</label>
              <input type="date" className="form-control" min={today} value={form.travelDate} onChange={set('travelDate')} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg mt-2">
              Search Buses 🔍
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
