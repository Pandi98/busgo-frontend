import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { scheduleApi, busApi, routeApi } from '../../api/busApi';
import AdminSidebar from '../../components/common/AdminSidebar';
import { Spinner, EmptyState, Badge, Modal } from '../../components/common';
import { format } from 'date-fns';

const EMPTY = {
  busId: '', routeId: '', travelDate: format(new Date(), 'yyyy-MM-dd'),
  departureTime: '08:00', arrivalTime: '14:00', farePerSeat: '', status: 'SCHEDULED'
};

export default function ManageSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses]         = useState([]);
  const [routes, setRoutes]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);

  const fetchAll = async () => {
    try {
      const [sRes, bRes, rRes] = await Promise.all([
        scheduleApi.getAll(), busApi.getAll(), routeApi.getAll()
      ]);
      setSchedules(sRes.data.data || []);
      setBuses(bRes.data.data || []);
      setRoutes(rRes.data.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY, busId: buses[0]?.id || '', routeId: routes[0]?.id || '' }); setModal(true); };
  const openEdit   = (s) => {
    setEditing(s.id);
    setForm({
      busId: s.bus?.id, routeId: s.route?.id, travelDate: s.travelDate,
      departureTime: s.departureTime, arrivalTime: s.arrivalTime,
      farePerSeat: s.farePerSeat, status: s.status
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, farePerSeat: parseFloat(form.farePerSeat), busId: parseInt(form.busId), routeId: parseInt(form.routeId) };
      if (editing) {
        await scheduleApi.update(editing, payload);
        toast.success('Schedule updated');
      } else {
        await scheduleApi.create(payload);
        toast.success('Schedule created');
      }
      setModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this schedule?')) return;
    try {
      await scheduleApi.cancel(id);
      toast.success('Schedule cancelled');
      fetchAll();
    } catch {
      toast.error('Cancel failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    try {
      await scheduleApi.delete(id);
      toast.success('Schedule deleted');
      fetchAll();
    } catch {
      toast.error('Delete failed');
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fmtTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="flex-between mb-2">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Manage <span>Schedules</span></h2>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Schedule</button>
        </div>

        {loading ? <Spinner /> : schedules.length === 0 ? (
          <EmptyState icon="🗓️" title="No schedules yet" desc="Create your first schedule" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Fare</th>
                  <th>Seats Left</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.bus?.busName}</td>
                    <td>{s.route?.source} → {s.route?.destination}</td>
                    <td>{s.travelDate}</td>
                    <td>{fmtTime(s.departureTime)}</td>
                    <td>{fmtTime(s.arrivalTime)}</td>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{s.farePerSeat}</td>
                    <td>{s.availableSeats}</td>
                    <td><Badge status={s.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                        {s.status === 'SCHEDULED' && (
                          <button className="btn btn-outline btn-sm" onClick={() => handleCancel(s.id)}>Cancel</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Schedule' : 'Add New Schedule'}>
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bus *</label>
                <select className="form-control" value={form.busId} onChange={set('busId')} required>
                  <option value="">Select bus</option>
                  {buses.map(b => <option key={b.id} value={b.id}>{b.busName} ({b.busNumber})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Route *</label>
                <select className="form-control" value={form.routeId} onChange={set('routeId')} required>
                  <option value="">Select route</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Travel Date *</label>
              <input type="date" className="form-control" value={form.travelDate} onChange={set('travelDate')} required min={format(new Date(), 'yyyy-MM-dd')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Departure Time *</label>
                <input type="time" className="form-control" value={form.departureTime} onChange={set('departureTime')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Arrival Time *</label>
                <input type="time" className="form-control" value={form.arrivalTime} onChange={set('arrivalTime')} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fare Per Seat (₹) *</label>
                <input type="number" step="0.01" className="form-control" value={form.farePerSeat} onChange={set('farePerSeat')} required min={1} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={form.status} onChange={set('status')}>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
