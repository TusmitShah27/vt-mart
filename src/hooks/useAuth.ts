import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdminRole(session?.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAdminRole(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (user: User | null | undefined) => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      // Assuming you have a users or profiles table with a role column
      // Or you can use user metadata if you set role there.
      // For simplicity, let's check user_metadata.role or a profiles table.
      // We will use user_metadata here.
      const role = user.user_metadata?.role;
      setIsAdmin(role === 'admin');
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { user, isAdmin, loading };
}
