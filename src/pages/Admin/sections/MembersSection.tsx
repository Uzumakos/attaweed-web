import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Phone, Mail, X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';

type MemberStatus = 'Actif' | 'Inactif' | 'En attente';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  joined_at: string;
  status: MemberStatus;
  groups: string[];
}

const statusColors: Record<MemberStatus, string> = {
  'Actif': 'bg-emerald-100 text-emerald-700',
  'Inactif': 'bg-gray-100 text-gray-600',
  'En attente': 'bg-amber-100 text-amber-700',
};

const emptyMember: Partial<Member> = {
  first_name: '', last_name: '', email: '', phone: '', status: 'En attente', groups: [],
};

const MembersSection: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<MemberStatus | 'Tous'>('Tous');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Partial<Member>>(emptyMember);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('members').select('*').order('joined_at', { ascending: false });
      setMembers(data || []);
    } catch { setMembers([]); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        first_name: editing.first_name,
        last_name: editing.last_name,
        email: editing.email,
        phone: editing.phone,
        status: editing.status,
        groups: editing.groups || [],
        joined_at: editing.joined_at || new Date().toISOString(),
      };
      if (modal === 'create') {
        const { error } = await supabase.from('members').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('members').update(payload).eq('id', editing.id);
        if (error) throw error;
      }
      setStatusMsg({ type: 'ok', msg: modal === 'create' ? 'Membre ajouté avec succès !' : 'Membre mis à jour.' });
      setModal(null);
      fetchMembers();
    } catch (e: any) {
      setStatusMsg({ type: 'err', msg: e.message || 'Erreur lors de la sauvegarde.' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('members').delete().eq('id', id);
    setMembers(prev => prev.filter(m => m.id !== id));
    setDeleteConfirm(null);
  };

  const handleStatusChange = async (id: string, newStatus: MemberStatus) => {
    await supabase.from('members').update({ status: newStatus }).eq('id', id);
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const filtered = members.filter(m => {
    const name = `${m.first_name} ${m.last_name}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Tous' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg">
            <div className="border-b border-gray-100 px-8 py-5 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-soft-black">{modal === 'create' ? 'Ajouter un Membre' : 'Modifier le Membre'}</h2>
              <button onClick={() => setModal(null)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Prénom *</label>
                  <input type="text" value={editing.first_name || ''} onChange={e => setEditing({ ...editing, first_name: e.target.value })} placeholder="Prénom"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nom *</label>
                  <input type="text" value={editing.last_name || ''} onChange={e => setEditing({ ...editing, last_name: e.target.value })} placeholder="Nom de famille"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input type="email" value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="email@exemple.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                <input type="tel" value={editing.phone || ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} placeholder="+509 XXXX XXXX"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Statut</label>
                <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as MemberStatus })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm">
                  <option value="En attente">En attente</option>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm">Annuler</button>
                <button onClick={handleSave} disabled={saving || !editing.first_name || !editing.last_name}
                  className={cn('flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
                    saving || !editing.first_name || !editing.last_name ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-lg')}>
                  {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Sauvegarder</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-soft-black">Membres</h3>
          <p className="text-gray-500 text-sm mt-1">{members.length} membre(s) enregistré(s)</p>
        </div>
        <button onClick={() => { setEditing({ ...emptyMember }); setModal('create'); }}
          className="flex items-center gap-2 bg-islamic-green text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all">
          <Plus className="w-5 h-5" /> Ajouter un Membre
        </button>
      </div>

      {statusMsg && (
        <div className={cn('flex items-center gap-3 p-4 rounded-2xl text-sm font-medium', statusMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
          {statusMsg.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {statusMsg.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { label: 'Actifs', count: members.filter(m => m.status === 'Actif').length, cls: 'bg-emerald-100 text-emerald-700' },
          { label: 'En attente', count: members.filter(m => m.status === 'En attente').length, cls: 'bg-amber-100 text-amber-700' },
          { label: 'Inactifs', count: members.filter(m => m.status === 'Inactif').length, cls: 'bg-gray-100 text-gray-600' },
        ]).map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-xl', s.cls)}>{s.count}</div>
            <p className="text-sm font-bold text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher un membre..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm focus:border-islamic-green focus:outline-none transition-all" />
        </div>
        {(['Tous', 'Actif', 'En attente', 'Inactif'] as const).map(s => (
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
          <Users className="w-16 h-16 text-gray-200 mx-auto" />
          <p className="text-gray-400 font-medium">Aucun membre trouvé.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Membre</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Inscrit le</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-islamic-green/10 rounded-xl flex items-center justify-center font-bold text-islamic-green text-sm">
                        {member.first_name?.[0]}{member.last_name?.[0]}
                      </div>
                      <p className="font-bold text-soft-black text-sm">{member.first_name} {member.last_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="space-y-0.5">
                      {member.email && <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {member.email}</p>}
                      {member.phone && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {member.phone}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select value={member.status} onChange={e => handleStatusChange(member.id, e.target.value as MemberStatus)}
                      className={cn('text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none', statusColors[member.status])}>
                      <option value="Actif">Actif</option>
                      <option value="En attente">En attente</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-500">{member.joined_at ? new Date(member.joined_at).toLocaleDateString('fr-FR') : '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditing({ ...member }); setModal('edit'); }} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-islamic-green hover:bg-green-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                      {deleteConfirm === member.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(member.id)} className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg">Oui</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-gray-100 text-xs font-bold rounded-lg">Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(member.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
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

export default MembersSection;
