import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { BrowserRouter } from 'react-router-dom';

// Layout
import AppLayout from './layouts/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import OnRamp from './pages/OnRamp';
import OffRamp from './pages/OffRamp';
import History from './pages/History';
import Welcome from './pages/Welcome';

// Component to handle protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initialization loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-800">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <h1 className="mt-4 text-xl font-semibold">Loading AfriRamp...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={isConnected ? <Navigate to="/dashboard" replace /> : <Welcome />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="send" element={
          <ProtectedRoute>
            <Send />
          </ProtectedRoute>
        } />
        <Route path="receive" element={
          <ProtectedRoute>
            <Receive />
          </ProtectedRoute>
        } />
        <Route path="onramp" element={
          <ProtectedRoute>
            <OnRamp />
          </ProtectedRoute>
        } />
        <Route path="offramp" element={
          <ProtectedRoute>
            <OffRamp />
          </ProtectedRoute>
        } />
        <Route path="history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;