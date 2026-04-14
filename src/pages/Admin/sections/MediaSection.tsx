import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon, Upload, Trash2, Search, Copy, CheckCircle2,
  AlertCircle, Video, File, Camera, Plus, X, Edit2, Eye, EyeOff,
  ChevronLeft, Images, GripVertical
} from 'lucide-react';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'other';
  size: number;
  uploaded_at: string;
}

interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  visible: boolean;
  display_order: number;
  created_at: string;
  photos?: GalleryPhoto[];
  photo_count?: number;
  cover_url?: string;
}

interface GalleryPhoto {
  id: string;
  album_id: string;
  url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

const GALLERY_CATEGORIES = ['Mosquée', 'Ramadan', 'Éducation', 'Événements', 'Social', 'Communauté', 'Autre'];

// ─── Album Create/Edit Modal ────────────────────────────────────────────────
interface AlbumModalProps {
  album?: GalleryAlbum | null;
  onClose: () => void;
  onSaved: () => void;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ album, onClose, onSaved }) => {
  const [title, setTitle] = useState(album?.title || '');
  const [category, setCategory] = useState(album?.category || GALLERY_CATEGORIES[0]);
  const [visible, setVisible] = useState(album?.visible ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) { setError('Le titre est requis.'); return; }
    setSaving(true);
    setError('');
    try {
      if (album) {
        const { error: e } = await supabase.from('gallery_albums').update({
          title: title.trim(), category, visible,
        }).eq('id', album.id);
        if (e) throw e;
      } else {
        const { data: maxData } = await supabase.from('gallery_albums')
          .select('display_order').order('display_order', { ascending: false }).limit(1);
        const nextOrder = (maxData?.[0]?.display_order || 0) + 1;
        const { error: e } = await supabase.from('gallery_albums').insert({
          title: title.trim(), category, visible, display_order: nextOrder,
          created_at: new Date().toISOString(),
        });
        if (e) throw e;
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-islamic-green p-6 text-white relative">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-islamic-gold" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold">
                  {album ? 'Modifier l\'album' : 'Nouvel Album Photo'}
                </h2>
                <p className="text-white/70 text-xs">Thème de la galerie</p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Titre de l'album</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Iftar Communautaire 2026"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black placeholder-gray-400 focus:border-islamic-green focus:outline-none transition-all text-sm" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-soft-black focus:border-islamic-green focus:outline-none transition-all text-sm">
              {GALLERY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {visible ? <Eye className="w-5 h-5 text-islamic-green" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
              <div>
                <p className="text-sm font-bold text-soft-black">{visible ? 'Visible' : 'Masqué'}</p>
                <p className="text-xs text-gray-400">{visible ? 'Apparaîtra sur la page publique' : 'Ne sera pas affiché publiquement'}</p>
              </div>
            </div>
            <button onClick={() => setVisible(!visible)}
              className={cn('w-12 h-7 rounded-full transition-all relative', visible ? 'bg-islamic-green' : 'bg-gray-300')}>
              <div className={cn('w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm', visible ? 'right-1' : 'left-1')} />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm">
              Annuler
            </button>
            <button onClick={handleSave} disabled={saving || !title.trim()}
              className={cn('flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
                saving || !title.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-lg')}>
              {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><CheckCircle2 className="w-4 h-4" />{album ? 'Enregistrer' : 'Créer l\'album'}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Album Detail View (photos management) ─────────────────────────────────
interface AlbumDetailProps {
  album: GalleryAlbum;
  mediaFiles: MediaFile[];
  onBack: () => void;
  onRefresh: () => void;
}

const AlbumDetail: React.FC<AlbumDetailProps> = ({ album, mediaFiles, onBack, onRefresh }) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageFiles = mediaFiles.filter(f => f.type === 'image');

  useEffect(() => { fetchPhotos(); }, [album.id]);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery_photos')
      .select('*').eq('album_id', album.id).order('display_order', { ascending: true });
    setPhotos(data || []);
    setLoading(false);
  };

  // Upload multiple files at once
  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    setUploading(true);
    let successCount = 0;

    // Get max display_order
    const maxOrder = photos.length > 0 ? Math.max(...photos.map(p => p.display_order)) : 0;

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Upload ${i + 1}/${selectedFiles.length}: ${file.name}`);
        const fileName = `gallery/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage
          .from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) continue;
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);

        // Insert into gallery_photos
        await supabase.from('gallery_photos').insert({
          album_id: album.id, url: urlData.publicUrl,
          display_order: maxOrder + i + 1,
          created_at: new Date().toISOString(),
        });

        // Also save to media_files for general library
        await supabase.from('media_files').insert({
          name: file.name, url: urlData.publicUrl, type: 'image',
          size: file.size, uploaded_at: new Date().toISOString(),
        });
        successCount++;
      }
      setStatusMsg({ type: 'ok', msg: `${successCount} photo(s) ajoutée(s) à l'album !` });
      fetchPhotos();
      onRefresh();
    } catch {
      setStatusMsg({ type: 'err', msg: 'Erreur lors de l\'upload.' });
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  // Add photo from library
  const handleAddFromLibrary = async (mediaFile: MediaFile) => {
    // Check if already in this album
    if (photos.some(p => p.url === mediaFile.url)) {
      setStatusMsg({ type: 'err', msg: 'Cette image est déjà dans l\'album.' });
      setTimeout(() => setStatusMsg(null), 3000);
      return;
    }
    const maxOrder = photos.length > 0 ? Math.max(...photos.map(p => p.display_order)) : 0;
    await supabase.from('gallery_photos').insert({
      album_id: album.id, url: mediaFile.url,
      display_order: maxOrder + 1,
      created_at: new Date().toISOString(),
    });
    setStatusMsg({ type: 'ok', msg: 'Photo ajoutée depuis la bibliothèque !' });
    fetchPhotos();
    onRefresh();
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Delete photo
  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    await supabase.from('gallery_photos').delete().eq('id', photo.id);
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
    setDeleteConfirm(null);
    onRefresh();
  };

  // Update caption
  const handleCaptionChange = async (photo: GalleryPhoto, caption: string) => {
    await supabase.from('gallery_photos').update({ caption: caption || null }).eq('id', photo.id);
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, caption } : p));
  };

  return (
    <div className="space-y-6">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <button onClick={onBack}
          className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-grow">
          <h3 className="text-2xl font-serif font-bold text-soft-black">{album.title}</h3>
          <p className="text-gray-500 text-sm">{album.category} — {photos.length} photo(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLibrary(!showLibrary)}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all',
              showLibrary ? 'bg-islamic-gold text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-islamic-gold')}>
            <Images className="w-4 h-4" />
            Bibliothèque
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleMultiUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
              uploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-lg hover:scale-[1.02]')}>
            {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Upload className="w-4 h-4" />Ajouter des photos</>}
          </button>
        </div>
      </div>

      {/* Upload progress */}
      {uploading && uploadProgress && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-blue-700">{uploadProgress}</p>
        </div>
      )}

      {/* Status */}
      {statusMsg && (
        <div className={cn('flex items-center gap-3 p-4 rounded-2xl text-sm font-medium',
          statusMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
          {statusMsg.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {statusMsg.msg}
        </div>
      )}

      {/* Library picker (expanded) */}
      {showLibrary && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">Sélectionner depuis la bibliothèque</p>
            <button onClick={() => setShowLibrary(false)} className="text-xs text-gray-400 hover:text-gray-600 font-medium">Fermer</button>
          </div>
          {imageFiles.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">Aucune image dans la bibliothèque.</p>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {imageFiles.map(f => {
                const alreadyAdded = photos.some(p => p.url === f.url);
                return (
                  <button key={f.id} onClick={() => !alreadyAdded && handleAddFromLibrary(f)}
                    className={cn('relative aspect-square rounded-xl overflow-hidden border-2 transition-all',
                      alreadyAdded ? 'border-gray-200 opacity-40 cursor-not-allowed' : 'border-transparent hover:border-islamic-green cursor-pointer')}>
                    <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                    {alreadyAdded && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-islamic-green" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-[2rem] p-8 text-center hover:border-islamic-green hover:bg-islamic-green/5 transition-all cursor-pointer group">
        <Upload className="w-8 h-8 text-gray-300 group-hover:text-islamic-green mx-auto mb-2 transition-colors" />
        <p className="text-gray-400 font-medium text-sm">
          Glissez-déposez des images ici ou <span className="text-islamic-green font-bold">cliquez pour parcourir</span>
        </p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez plusieurs images à la fois — PNG, JPG, WebP</p>
      </div>

      {/* Photos grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center space-y-3">
          <ImageIcon className="w-16 h-16 text-gray-200 mx-auto" />
          <p className="text-gray-400 font-medium">Aucune photo dans cet album.</p>
          <p className="text-gray-300 text-sm">Uploadez ou sélectionnez des images depuis la bibliothèque.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, idx) => (
            <div key={photo.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="relative aspect-square bg-gray-50">
                <img src={photo.url} alt={photo.caption || `Photo ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <div className="absolute top-2 left-2 bg-islamic-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Couverture
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {deleteConfirm === photo.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleDeletePhoto(photo)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">Supprimer</button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 bg-white text-xs font-bold rounded-lg">Annuler</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(photo.id)}
                      className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 transition-all">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  value={photo.caption || ''}
                  onChange={(e) => setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, caption: e.target.value } : p))}
                  onBlur={(e) => handleCaptionChange(photo, e.target.value)}
                  placeholder="Légende (optionnel)"
                  className="w-full text-xs text-gray-600 placeholder-gray-300 bg-transparent focus:outline-none border-b border-transparent focus:border-gray-200 pb-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Media Section ─────────────────────────────────────────────────────
const MediaSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'files' | 'gallery'>('files');

  // ── FILES state ──
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Tous' | 'image' | 'video'>('Tous');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── GALLERY state ──
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryFilter, setGalleryFilter] = useState('Tous');
  const [galleryDeleteConfirm, setGalleryDeleteConfirm] = useState<string | null>(null);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

  useEffect(() => { fetchMedia(); fetchAlbums(); }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('media_files').select('*').order('uploaded_at', { ascending: false });
      setFiles(data || []);
    } catch { setFiles([]); }
    finally { setLoading(false); }
  };

  const fetchAlbums = async () => {
    setGalleryLoading(true);
    try {
      // Fetch albums with their photos
      const { data: albumData } = await supabase.from('gallery_albums')
        .select('*').order('display_order', { ascending: true });
      if (albumData) {
        // Fetch photo counts and cover for each album
        const enriched = await Promise.all(albumData.map(async (a) => {
          const { data: photos } = await supabase.from('gallery_photos')
            .select('url').eq('album_id', a.id).order('display_order', { ascending: true }).limit(1);
          const { count } = await supabase.from('gallery_photos')
            .select('*', { count: 'exact', head: true }).eq('album_id', a.id);
          return {
            ...a,
            photo_count: count || 0,
            cover_url: photos?.[0]?.url || null,
          };
        }));
        setAlbums(enriched);
      }
    } catch { setAlbums([]); }
    finally { setGalleryLoading(false); }
  };

  // ── FILE UPLOAD ──
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    setUploading(true);
    let successCount = 0;
    try {
      for (const file of selectedFiles) {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage
          .from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) continue;
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
        const fileType: MediaFile['type'] = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'other';
        await supabase.from('media_files').insert({
          name: file.name, url: urlData.publicUrl, type: fileType,
          size: file.size, uploaded_at: new Date().toISOString(),
        });
        successCount++;
      }
      setStatusMsg({ type: 'ok', msg: `${successCount} fichier(s) uploadé(s) avec succès !` });
      fetchMedia();
    } catch {
      setStatusMsg({ type: 'err', msg: 'Erreur lors de l\'upload. Vérifiez le bucket Supabase "media".' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    const fileName = file.url.split('/').pop();
    if (fileName) await supabase.storage.from('media').remove([fileName]);
    await supabase.from('media_files').delete().eq('id', file.id);
    setFiles(prev => prev.filter(f => f.id !== file.id));
    setDeleteConfirm(null);
  };

  const handleAlbumDelete = async (album: GalleryAlbum) => {
    // Cascade delete handles photos
    await supabase.from('gallery_albums').delete().eq('id', album.id);
    setAlbums(prev => prev.filter(a => a.id !== album.id));
    setGalleryDeleteConfirm(null);
  };

  const toggleAlbumVisibility = async (album: GalleryAlbum) => {
    const newVisible = !album.visible;
    await supabase.from('gallery_albums').update({ visible: newVisible }).eq('id', album.id);
    setAlbums(prev => prev.map(a => a.id === album.id ? { ...a, visible: newVisible } : a));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Tous' || f.type === filter;
    return matchSearch && matchFilter;
  });

  const filteredAlbums = albums.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(gallerySearch.toLowerCase());
    const matchFilter = galleryFilter === 'Tous' || a.category === galleryFilter;
    return matchSearch && matchFilter;
  });

  const uniqueCategories = ['Tous', ...Array.from(new Set(albums.map(a => a.category)))];

  // ── If viewing album detail ──
  if (selectedAlbum) {
    return (
      <AlbumDetail
        album={selectedAlbum}
        mediaFiles={files}
        onBack={() => { setSelectedAlbum(null); fetchAlbums(); }}
        onRefresh={() => { fetchMedia(); fetchAlbums(); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Album Modal */}
      {showAlbumModal && (
        <AlbumModal
          album={editingAlbum}
          onClose={() => { setShowAlbumModal(false); setEditingAlbum(null); }}
          onSaved={fetchAlbums}
        />
      )}

      {/* Sub-tabs */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
        <button onClick={() => setActiveSubTab('files')}
          className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
            activeSubTab === 'files' ? 'bg-islamic-green text-white shadow-md' : 'text-gray-500 hover:bg-gray-50')}>
          <Upload className="w-4 h-4" />Fichiers Médias
        </button>
        <button onClick={() => setActiveSubTab('gallery')}
          className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
            activeSubTab === 'gallery' ? 'bg-islamic-green text-white shadow-md' : 'text-gray-500 hover:bg-gray-50')}>
          <Camera className="w-4 h-4" />Galerie Photos
          {albums.length > 0 && (
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold',
              activeSubTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-islamic-green/10 text-islamic-green')}>
              {albums.length}
            </span>
          )}
        </button>
      </div>

      {/* ═══════════════ FILES TAB ═══════════════ */}
      {activeSubTab === 'files' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-soft-black">Médiathèque</h3>
              <p className="text-gray-500 text-sm mt-1">{files.length} fichier(s) — Images, vidéos et documents</p>
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className={cn('flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all',
                uploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-islamic-green text-white hover:shadow-lg hover:scale-[1.02]')}>
              {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Upload className="w-5 h-5" /> Uploader des fichiers</>}
            </button>
          </div>

          {statusMsg && (
            <div className={cn('flex items-center gap-3 p-4 rounded-2xl text-sm font-medium', statusMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
              {statusMsg.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}{statusMsg.msg}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Rechercher un fichier..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm focus:border-islamic-green focus:outline-none" />
            </div>
            {(['Tous', 'image', 'video'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn('px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all', filter === f ? 'bg-islamic-green text-white' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-islamic-green')}>
                {f === 'image' ? 'Images' : f === 'video' ? 'Vidéos' : 'Tous'}
              </button>
            ))}
          </div>

          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 text-center hover:border-islamic-green hover:bg-islamic-green/5 transition-all cursor-pointer group">
            <Upload className="w-10 h-10 text-gray-300 group-hover:text-islamic-green mx-auto mb-3 transition-colors" />
            <p className="text-gray-400 font-medium text-sm">Glissez-déposez des fichiers ici ou <span className="text-islamic-green font-bold">cliquez pour parcourir</span></p>
            <p className="text-gray-300 text-xs mt-1">PNG, JPG, GIF, MP4 acceptés</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" /></div>
          ) : filteredFiles.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center space-y-4">
              <ImageIcon className="w-16 h-16 text-gray-200 mx-auto" /><p className="text-gray-400 font-medium">Aucun fichier trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map(file => (
                <div key={file.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                  <div className="relative h-36 bg-gray-50">
                    {file.type === 'image' ? <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      : file.type === 'video' ? <div className="w-full h-full flex items-center justify-center"><Video className="w-10 h-10 text-gray-300" /></div>
                      : <div className="w-full h-full flex items-center justify-center"><File className="w-10 h-10 text-gray-300" /></div>}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => copyUrl(file.url)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform" title="Copier l'URL">
                        {copied === file.url ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                      </button>
                      {deleteConfirm === file.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(file)} className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg">Oui</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-white text-xs font-bold rounded-lg">Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(file.id)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-soft-black truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ GALLERY TAB ═══════════════ */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-soft-black">Galerie Photos</h3>
              <p className="text-gray-500 text-sm mt-1">Créez des albums photo avec plusieurs images par thème</p>
            </div>
            <button onClick={() => { setEditingAlbum(null); setShowAlbumModal(true); }}
              className="flex items-center gap-2 bg-islamic-green text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all">
              <Plus className="w-5 h-5" />Nouvel Album
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Albums', value: albums.length, color: 'bg-purple-100 text-purple-700' },
              { label: 'Visibles', value: albums.filter(a => a.visible).length, color: 'bg-emerald-100 text-emerald-700' },
              { label: 'Total Photos', value: albums.reduce((sum, a) => sum + (a.photo_count || 0), 0), color: 'bg-blue-100 text-blue-700' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-xl', s.color)}>{s.value}</div>
                <p className="text-sm font-bold text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Rechercher un album..." value={gallerySearch} onChange={e => setGallerySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm focus:border-islamic-green focus:outline-none" />
            </div>
            {uniqueCategories.map(cat => (
              <button key={cat} onClick={() => setGalleryFilter(cat)}
                className={cn('px-4 py-2 rounded-xl text-sm font-bold transition-all',
                  galleryFilter === cat ? 'bg-islamic-green text-white' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-islamic-green')}>
                {cat}
              </button>
            ))}
          </div>

          {/* Albums Grid */}
          {galleryLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center space-y-4">
              <Camera className="w-16 h-16 text-gray-200 mx-auto" />
              <p className="text-gray-400 font-medium">Aucun album dans la galerie.</p>
              <button onClick={() => { setEditingAlbum(null); setShowAlbumModal(true); }}
                className="text-islamic-green font-bold text-sm hover:underline">Créer votre premier album →</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map(album => (
                <div key={album.id}
                  className={cn('bg-white rounded-[2rem] overflow-hidden shadow-sm border transition-all group',
                    album.visible ? 'border-gray-100 hover:shadow-md' : 'border-amber-200 opacity-75')}>
                  {/* Cover / click to open */}
                  <div className="relative aspect-[4/3] bg-gray-100 cursor-pointer" onClick={() => setSelectedAlbum(album)}>
                    {album.cover_url ? (
                      <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-200" />
                      </div>
                    )}
                    {/* Photo count badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      {album.photo_count || 0} photo{(album.photo_count || 0) > 1 ? 's' : ''}
                    </div>
                    {!album.visible && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />Masqué
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {album.category}
                    </div>
                  </div>
                  {/* Info + actions */}
                  <div className="p-5 space-y-3">
                    <h4 className="font-serif font-bold text-soft-black text-lg leading-tight cursor-pointer hover:text-islamic-green transition-colors"
                      onClick={() => setSelectedAlbum(album)}>
                      {album.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => setSelectedAlbum(album)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-islamic-green/10 text-islamic-green hover:bg-islamic-green hover:text-white text-xs font-bold rounded-lg transition-all">
                        <Images className="w-3 h-3" />Gérer les photos
                      </button>
                      <button onClick={() => { setEditingAlbum(album); setShowAlbumModal(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-bold rounded-lg transition-all">
                        <Edit2 className="w-3 h-3" />Modifier
                      </button>
                      <button onClick={() => toggleAlbumVisibility(album)}
                        className={cn('flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                          album.visible ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100')}>
                        {album.visible ? <><EyeOff className="w-3 h-3" />Masquer</> : <><Eye className="w-3 h-3" />Afficher</>}
                      </button>
                      {galleryDeleteConfirm === album.id ? (
                        <div className="flex items-center gap-1 ml-auto">
                          <span className="text-xs text-red-600 font-medium">Supprimer ?</span>
                          <button onClick={() => handleAlbumDelete(album)} className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">Oui</button>
                          <button onClick={() => setGalleryDeleteConfirm(null)} className="px-2 py-1 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200">Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setGalleryDeleteConfirm(album.id)}
                          className="ml-auto w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">Comment ça fonctionne</p>
              <p className="text-sm text-blue-700 mt-0.5">
                Créez un album, puis ajoutez-y plusieurs photos. La première photo sert automatiquement de couverture.
                Les albums visibles apparaissent sur la page Médiathèque publique. Les visiteurs peuvent les parcourir dans un diaporama.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
