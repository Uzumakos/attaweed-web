import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Clock, Newspaper, BookOpen,
  Image as ImageIcon, Heart, Users, Mail,
  Settings, LogOut, Bell,
  Search, Plus,
  DollarSign, Calendar,
  ArrowRight, CheckCircle2, AlertCircle,
  Globe, UserPlus, Eye, EyeOff, Trash2, Shield, Edit2, X
} from 'lucide-react';
import PrayersSection from './sections/PrayersSection';
import NewsSection from './sections/NewsSection';
import MessagesSection from './sections/MessagesSection';
import MembersSection from './sections/MembersSection';
import DonationsSection from './sections/DonationsSection';
import SettingsSection from './sections/SettingsSection';
import MediaSection from './sections/MediaSection';
import IslamSection from './sections/IslamSection';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '../../supabase';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import IslamicPattern from '../../components/IslamicPattern';
import { AdminUser } from '../../types';

// ─── Create Admin Modal ────────────────────────────────────────────────────
interface CreateAdminModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onClose, onCreated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'Éditeur' | 'Modérateur' | 'Super Admin'>('Éditeur');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Create the user in Supabase Auth using the admin API via edge function
      //    (We use supabase.auth.admin.createUser only on server side, so we use
      //    the standard signUp approach here and insert admin record)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error('La création du compte a échoué.');

      // 2. Insert into admins table
      const { error: insertError } = await supabase.from('admins').insert({
        id: signUpData.user.id,
        email: email.trim().toLowerCase(),
        display_name: displayName,
        role,
        last_login: null,
      });

      if (insertError) throw insertError;

      setSuccess(`Administrateur "${displayName}" créé avec succès ! Un email de confirmation a été envoyé à ${email}.`);
      setTimeout(() => {
        onCreated();
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error('Create admin error:', err);
      if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
        setError('Cet email est déjà enregistré dans le système.');
      } else if (err.message?.includes('Password should be')) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
      } else {
        setError(err.message || 'Une erreur est survenue lors de la création.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="bg-islamic-green p-8 text-white relative">
          <IslamicPattern dark className="opacity-10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-islamic-gold" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold">Nouvel Administrateur</h2>
                <p className="text-white/70 text-sm">Créer un accès admin sécurisé</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleCreate} className="p-8 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              {success}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Nom d'affichage</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: Ibrahim Dupont"
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black placeholder-gray-400 focus:border-islamic-green focus:outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black placeholder-gray-400 focus:border-islamic-green focus:outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
                required
                minLength={8}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black placeholder-gray-400 focus:border-islamic-green focus:outline-none transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-islamic-green transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm"
            >
              <option value="Éditeur">Éditeur – Gérer le contenu</option>
              <option value="Modérateur">Modérateur – Modérer les messages</option>
              <option value="Super Admin">Super Admin – Accès complet</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !email || !password || !displayName}
              className={cn(
                'flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
                loading || !email || !password || !displayName
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-islamic-green text-white hover:shadow-lg'
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Créer l'administrateur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Dashboard ─────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { adminData, loading, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  // Admins management state
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !adminData) {
      navigate('/admin/login');
    }
  }, [adminData, loading, navigate]);

  useEffect(() => {
    if (activeTab === 'admins' && isSuperAdmin) {
      fetchAdmins();
    }
  }, [activeTab, isSuperAdmin]);

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('display_name');
      if (!error && data) {
        setAdmins(data.map((a) => ({
          id: a.id,
          email: a.email,
          displayName: a.display_name,
          role: a.role,
          lastLogin: a.last_login,
        })));
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setAdminsLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (adminId === adminData?.id) return; // Can't delete self
    try {
      const { error } = await supabase.from('admins').delete().eq('id', adminId);
      if (!error) {
        setAdmins((prev) => prev.filter((a) => a.id !== adminId));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarItems = [
    { id: 'overview', name: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'prayers', name: 'Horaires des prières', icon: Clock },
    { id: 'news', name: 'Actualités & Événements', icon: Newspaper },
    { id: 'islam', name: 'Contenu Islam', icon: BookOpen },
    { id: 'media', name: 'Médiathèque', icon: ImageIcon },
    { id: 'donations', name: 'Dons & Finances', icon: Heart },
    { id: 'members', name: 'Membres', icon: Users },
    { id: 'messages', name: 'Messages', icon: Mail },
    ...(isSuperAdmin ? [{ id: 'admins', name: 'Administrateurs', icon: Shield }] : []),
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ];

  const donationData = [
    { name: 'Jan', amount: 45000 },
    { name: 'Fév', amount: 52000 },
    { name: 'Mar', amount: 48000 },
    { name: 'Avr', amount: 61000 },
    { name: 'Mai', amount: 55000 },
    { name: 'Juin', amount: 67000 },
  ];

  const pieData = [
    { name: 'Entretien', value: 40, color: '#1A7A3C' },
    { name: 'Éducation', value: 30, color: '#C8A94A' },
    { name: 'Aide Sociale', value: 20, color: '#0F4F27' },
    { name: 'Général', value: 10, color: '#1A1A1A' },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Éditeur':
        return 'bg-blue-100 text-blue-700';
      case 'Modérateur':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Create Admin Modal */}
      {showCreateModal && (
        <CreateAdminModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchAdmins}
        />
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 text-soft-black flex flex-col fixed inset-y-0 left-0 z-50 arabesque-pattern">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-islamic-green rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight text-soft-black">ATTAWHEED</h1>
            <p className="text-[10px] tracking-widest uppercase text-gray-400">ADMIN PANEL</p>
          </div>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/"
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-soft-black hover:bg-gray-100 transition-all group mb-4"
          >
            <Globe className="w-5 h-5 text-gray-400 group-hover:text-islamic-green" />
            Voir le site
          </Link>

          <div className="h-px bg-gray-100 mx-4 mb-4" />

          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group',
                activeTab === item.id
                  ? 'bg-islamic-green text-white shadow-lg'
                  : 'text-soft-black hover:bg-gray-100'
              )}
            >
              <item.icon className={cn('w-5 h-5', activeTab === item.id ? 'text-islamic-gold' : 'text-gray-400 group-hover:text-islamic-green')} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-soft-black hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif font-bold text-soft-black">
              {sidebarItems.find((i) => i.id === activeTab)?.name}
            </h2>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <span>Admin</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-soft-black">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-gray-50 border-2 border-gray-100 rounded-xl py-2 pl-10 pr-4 w-64 focus:border-islamic-green focus:outline-none transition-all text-sm"
              />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-islamic-green transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-soft-black leading-tight">{adminData?.displayName}</p>
                <p className="text-[10px] uppercase tracking-widest text-islamic-gold font-bold">{adminData?.role}</p>
              </div>
              <div className="w-10 h-10 bg-islamic-green rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                {adminData?.displayName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Dons ce mois', value: '61,000 HTG', trend: '+12%', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Nouveaux Membres', value: '24', trend: '+5%', icon: Users, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Messages non lus', value: '12', trend: '-2', icon: Mail, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Médias uploadés', value: '156', trend: '+8', icon: ImageIcon, color: 'text-purple-600 bg-purple-50' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
                    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform', kpi.color)}>
                      <kpi.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-serif font-bold text-soft-black">{kpi.value}</span>
                        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', kpi.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600')}>
                          {kpi.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-soft-black">Évolution des Dons (6 mois)</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Jan 2026 - Juin 2026</span>
                    </div>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={donationData}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1A7A3C" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#1A7A3C" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontWeight: 'bold', color: '#1A7A3C' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#1A7A3C" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-soft-black">Répartition des Dons</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={80}
                          paddingAngle={5} dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-gray-500">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-soft-black">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity & Events */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-soft-black">Activité Récente</h3>
                    <button className="text-islamic-green font-bold text-sm hover:underline">Tout voir</button>
                  </div>
                  <div className="space-y-6">
                    {[
                      { user: 'Jean Pierre', action: 'a fait un don de 5,000 HTG', time: 'il y a 5 min', icon: Heart, color: 'text-red-600 bg-red-50' },
                      { user: 'Admin', action: 'a mis à jour les horaires de prière', time: 'il y a 2h', icon: Clock, color: 'text-blue-600 bg-blue-50' },
                      { user: 'Marie Louis', action: 's\'est inscrite comme membre', time: 'hier', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
                      { user: 'System', action: 'nouveau message de contact reçu', time: 'hier', icon: Mail, color: 'text-amber-600 bg-amber-50' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', act.color)}>
                          <act.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-soft-black">
                            <span className="font-bold">{act.user}</span> {act.action}
                          </p>
                          <p className="text-xs text-gray-400">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-soft-black">Prochains Événements</h3>
                    <button className="bg-islamic-green text-white p-2 rounded-xl hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: 'Iftar Communautaire', date: '25 Mars 2026', time: '18:15', status: 'Confirmé' },
                      { title: 'Cours d\'Arabe - Session 2', date: '28 Mars 2026', time: '10:00', status: 'En attente' },
                      { title: 'Conférence - La Foi en Haïti', date: '02 Avril 2026', time: '14:30', status: 'Confirmé' },
                    ].map((ev, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-islamic-green transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-bold text-islamic-green uppercase">{ev.date.split(' ')[1]}</span>
                            <span className="text-lg font-serif font-bold leading-none">{ev.date.split(' ')[0]}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-soft-black group-hover:text-islamic-green transition-colors">{ev.title}</h4>
                            <p className="text-xs text-gray-400">{ev.time}</p>
                          </div>
                        </div>
                        <div className={cn('text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider', ev.status === 'Confirmé' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600')}>
                          {ev.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMINS TAB (Super Admin only) */}
          {activeTab === 'admins' && isSuperAdmin && (
            <div className="space-y-6">
              {/* Header bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-soft-black">Gestion des Administrateurs</h3>
                  <p className="text-gray-500 text-sm mt-1">Créez et gérez les comptes d'accès au panneau d'administration.</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-islamic-green text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Nouvel Admin
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Admins', value: admins.length, color: 'bg-islamic-green/10 text-islamic-green' },
                  { label: 'Super Admins', value: admins.filter(a => a.role === 'Super Admin').length, color: 'bg-purple-100 text-purple-700' },
                  { label: 'Éditeurs / Modérateurs', value: admins.filter(a => a.role !== 'Super Admin').length, color: 'bg-blue-100 text-blue-700' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-xl', s.color)}>
                      {s.value}
                    </div>
                    <p className="text-sm font-bold text-gray-600">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Admin list */}
              {adminsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
                </div>
              ) : admins.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center space-y-4">
                  <Shield className="w-16 h-16 text-gray-200 mx-auto" />
                  <p className="text-gray-400 font-medium">Aucun administrateur trouvé.</p>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Admin</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rôle</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Dernière connexion</th>
                        <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-islamic-green rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {admin.displayName?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-soft-black text-sm">
                                  {admin.displayName}
                                  {admin.id === adminData?.id && (
                                    <span className="ml-2 text-[10px] bg-islamic-green/10 text-islamic-green px-2 py-0.5 rounded-full font-bold">Vous</span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-400">{admin.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn('text-xs font-bold px-3 py-1.5 rounded-lg', getRoleBadge(admin.role))}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                              {admin.lastLogin
                                ? new Date(admin.lastLogin).toLocaleDateString('fr-FR', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                  })
                                : 'Jamais connecté'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {admin.id !== adminData?.id && (
                                <>
                                  {deleteConfirm === admin.id ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-red-600 font-medium">Confirmer ?</span>
                                      <button
                                        onClick={() => handleDeleteAdmin(admin.id)}
                                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all"
                                      >
                                        Oui
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all"
                                      >
                                        Non
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeleteConfirm(admin.id)}
                                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Note about email confirmation */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Note importante</p>
                  <p className="text-sm text-amber-700 mt-0.5">
                    Les nouveaux admins recevront un email de confirmation. Ils devront valider leur email avant de pouvoir se connecter.
                    Si la confirmation d'email est désactivée dans Supabase, ils pourront se connecter immédiatement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* REAL SECTIONS */}
          {activeTab === 'prayers' && <PrayersSection />}
          {activeTab === 'news' && <NewsSection />}
          {activeTab === 'islam' && <IslamSection />}
          {activeTab === 'media' && <MediaSection />}
          {activeTab === 'donations' && <DonationsSection />}
          {activeTab === 'members' && <MembersSection />}
          {activeTab === 'messages' && <MessagesSection />}
          {activeTab === 'settings' && <SettingsSection />}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
