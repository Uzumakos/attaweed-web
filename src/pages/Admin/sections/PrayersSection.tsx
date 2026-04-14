import React, { useState, useEffect } from 'react';
import { Clock, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';

interface PrayerForm {
  fajr: string;
  shuruq: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumuah: string;
}

const prayers = [
  { key: 'fajr', label: 'Fajr', arabic: 'الفجر', icon: '🌙', desc: 'Aube' },
  { key: 'shuruq', label: 'Shuruq', arabic: 'الشروق', icon: '🌅', desc: 'Lever du soleil' },
  { key: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر', icon: '☀️', desc: 'Midi' },
  { key: 'asr', label: 'Asr', arabic: 'العصر', icon: '🌤️', desc: 'Après-midi' },
  { key: 'maghrib', label: 'Maghrib', arabic: 'المغرب', icon: '🌇', desc: 'Coucher du soleil' },
  { key: 'isha', label: 'Isha', arabic: 'العشاء', icon: '🌃', desc: 'Nuit' },
  { key: 'jumuah', label: 'Jumu\'ah', arabic: 'الجمعة', icon: '🕌', desc: 'Prière du vendredi' },
] as const;

type PrayerKey = typeof prayers[number]['key'];

const PrayersSection: React.FC = () => {
  const [form, setForm] = useState<PrayerForm>({
    fajr: '', shuruq: '', dhuhr: '', asr: '', maghrib: '', isha: '', jumuah: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [tableReady, setTableReady] = useState<boolean | null>(null);

  useEffect(() => { fetchPrayerTimes(); }, []);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prayer_times')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      // Table is reachable if there's no "relation does not exist" error
      const tableExists = !error || error.code !== 'PGRST116' && !error.message?.includes('does not exist');
      setTableReady(tableExists);

      if (data) {
        setForm({
          fajr: data.fajr || '',
          shuruq: data.shuruq || '',
          dhuhr: data.dhuhr || '',
          asr: data.asr || '',
          maghrib: data.maghrib || '',
          isha: data.isha || '',
          jumuah: data.jumuah || '',
        });
        setUpdatedAt(data.updated_at);
      }
    } catch (e: any) {
      // If the error mentions the table doesn't exist, mark not ready
      const msg = e?.message || '';
      setTableReady(!msg.includes('does not exist') && !msg.includes('relation'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const payload = { ...form, updated_at: new Date().toISOString() };
      // Use upsert with a fixed row id=1 for single-row config
      const { error } = await supabase
        .from('prayer_times')
        .upsert({ id: 1, ...payload }, { onConflict: 'id' });
      if (error) throw error;
      setStatus('success');
      setUpdatedAt(new Date().toISOString());
    } catch (e) {
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif font-bold text-soft-black">Horaires des Prières</h3>
          <p className="text-gray-500 text-sm mt-1">
            Ces horaires s'affichent sur la page d'accueil et la page Islam.
            {updatedAt && (
              <span className="ml-2 text-gray-400">
                Dernière mise à jour : {new Date(updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchPrayerTimes}
          className="p-2 text-gray-400 hover:text-islamic-green transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Status Banner */}
      {status === 'success' && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Horaires mis à jour avec succès et publiés sur le site.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-medium text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          Erreur lors de la sauvegarde. Vérifiez la table Supabase `prayer_times`.
        </div>
      )}

      {/* Prayer Time Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {prayers.map((prayer) => (
          <div
            key={prayer.key}
            className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-islamic-green/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {prayer.icon}
              </div>
              <div>
                <p className="font-bold text-soft-black">{prayer.label}</p>
                <p className="text-xs text-gray-400">{prayer.desc}</p>
              </div>
              <p className="ml-auto arabic-text text-xl text-islamic-green opacity-60">{prayer.arabic}</p>
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={form[prayer.key as PrayerKey]}
                onChange={(e) => setForm({ ...form, [prayer.key]: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black font-mono font-bold text-lg focus:border-islamic-green focus:outline-none transition-all"
              />
            </div>
          </div>
        ))}

        {/* Jumuah special card */}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg',
            saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-xl hover:scale-[1.02]'
          )}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Publier les Horaires
        </button>
      </div>

      {/* SQL hint — only shown if table is not reachable */}
      {tableReady === false && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm">
          <p className="font-bold text-amber-800 mb-1">⚠️ Table Supabase requise</p>
          <p className="text-amber-700 font-mono text-xs">
            CREATE TABLE prayer_times (id INT PRIMARY KEY DEFAULT 1, fajr TEXT, shuruq TEXT, dhuhr TEXT, asr TEXT, maghrib TEXT, isha TEXT, jumuah TEXT, updated_at TIMESTAMPTZ DEFAULT now());
          </p>
        </div>
      )}
      {tableReady === true && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-medium text-emerald-700">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Table <span className="font-mono font-bold mx-1">prayer_times</span> connectée et opérationnelle.
        </div>
      )}
    </div>
  );
};

export default PrayersSection;
