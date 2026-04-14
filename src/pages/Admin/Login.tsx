import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../supabase';
import { cn } from '../../lib/utils';
import IslamicPattern from '../../components/IslamicPattern';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // AuthContext handles the admin check + Super Admin fallback.
        // Just navigate — if not authorized, AuthContext will redirect back.
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-4">
      <IslamicPattern className="opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10"
      >
        {/* Header */}
        <div className="bg-islamic-green p-10 text-white text-center relative overflow-hidden">
          <IslamicPattern dark className="opacity-20" />
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-islamic-gold" />
            </div>
            <h1 className="text-3xl font-serif font-bold leading-tight">Admin Attawheed</h1>
            <p className="text-white/70 text-sm">Espace de gestion sécurisé</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailLogin} className="p-10 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-bold text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="admin-email" className="block text-sm font-bold text-gray-700">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@attawheed.com"
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-soft-black placeholder-gray-400 focus:border-islamic-green focus:outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="admin-password" className="block text-sm font-bold text-gray-700">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-soft-black placeholder-gray-400 focus:border-islamic-green focus:outline-none transition-all text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-islamic-green transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className={cn(
              'w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 mt-2',
              loading || !email || !password
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-islamic-green text-white hover:shadow-xl hover:scale-[1.02]'
            )}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Se connecter'
            )}
          </button>

          <p className="text-center text-gray-400 text-xs leading-relaxed">
            Accès réservé aux administrateurs autorisés.<br />
            Contactez le Super Admin pour obtenir vos identifiants.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
