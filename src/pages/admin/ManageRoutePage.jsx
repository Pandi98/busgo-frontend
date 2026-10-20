import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { routeApi } from '../../api/busApi';
import AdminSidebar from '../../components/common/AdminSidebar';
import { Spinner, EmptyState, Modal } from '../../components/common';

const EMPTY = { source: '', destination: '', distanceKm: '', estimatedDurationMinutes: '' };

export default function ManageRoutePage() {
  const [routes, setRoutes]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);

  const fetchRoutes = () => {
    routeApi.getAll()
      .then(res => setRoutes(res.data.data || []))
      .catch(() => toast.error('Failed to load routes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoutes(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (r) => {
    setEditing(r.id);
    setForm({ source: r.source, destination: r.destination,
              distanceKm: r.distanceKm, estimatedDurationMinutes: r.estimatedDurationMinutes });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        distanceKm: parseFloat(form.distanceKm),
        estimatedDurationMinutes: parseInt(form.estimatedDurationMinutes),
      };
      if (editing) {
        await routeApi.update(editing, payload);
        toast.success('Route updated');
      } else {
        await routeApi.create(payload);
        toast.success('Route created');
      }
      setModal(false);
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await routeApi.delete(id);
      toast.success('Route deleted');
      fetchRoutes();
    } catch {
      toast.error('Delete failed — route may be in use');
    }
  };

  const fmtDuration = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="flex-between mb-2">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Manage <span>Routes</span></h2>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Route</button>
        </div>

        {loading ? <Spinner /> : routes.length === 0 ? (
          <EmptyState icon="🗺️" title="No routes yet" desc="Create your first route" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Distance</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.source}</td>
                    <td style={{ fontWeight: 600 }}>{r.destination}</td>
                    <td>{r.distanceKm} km</td>
                    <td>{fmtDuration(r.estimatedDurationMinutes)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Route' : 'Add New Route'}>
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Source City *</label>
                <input className="form-control" placeholder="e.g. Chennai" value={form.source} onChange={set('source')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Destination City *</label>
                <input className="form-control" placeholder="e.g. Bangalore" value={form.destination} onChange={set('destination')} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Distance (km) *</label>
                <input type="number" step="0.1" className="form-control" value={form.distanceKm} onChange={set('distanceKm')} required min={1} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes) *</label>
                <input type="number" className="form-control" value={form.estimatedDurationMinutes} onChange={set('estimatedDurationMinutes')} required min={30} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update Route' : 'Create Route'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
