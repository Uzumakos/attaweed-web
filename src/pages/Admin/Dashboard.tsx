import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Clock, Newspaper, BookOpen, 
  Image as ImageIcon, Heart, Users, Mail, 
  Settings, ShieldCheck, LogOut, Bell, 
  Search, Plus, Filter, MoreVertical, 
  TrendingUp, TrendingDown, DollarSign, Calendar,
  ArrowRight, ExternalLink, CheckCircle2, AlertCircle,
  Globe
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '../../supabase';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import IslamicPattern from '../../components/IslamicPattern';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { adminData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !adminData) {
      navigate('/admin/login');
    }
  }, [adminData, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 text-soft-black flex flex-col fixed inset-y-0 left-0 z-50 arabesque-pattern">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-islamic-green rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight text-soft-black">AT-TAWHEED</h1>
            <p className="text-[10px] tracking-widest uppercase text-gray-400">ADMIN PANEL</p>
          </div>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2">
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
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group",
                activeTab === item.id 
                  ? "bg-islamic-green text-white shadow-lg" 
                  : "text-soft-black hover:bg-gray-100"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-islamic-gold" : "text-gray-400 group-hover:text-islamic-green")} />
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
              {sidebarItems.find(i => i.id === activeTab)?.name}
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
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", kpi.color)}>
                      <kpi.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-serif font-bold text-soft-black">{kpi.value}</span>
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", kpi.trend.startsWith('+') ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}>
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
                            <stop offset="5%" stopColor="#1A7A3C" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1A7A3C" stopOpacity={0}/>
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
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
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
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", act.color)}>
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
                        <div className={cn("text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider", ev.status === 'Confirmé' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                          {ev.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Settings className="w-12 h-12 animate-spin-slow" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-soft-black">Section en développement</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                L'interface de gestion pour <span className="font-bold text-islamic-green">{sidebarItems.find(i => i.id === activeTab)?.name}</span> est en cours de finalisation.
              </p>
              <button 
                onClick={() => setActiveTab('overview')}
                className="bg-islamic-green text-white px-8 py-3 rounded-full font-bold hover:bg-islamic-dark transition-all"
              >
                Retour au Tableau de bord
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
