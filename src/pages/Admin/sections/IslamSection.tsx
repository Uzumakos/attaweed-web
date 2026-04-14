import React, { useState, useEffect } from 'react';
import { Save, BookOpen, CheckCircle2, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';

interface IslamContent {
  verset_arabic: string;
  verset_french: string;
  verset_reference: string;
  hadith_arabic: string;
  hadith_french: string;
  hadith_source: string;
  duaa_arabic: string;
  duaa_french: string;
  duaa_occasion: string;
}

const defaultContent: IslamContent = {
  verset_arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  verset_french: 'Certes, avec la difficulté, il y a une facilité.',
  verset_reference: 'Sourate Ash-Sharh (94:6)',
  hadith_arabic: '',
  hadith_french: '',
  hadith_source: '',
  duaa_arabic: '',
  duaa_french: '',
  duaa_occasion: '',
};

const IslamSection: React.FC = () => {
  const [content, setContent] = useState<IslamContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activePane, setActivePane] = useState<'verset' | 'hadith' | 'duaa'>('verset');
  const [tableReady, setTableReady] = useState<boolean | null>(null);

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('islam_content').select('*').eq('id', 1).single();
      const reached = !error || (!error.message?.includes('does not exist') && !error.message?.includes('relation'));
      setTableReady(reached);
      if (data) setContent({ ...defaultContent, ...data });
    } catch (e: any) {
      const msg = e?.message || '';
      setTableReady(!msg.includes('does not exist') && !msg.includes('relation'));
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const { error } = await supabase.from('islam_content').upsert({ id: 1, ...content }, { onConflict: 'id' });
      if (error) throw error;
      setStatus('success');
    } catch { setStatus('error'); }
    finally {
      setSaving(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const panes = [
    { key: 'verset' as const, label: 'Verset du Coran', icon: '📖' },
    { key: 'hadith' as const, label: 'Hadith', icon: '🌙' },
    { key: 'duaa' as const, label: 'Duaa', icon: '🤲' },
  ];

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif font-bold text-soft-black">Contenu Islam</h3>
          <p className="text-gray-500 text-sm mt-1">Gérez le contenu islamique affiché sur le site.</p>
        </div>
        <button onClick={fetchContent} className="p-2 text-gray-400 hover:text-islamic-green transition-colors"><RefreshCw className="w-5 h-5" /></button>
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> Contenu mis à jour et publié sur le site.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-medium text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" /> Erreur lors de la sauvegarde. Vérifiez la table `islam_content`.
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 bg-gray-100 rounded-2xl p-1">
        {panes.map(p => (
          <button key={p.key} onClick={() => setActivePane(p.key)}
            className={cn('flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all',
              activePane === p.key ? 'bg-white shadow-sm text-soft-black' : 'text-gray-400 hover:text-gray-600')}>
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      {/* Verset */}
      {activePane === 'verset' && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-islamic-gold/10 rounded-xl flex items-center justify-center text-xl">📖</div>
            <h4 className="font-serif font-bold text-lg text-soft-black">Verset du Coran</h4>
          </div>

          {/* Preview */}
          {content.verset_arabic && (
            <div className="bg-islamic-dark rounded-2xl p-6 text-center space-y-3">
              <p className="arabic-text text-3xl text-islamic-gold leading-relaxed">{content.verset_arabic}</p>
              {content.verset_french && <p className="text-white/80 font-serif italic">"{content.verset_french}"</p>}
              {content.verset_reference && <p className="text-islamic-gold/70 text-xs uppercase tracking-widest font-bold">{content.verset_reference}</p>}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Texte en arabe *</label>
              <textarea rows={3} value={content.verset_arabic} onChange={e => setContent({ ...content, verset_arabic: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black arabic-text text-2xl text-right focus:border-islamic-green focus:outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Traduction française</label>
              <textarea rows={2} value={content.verset_french} onChange={e => setContent({ ...content, verset_french: e.target.value })} placeholder="Traduction du verset..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all resize-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Référence (Sourate, verset)</label>
              <input type="text" value={content.verset_reference} onChange={e => setContent({ ...content, verset_reference: e.target.value })} placeholder="Sourate Al-Baqara (2:255)"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Hadith */}
      {activePane === 'hadith' && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">🌙</div>
            <h4 className="font-serif font-bold text-lg text-soft-black">Hadith</h4>
          </div>
          {content.hadith_arabic && (
            <div className="bg-gray-50 rounded-2xl p-6 text-center space-y-3">
              <p className="arabic-text text-2xl text-soft-black leading-relaxed">{content.hadith_arabic}</p>
              {content.hadith_french && <p className="text-gray-600 italic text-sm">"{content.hadith_french}"</p>}
              {content.hadith_source && <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{content.hadith_source}</p>}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Texte en arabe</label>
              <textarea rows={3} value={content.hadith_arabic} onChange={e => setContent({ ...content, hadith_arabic: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black arabic-text text-xl text-right focus:border-islamic-green focus:outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Traduction française</label>
              <textarea rows={3} value={content.hadith_french} onChange={e => setContent({ ...content, hadith_french: e.target.value })} placeholder="Traduction du hadith..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all resize-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Source (Bukhari, Muslim...)</label>
              <input type="text" value={content.hadith_source} onChange={e => setContent({ ...content, hadith_source: e.target.value })} placeholder="Rapporté par Al-Bukhari"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Duaa */}
      {activePane === 'duaa' && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl">🤲</div>
            <h4 className="font-serif font-bold text-lg text-soft-black">Duaa (Invocation)</h4>
          </div>
          {content.duaa_arabic && (
            <div className="bg-emerald-50 rounded-2xl p-6 text-center space-y-3">
              <p className="arabic-text text-2xl text-islamic-green leading-relaxed">{content.duaa_arabic}</p>
              {content.duaa_french && <p className="text-gray-600 italic text-sm">"{content.duaa_french}"</p>}
              {content.duaa_occasion && <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest">{content.duaa_occasion}</p>}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Duaa en arabe</label>
              <textarea rows={3} value={content.duaa_arabic} onChange={e => setContent({ ...content, duaa_arabic: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black arabic-text text-xl text-right focus:border-islamic-green focus:outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Traduction française</label>
              <textarea rows={2} value={content.duaa_french} onChange={e => setContent({ ...content, duaa_french: e.target.value })} placeholder="Traduction de l'invocation..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all resize-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Occasion</label>
              <input type="text" value={content.duaa_occasion} onChange={e => setContent({ ...content, duaa_occasion: e.target.value })} placeholder="Duaa du matin, du soir..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className={cn('flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg',
            saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-xl hover:scale-[1.02]')}>
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Publier le Contenu
        </button>
      </div>

      {tableReady === false && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm">
          <p className="font-bold text-amber-800 mb-1">⚠️ Table Supabase requise</p>
          <p className="text-amber-700 font-mono text-xs break-all">
            CREATE TABLE islam_content (id INT PRIMARY KEY DEFAULT 1, verset_arabic TEXT, verset_french TEXT, verset_reference TEXT, hadith_arabic TEXT, hadith_french TEXT, hadith_source TEXT, duaa_arabic TEXT, duaa_french TEXT, duaa_occasion TEXT);
          </p>
        </div>
      )}
      {tableReady === true && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-medium text-emerald-700">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Table <span className="font-mono font-bold mx-1">islam_content</span> connectée et opérationnelle.
        </div>
      )}
    </div>
  );
};

export default IslamSection;
