import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { label: '📊 Dashboard',  path: '/admin' },
  { label: '🚌 Buses',      path: '/admin/buses' },
  { label: '🗺️ Routes',     path: '/admin/routes' },
  { label: '🗓️ Schedules',  path: '/admin/schedules' },
  { label: '🎫 Bookings',   path: '/admin/bookings' },
  { label: '👥 Users',      path: '/admin/users' },
];
export default function AdminSidebar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="admin-sidebar">
      {items.map(item => (
        <button
          key={item.path}
          className={`admin-sidebar-item${pathname === item.path ? ' active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
