import React, { useState } from 'react';
import { Save, Globe, Phone, Mail, MapPin, Facebook, Instagram, Youtube, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';
import { useEffect } from 'react';

interface SiteSettings {
  mosque_name: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  about_text: string;
  founding_year: string;
}

const defaultSettings: SiteSettings = {
  mosque_name: 'Mosquée Attawheed',
  city: 'Pétion-Ville',
  country: 'Haïti',
  address: 'Pétion-Ville, Haïti',
  phone: '+509 XXXX XXXX',
  email: 'contact@attawheed.com',
  whatsapp: '+50912345678',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  about_text: 'La Mosquée Attawheed est un espace de foi, d\'éducation et de fraternité au cœur d\'Haïti.',
  founding_year: '2010',
};

const SettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [tableReady, setTableReady] = useState<boolean | null>(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      const reached = !error || (!error.message?.includes('does not exist') && !error.message?.includes('relation'));
      setTableReady(reached);
      if (data) setSettings({ ...defaultSettings, ...data });
    } catch (e: any) {
      const msg = e?.message || '';
      setTableReady(!msg.includes('does not exist') && !msg.includes('relation'));
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 1, ...settings }, { onConflict: 'id' });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const field = (key: keyof SiteSettings, label: string, icon: React.ReactNode, type = 'text', placeholder = '') => (
    <div className="space-y-1">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input type={type} value={settings[key]} placeholder={placeholder}
          onChange={e => setSettings({ ...settings, [key]: e.target.value })}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm" />
      </div>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-2xl font-serif font-bold text-soft-black">Paramètres du Site</h3>
        <p className="text-gray-500 text-sm mt-1">Informations générales de la mosquée affichées sur le site.</p>
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> Paramètres sauvegardés avec succès.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-medium text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" /> Erreur lors de la sauvegarde. Vérifiez la table `site_settings`.
        </div>
      )}

      {/* Mosque Identity */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-5">
        <h4 className="font-serif font-bold text-lg text-soft-black border-b border-gray-100 pb-4">🕌 Identité de la Mosquée</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {field('mosque_name', 'Nom de la mosquée', <Globe className="w-4 h-4" />, 'text', 'Mosquée Attawheed')}
          {field('founding_year', 'Année de fondation', <Globe className="w-4 h-4" />, 'number', '2010')}
          {field('city', 'Ville', <MapPin className="w-4 h-4" />, 'text', 'Pétion-Ville')}
          {field('country', 'Pays', <Globe className="w-4 h-4" />, 'text', 'Haïti')}
        </div>
        {field('address', 'Adresse complète', <MapPin className="w-4 h-4" />, 'text', '123 Rue Islam, Pétion-Ville, Haïti')}
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Description / À propos</label>
          <textarea rows={4} value={settings.about_text}
            onChange={e => setSettings({ ...settings, about_text: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm resize-none" />
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-5">
        <h4 className="font-serif font-bold text-lg text-soft-black border-b border-gray-100 pb-4">📞 Coordonnées</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {field('phone', 'Téléphone', <Phone className="w-4 h-4" />, 'tel', '+509 XXXX XXXX')}
          {field('whatsapp', 'WhatsApp', <Phone className="w-4 h-4" />, 'tel', '+50912345678')}
          {field('email', 'Email de contact', <Mail className="w-4 h-4" />, 'email', 'contact@attawheed.com')}
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-5">
        <h4 className="font-serif font-bold text-lg text-soft-black border-b border-gray-100 pb-4">🌐 Réseaux Sociaux</h4>
        <div className="space-y-4">
          {field('facebook_url', 'Facebook', <Facebook className="w-4 h-4" />, 'url', 'https://facebook.com/attawheed')}
          {field('instagram_url', 'Instagram', <Instagram className="w-4 h-4" />, 'url', 'https://instagram.com/attawheed')}
          {field('youtube_url', 'YouTube', <Youtube className="w-4 h-4" />, 'url', 'https://youtube.com/@attawheed')}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className={cn('flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg',
            saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-xl hover:scale-[1.02]')}>
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Sauvegarder les Paramètres
        </button>
      </div>

      {tableReady === false && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm">
          <p className="font-bold text-amber-800 mb-1">⚠️ Table Supabase requise</p>
          <p className="text-amber-700 font-mono text-xs break-all">
            CREATE TABLE site_settings (id INT PRIMARY KEY DEFAULT 1, mosque_name TEXT, city TEXT, country TEXT, address TEXT, phone TEXT, email TEXT, whatsapp TEXT, facebook_url TEXT, instagram_url TEXT, youtube_url TEXT, about_text TEXT, founding_year TEXT);
          </p>
        </div>
      )}
      {tableReady === true && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-medium text-emerald-700">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Table <span className="font-mono font-bold mx-1">site_settings</span> connectée et opérationnelle.
        </div>
      )}
    </div>
  );
};

export default SettingsSection;
