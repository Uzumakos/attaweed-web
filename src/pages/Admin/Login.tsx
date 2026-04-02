import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../supabase';
import { cn } from '../../lib/utils';
import IslamicPattern from '../../components/IslamicPattern';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      
      if (error) throw error;
      
      // Note: The actual email check happens in AuthContext after redirect
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Une erreur est survenue lors de la connexion Google.");
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
        <div className="bg-islamic-green p-10 text-white text-center relative overflow-hidden">
          <IslamicPattern dark className="opacity-20" />
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-islamic-gold" />
            </div>
            <h1 className="text-3xl font-serif font-bold leading-tight">Admin At-Tawheed</h1>
            <p className="text-white/70 text-sm">Espace de gestion sécurisé (Supabase)</p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-6">
            <p className="text-center text-gray-500 text-sm">
              Connectez-vous avec votre compte Google autorisé pour accéder au tableau de bord.
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-bold text-sm"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={cn(
                "w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-3 group",
                loading ? "bg-gray-300 cursor-not-allowed" : "bg-white border-2 border-gray-100 text-soft-black hover:border-islamic-green"
              )}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-islamic-green border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Se connecter avec Google
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-xs leading-relaxed">
              Email autorisé : <span className="font-bold text-islamic-green">ernst367@gmail.com</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
