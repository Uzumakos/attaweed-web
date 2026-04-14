import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { AdminUser } from '../types';

interface AuthContextType {
  user: User | null;
  adminData: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminData: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchAdminData(currentUser);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchAdminData(currentUser);
      } else {
        setAdminData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminData = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        // Fallback: grant Super Admin access for the primary admin email
        // even if the admins table is missing the row or RLS is blocking.
        // This ensures the first Super Admin can always log in.
        const SUPER_ADMIN_EMAIL = 'ernst367@gmail.com';
        if (user.email === SUPER_ADMIN_EMAIL) {
          setAdminData({
            id: user.id,
            email: user.email,
            displayName: 'Super Admin',
            role: 'Super Admin',
            lastLogin: new Date().toISOString(),
          });
          // Try to upsert the Super Admin row so future logins work from DB
          await supabase.from('admins').upsert({
            id: user.id,
            email: user.email,
            display_name: 'Super Admin',
            role: 'Super Admin',
            last_login: new Date().toISOString(),
          }, { onConflict: 'id' });
        } else {
          setAdminData(null);
        }
      } else {
        setAdminData({
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          role: data.role,
          lastLogin: data.last_login,
        });

        // Update last_login timestamp
        await supabase
          .from('admins')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdminData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminData,
        loading,
        isAdmin: !!adminData,
        isSuperAdmin: adminData?.role === 'Super Admin',
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
