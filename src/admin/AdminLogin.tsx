import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user?.user_metadata?.role !== 'admin') {
      setError('Unauthorized: Admin access required.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-[Calistoga] bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] bg-clip-text text-transparent mb-2">
            VT Admin
          </h2>
          <p className="text-slate-500 text-sm">Sign in to manage your store</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-mono text-slate-500 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-slate-500 mb-1.5">Password</label>
            <input
              type="password"
              required
              className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white rounded-lg hover:brightness-110 transition-all font-medium mt-2 shadow-sm disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
