import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { busApi } from '../../api/busApi';
import AdminSidebar from '../../components/common/AdminSidebar';
import { Spinner, EmptyState, Badge, Modal } from '../../components/common';

const EMPTY = { busNumber: '', busName: '', busType: 'AC', totalSeats: 40, amenities: '', isActive: true };

export default function ManageBusPage() {
  const [buses, setBuses]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);

  const fetchBuses = () => {
    busApi.getAll()
      .then(res => setBuses(res.data.data || []))
      .catch(() => toast.error('Failed to load buses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBuses(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (bus) => {
    setEditing(bus.id);
    setForm({ busNumber: bus.busNumber, busName: bus.busName, busType: bus.busType,
              totalSeats: bus.totalSeats, amenities: bus.amenities || '', isActive: bus.isActive });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await busApi.update(editing, form);
        toast.success('Bus updated');
      } else {
        await busApi.create(form);
        toast.success('Bus created');
      }
      setModal(false);
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bus?')) return;
    try {
      await busApi.delete(id);
      toast.success('Bus deleted');
      fetchBuses();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggle = async (id) => {
    try {
      await busApi.toggleStatus(id);
      toast.success('Status updated');
      fetchBuses();
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="flex-between mb-2">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Manage <span>Buses</span></h2>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Bus</button>
        </div>

        {loading ? <Spinner /> : buses.length === 0 ? (
          <EmptyState icon="🚌" title="No buses yet" desc="Add your first bus" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bus Number</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Seats</th>
                  <th>Amenities</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.busNumber}</td>
                    <td>{b.busName}</td>
                    <td><span className="badge badge-primary">{b.busType}</span></td>
                    <td>{b.totalSeats}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{b.amenities || '—'}</td>
                    <td>
                      <Badge status={b.isActive ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>Edit</button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleToggle(b.id)}>
                          {b.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Bus' : 'Add New Bus'}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Bus Number *</label>
              <input className="form-control" value={form.busNumber} onChange={set('busNumber')} required disabled={!!editing} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bus Name *</label>
                <input className="form-control" value={form.busName} onChange={set('busName')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Bus Type *</label>
                <select className="form-control" value={form.busType} onChange={set('busType')}>
                  {['AC', 'NON_AC', 'SLEEPER', 'SEMI_SLEEPER'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Total Seats *</label>
              <input type="number" className="form-control" value={form.totalSeats}
                onChange={e => setForm(f => ({ ...f, totalSeats: parseInt(e.target.value) }))} required min={10} max={60} />
            </div>
            <div className="form-group">
              <label className="form-label">Amenities</label>
              <input className="form-control" placeholder="WiFi, Charging Point, Water Bottle" value={form.amenities} onChange={set('amenities')} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update Bus' : 'Create Bus'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
