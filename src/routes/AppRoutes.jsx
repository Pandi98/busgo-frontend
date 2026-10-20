import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import HomePage           from '../pages/home/HomePage';
import LoginPage          from '../pages/auth/LoginPage';
import RegisterPage       from '../pages/auth/RegisterPage';
import SearchBusPage      from '../pages/bus/SearchBusPage';
import BusListPage        from '../pages/bus/BusListPage';
import SeatSelectionPage  from '../pages/bus/SeatSelectionPage';
import PassengerDetailsPage from '../pages/booking/PassengerDetailsPage';
import PaymentPage        from '../pages/booking/PaymentPage';
import BookingSuccessPage from '../pages/booking/BookingSuccessPage';
import MyBookingsPage     from '../pages/booking/MyBookingsPage';
import DashboardPage      from '../pages/admin/DashboardPage';
import ManageBusPage      from '../pages/admin/ManageBusPage';
import ManageRoutePage    from '../pages/admin/ManageRoutePage';
import ManageSchedulePage from '../pages/admin/ManageSchedulePage';
import BookingManagementPage from '../pages/admin/BookingManagementPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ManageUsersPage from "../pages/admin/ManageUsersPage";


function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/" />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"               element={<HomePage />} />
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/search"         element={<SearchBusPage />} />
      <Route path="/buses"          element={<BusListPage />} />
      <Route path="/seats/:scheduleId" element={<PrivateRoute><SeatSelectionPage /></PrivateRoute>} />
      <Route path="/booking/passengers" element={<PrivateRoute><PassengerDetailsPage /></PrivateRoute>} />
      <Route path="/booking/payment"    element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
      <Route path="/booking/success"    element={<PrivateRoute><BookingSuccessPage /></PrivateRoute>} />
      <Route path="/my-bookings"        element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
      <Route
  path="/profile"
  element={
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  }
/>
      <Route path="/admin"              element={<AdminRoute><DashboardPage /></AdminRoute>} />
      <Route path="/admin/buses"        element={<AdminRoute><ManageBusPage /></AdminRoute>} />
      <Route path="/admin/routes"       element={<AdminRoute><ManageRoutePage /></AdminRoute>} />
      <Route path="/admin/schedules"    element={<AdminRoute><ManageSchedulePage /></AdminRoute>} />
      <Route path="/admin/bookings"     element={<AdminRoute><BookingManagementPage /></AdminRoute>} />
      <Route
    path="/admin/users"
    element={
        <AdminRoute>
            <ManageUsersPage />
        </AdminRoute>
    }
/>
    </Routes>
  );
}
