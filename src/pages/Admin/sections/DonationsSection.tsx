import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, TrendingUp, Search, Eye, Filter, X } from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';

type DonationStatus = 'Complété' | 'En attente' | 'Échoué';
type Destination = 'Entretien' | 'Éducation' | 'Aide sociale' | 'Général';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donor_name: string;
  donor_email: string;
  destination: Destination;
  method: string;
  status: DonationStatus;
  timestamp: string;
}

const statusColors: Record<DonationStatus, string> = {
  'Complété': 'bg-emerald-100 text-emerald-700',
  'En attente': 'bg-amber-100 text-amber-700',
  'Échoué': 'bg-red-100 text-red-600',
};

const destinationColors: Record<Destination, string> = {
  'Entretien': 'bg-blue-100 text-blue-700',
  'Éducation': 'bg-purple-100 text-purple-700',
  'Aide sociale': 'bg-rose-100 text-rose-700',
  'Général': 'bg-gray-100 text-gray-700',
};

const DonationsSection: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<DonationStatus | 'Tous'>('Tous');
  const [selected, setSelected] = useState<Donation | null>(null);

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('donations').select('*').order('timestamp', { ascending: false });
      setDonations(data || []);
    } catch { setDonations([]); }
    finally { setLoading(false); }
  };

  const filtered = donations.filter(d => {
    const matchSearch = d.donor_name?.toLowerCase().includes(search.toLowerCase()) || d.donor_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Tous' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const total = donations.filter(d => d.status === 'Complété').reduce((s, d) => s + (d.amount || 0), 0);
  const thisMonth = donations.filter(d => {
    const date = new Date(d.timestamp);
    const now = new Date();
    return d.status === 'Complété' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).reduce((s, d) => s + (d.amount || 0), 0);

  const byCat = (cat: Destination) => donations.filter(d => d.status === 'Complété' && d.destination === cat).reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div className="space-y-6">
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md">
            <div className="border-b border-gray-100 px-8 py-5 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-soft-black">Détail du Don</h2>
              <button onClick={() => setSelected(null)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="text-center py-4">
                <p className="text-5xl font-serif font-bold text-islamic-green">{selected.amount?.toLocaleString('fr-FR')}</p>
                <p className="text-gray-400 font-bold mt-1">{selected.currency || 'HTG'}</p>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Donateur', value: selected.donor_name },
                  { label: 'Email', value: selected.donor_email },
                  { label: 'Destination', value: selected.destination },
                  { label: 'Méthode', value: selected.method },
                  { label: 'Date', value: new Date(selected.timestamp).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Statut', value: selected.status },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="font-bold text-gray-500">{label}</span>
                    <span className="font-medium text-soft-black text-right">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-serif font-bold text-soft-black">Dons & Finances</h3>
        <p className="text-gray-500 text-sm mt-1">Suivi des dons reçus via la plateforme.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total reçu', value: `${total.toLocaleString()} HTG`, icon: DollarSign, cls: 'bg-emerald-50 text-emerald-600' },
          { label: 'Ce mois-ci', value: `${thisMonth.toLocaleString()} HTG`, icon: TrendingUp, cls: 'bg-blue-50 text-blue-600' },
          { label: 'Nb. de dons', value: donations.filter(d => d.status === 'Complété').length, icon: Heart, cls: 'bg-rose-50 text-rose-600' },
          { label: 'En attente', value: donations.filter(d => d.status === 'En attente').length, icon: Filter, cls: 'bg-amber-50 text-amber-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', kpi.cls)}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-lg font-serif font-bold text-soft-black">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Destination Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['Entretien', 'Éducation', 'Aide sociale', 'Général'] as Destination[]).map(cat => (
          <div key={cat} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <span className={cn('text-xs font-bold px-2 py-1 rounded-lg', destinationColors[cat])}>{cat}</span>
            <p className="text-xl font-bold text-soft-black mt-2">{byCat(cat).toLocaleString()} HTG</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher un donateur..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm focus:border-islamic-green focus:outline-none" />
        </div>
        {(['Tous', 'Complété', 'En attente', 'Échoué'] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={cn('px-4 py-2 rounded-xl text-sm font-bold transition-all', filterStatus === s ? 'bg-islamic-green text-white' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-islamic-green')}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center space-y-4">
          <Heart className="w-16 h-16 text-gray-200 mx-auto" />
          <p className="text-gray-400 font-medium">Aucun don enregistré pour l'instant.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Donateur</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Montant</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Destination</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Méthode</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Date</th>
                <th className="text-right px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-soft-black text-sm">{d.donor_name || 'Anonyme'}</p>
                    <p className="text-xs text-gray-400">{d.donor_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-islamic-green text-sm">{d.amount?.toLocaleString('fr-FR')} <span className="text-gray-400">{d.currency || 'HTG'}</span></p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={cn('text-[10px] font-bold px-2 py-1 rounded-lg', destinationColors[d.destination] || 'bg-gray-100 text-gray-600')}>{d.destination}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell"><p className="text-sm text-gray-500">{d.method}</p></td>
                  <td className="px-6 py-4"><span className={cn('text-[10px] font-bold px-3 py-1.5 rounded-lg', statusColors[d.status] || 'bg-gray-100')}>{d.status}</span></td>
                  <td className="px-6 py-4 hidden lg:table-cell"><p className="text-sm text-gray-500">{d.timestamp ? new Date(d.timestamp).toLocaleDateString('fr-FR') : '—'}</p></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelected(d)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-islamic-green hover:bg-green-50 rounded-lg transition-all ml-auto">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationsSection;
