import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { AdminUser } from '../types';

interface AuthContextType {
  user: User | null;
  adminData: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminData: null,
  loading: true,
  isAdmin: false,
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

      if (error) {
        // Default admin fallback for the specific email
        if (user.email === 'ernst367@gmail.com') {
          setAdminData({
            id: user.id,
            email: user.email!,
            displayName: user.user_metadata.full_name || user.email!.split('@')[0],
            role: 'Super Admin',
            lastLogin: new Date().toISOString(),
          });
        } else {
          setAdminData(null);
        }
      } else if (data) {
        setAdminData({
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          role: data.role,
          lastLogin: data.last_login,
        });
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, adminData, loading, isAdmin: !!adminData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
