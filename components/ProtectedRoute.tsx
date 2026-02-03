import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          navigate('/auth' + location.search, { replace: true });
          return;
        }

        if (!session) {
          navigate('/auth' + location.search, { replace: true });
          return;
        }

        setAuthenticated(true);
      } catch (err) {
        console.error('Unexpected error:', err);
        navigate('/auth' + location.search, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, location.search]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
          <p className="font-serif text-cream text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};


