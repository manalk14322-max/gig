import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('gig.token', token);
      refreshUser().finally(() => {
        navigate('/dashboard');
      });
    } else {
      navigate('/profile');
    }
  }, [params, navigate, refreshUser]);

  return (
    <div className="card p-6">
      <p className="text-sm text-muted">Finishing Google sign in...</p>
    </div>
  );
}
