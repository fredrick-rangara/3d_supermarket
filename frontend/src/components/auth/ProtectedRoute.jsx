import {  Navigate, Outlet, useLocation  } from 'react-router-dom';
import {  useAuth  } from '@/hooks/useAuth';
import {  Loader2  } from 'lucide-react';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
                 <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-supermarket-green" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
        );
    }

    if (!isAuthenticated) {
        //Redirect to login and save the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet/>;
};

export default ProtectedRoute;