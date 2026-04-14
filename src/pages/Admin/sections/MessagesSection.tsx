import React, { useState, useEffect } from 'react';
import { Mail, Eye, Reply, CheckCircle2, Trash2, Search, X, Send } from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';

type MsgStatus = 'Non lu' | 'Lu' | 'Répondu';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MsgStatus;
  timestamp: string;
}

const statusColors: Record<MsgStatus, string> = {
  'Non lu': 'bg-red-100 text-red-700',
  'Lu': 'bg-gray-100 text-gray-600',
  'Répondu': 'bg-emerald-100 text-emerald-700',
};

const MessagesSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MsgStatus | 'Tous'>('Tous');
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('contact_messages').select('*').order('timestamp', { ascending: false });
      setMessages(data || []);
    } catch { setMessages([]); }
    finally { setLoading(false); }
  };

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ status: 'Lu' }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Lu' } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'Lu' } : null);
  };

  const markReplied = async (id: string) => {
    await supabase.from('contact_messages').update({ status: 'Répondu' }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Répondu' } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'Répondu' } : null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteConfirm(null);
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (msg.status === 'Non lu') markRead(msg.id);
  };

  const filtered = messages.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Tous' || m.status === filter;
    return matchSearch && matchFilter;
  });

  const unread = messages.filter(m => m.status === 'Non lu').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-soft-black">Messages de Contact</h3>
          <p className="text-gray-500 text-sm mt-1">
            {messages.length} message(s) total
            {unread > 0 && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 font-bold text-xs rounded-full">{unread} non lu(s)</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm focus:border-islamic-green focus:outline-none transition-all" />
        </div>
        {(['Tous', 'Non lu', 'Lu', 'Répondu'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-4 py-2 rounded-xl text-sm font-bold transition-all', filter === s ? 'bg-islamic-green text-white' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-islamic-green')}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Mail className="w-12 h-12 text-gray-200 mx-auto" />
              <p className="text-gray-400 text-sm font-medium">Aucun message.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(msg => (
                <button key={msg.id} onClick={() => openMessage(msg)}
                  className={cn('w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors', selected?.id === msg.id && 'bg-islamic-green/5 border-r-2 border-islamic-green')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={cn('text-sm truncate', msg.status === 'Non lu' ? 'font-bold text-soft-black' : 'font-medium text-gray-600')}>{msg.name}</p>
                      <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full', statusColors[msg.status])}>{msg.status}</span>
                      <span className="text-[10px] text-gray-400">{new Date(msg.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif font-bold text-xl text-soft-black">{selected.subject}</h4>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="font-bold text-soft-black">{selected.name}</span>
                      <span>·</span>
                      <a href={`mailto:${selected.email}`} className="text-islamic-green hover:underline">{selected.email}</a>
                      {selected.phone && <><span>·</span><span>{selected.phone}</span></>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{new Date(selected.timestamp).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all shrink-0">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{selected.message}</p>
              </div>
              <div className="p-6 border-t border-gray-100 flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  onClick={() => markReplied(selected.id)}
                  className="flex items-center gap-2 bg-islamic-green text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" /> Répondre par email
                </a>
                {selected.status !== 'Répondu' && (
                  <button onClick={() => markReplied(selected.id)} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all">
                    <CheckCircle2 className="w-4 h-4" /> Marquer répondu
                  </button>
                )}
                {deleteConfirm === selected.id ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-red-600 font-medium">Confirmer ?</span>
                    <button onClick={() => handleDelete(selected.id)} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg">Oui</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-lg">Non</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(selected.id)} className="ml-auto flex items-center gap-2 text-gray-400 hover:text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm font-bold">
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 h-full min-h-[300px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <Mail className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="text-gray-400 text-sm font-medium">Sélectionnez un message</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesSection;
