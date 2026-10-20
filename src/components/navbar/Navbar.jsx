import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🚌 Bus<span>Go</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Find Bus
          </NavLink>

          {isAuthenticated() && (
            <NavLink to="/my-bookings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              My Bookings
            </NavLink>
          )}

          {isAdmin() && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Dashboard
            </NavLink>
          )}

          {isAuthenticated() ? (
            <>
              <NavLink
  to="/profile"
  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
  style={{ marginLeft: "1rem" }}
>
  👤 {user?.name}
</NavLink>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
