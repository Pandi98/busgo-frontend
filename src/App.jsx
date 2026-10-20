import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar/Navbar';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#21262d', color: '#e6edf3', border: '1px solid #30363d' },
            success: { iconTheme: { primary: '#00b894', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#f85149', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
