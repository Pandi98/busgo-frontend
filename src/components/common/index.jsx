export function Spinner() {
  return <div className="spinner" />;
}

export function Badge({ status }) {
  const map = {
    CONFIRMED: 'badge-success',
    PENDING:   'badge-warning',
    CANCELLED: 'badge-danger',
    SCHEDULED: 'badge-primary',
    COMPLETED: 'badge-muted',
    SUCCESS:   'badge-success',
    FAILED:    'badge-danger',
    REFUNDED:  'badge-muted',
    ACTIVE:    'badge-success',
    INACTIVE:  'badge-danger',
  };
  return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>;
}

export function EmptyState({ icon = '📭', title = 'Nothing here yet', desc = '' }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>{icon}</div>
      <p style={{ fontWeight: 600, marginBottom: '.4rem' }}>{title}</p>
      {desc && <p style={{ fontSize: '.88rem' }}>{desc}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
