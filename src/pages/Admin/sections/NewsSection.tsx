import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, X, Save,
  Calendar, Tag, FileText, Image, CheckCircle2, AlertCircle, Filter
} from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';

type Category = 'Actualité' | 'Événement' | 'Annonce' | 'Ramadan';
type Status = 'Publié' | 'Brouillon' | 'Archivé';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  image_url: string;
  status: Status;
  published_at: string | null;
  author_id: string;
}

const categoryColors: Record<Category, string> = {
  'Actualité': 'bg-blue-100 text-blue-700',
  'Événement': 'bg-purple-100 text-purple-700',
  'Annonce': 'bg-amber-100 text-amber-700',
  'Ramadan': 'bg-emerald-100 text-emerald-700',
};

const statusColors: Record<Status, string> = {
  'Publié': 'bg-emerald-100 text-emerald-700',
  'Brouillon': 'bg-gray-100 text-gray-600',
  'Archivé': 'bg-red-100 text-red-600',
};

const emptyArticle: Partial<Article> = {
  title: '', slug: '', excerpt: '', content: '',
  category: 'Actualité', image_url: '', status: 'Brouillon',
};

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/[àáâã]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i')
    .replace(/[ôõ]/g, 'o').replace(/[ùû]/g, 'u').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'Tous'>('Tous');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Partial<Article>>(emptyArticle);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('news_articles').select('*').order('published_at', { ascending: false });
      setArticles(data || []);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing({ ...emptyArticle }); setModal('create'); };
  const openEdit = (a: Article) => { setEditing({ ...a }); setModal('edit'); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: editing.title,
        slug: editing.slug || slugify(editing.title || ''),
        excerpt: editing.excerpt,
        content: editing.content,
        category: editing.category,
        image_url: editing.image_url,
        status: editing.status,
        published_at: editing.status === 'Publié' ? new Date().toISOString() : editing.published_at,
      };
      if (modal === 'create') {
        const { error } = await supabase.from('news_articles').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news_articles').update(payload).eq('id', editing.id);
        if (error) throw error;
      }
      setStatusMsg({ type: 'ok', msg: modal === 'create' ? 'Article créé avec succès !' : 'Article mis à jour.' });
      setModal(null);
      fetchArticles();
    } catch (e: any) {
      setStatusMsg({ type: 'err', msg: e.message || 'Erreur lors de la sauvegarde.' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('news_articles').delete().eq('id', id);
    setArticles(prev => prev.filter(a => a.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Tous' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between rounded-t-[2rem] z-10">
              <h2 className="text-xl font-serif font-bold text-soft-black">
                {modal === 'create' ? 'Nouvel Article' : 'Modifier l\'Article'}
              </h2>
              <button onClick={() => setModal(null)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Titre *</label>
                <input
                  type="text" value={editing.title || ''} placeholder="Titre de l'article"
                  onChange={e => setEditing({ ...editing, title: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Résumé</label>
                <textarea
                  rows={2} value={editing.excerpt || ''} placeholder="Bref résumé visible en liste..."
                  onChange={e => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contenu complet</label>
                <textarea
                  rows={8} value={editing.content || ''} placeholder="Corps complet de l'article..."
                  onChange={e => setEditing({ ...editing, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL de l'image</label>
                <input
                  type="url" value={editing.image_url || ''} placeholder="https://..."
                  onChange={e => setEditing({ ...editing, image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm"
                />
                {editing.image_url && (
                  <img src={editing.image_url} alt="preview" className="mt-2 h-32 w-full object-cover rounded-xl" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as Category })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm"
                  >
                    {(['Actualité', 'Événement', 'Annonce', 'Ramadan'] as Category[]).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Statut</label>
                  <select
                    value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Status })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm"
                  >
                    {(['Brouillon', 'Publié', 'Archivé'] as Status[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm">Annuler</button>
                <button
                  onClick={handleSave} disabled={saving || !editing.title}
                  className={cn('flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
                    saving || !editing.title ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-lg'
                  )}
                >
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
          <h3 className="text-2xl font-serif font-bold text-soft-black">Actualités & Événements</h3>
          <p className="text-gray-500 text-sm mt-1">{articles.length} article(s) au total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-islamic-green text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all">
          <Plus className="w-5 h-5" /> Nouvel Article
        </button>
      </div>

      {statusMsg && (
        <div className={cn('flex items-center gap-3 p-4 rounded-2xl text-sm font-medium', statusMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
          {statusMsg.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {statusMsg.msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm focus:border-islamic-green focus:outline-none transition-all" />
        </div>
        <div className="flex gap-2">
          {(['Tous', 'Publié', 'Brouillon', 'Archivé'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('px-4 py-2 rounded-xl text-sm font-bold transition-all', filterStatus === s ? 'bg-islamic-green text-white' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-islamic-green')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center space-y-4">
          <FileText className="w-16 h-16 text-gray-200 mx-auto" />
          <p className="text-gray-400 font-medium">Aucun article trouvé.</p>
          <button onClick={openCreate} className="text-islamic-green font-bold text-sm hover:underline">Créer le premier article →</button>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-50">
            {filtered.map(article => (
              <div key={article.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Image className="w-6 h-6" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-soft-black text-sm truncate">{article.title}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', categoryColors[article.category] || 'bg-gray-100 text-gray-600')}>{article.category}</span>
                    {article.published_at && <span className="text-[10px] text-gray-400">{new Date(article.published_at).toLocaleDateString('fr-FR')}</span>}
                  </div>
                </div>
                <span className={cn('text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0', statusColors[article.status] || 'bg-gray-100')}>{article.status}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(article)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-islamic-green hover:bg-green-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                  {deleteConfirm === article.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(article.id)} className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg">Oui</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-gray-100 text-xs font-bold rounded-lg">Non</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(article.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
