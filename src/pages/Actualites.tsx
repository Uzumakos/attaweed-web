import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ArrowLeft, Search, Tag } from 'lucide-react';
import { supabase } from '../supabase';
import { cn } from '../lib/utils';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  published_at: string;
  status: string;
}

const categoryColors: Record<string, string> = {
  'Actualité':   'bg-blue-100 text-blue-700',
  'Événement':   'bg-purple-100 text-purple-700',
  'Annonce':     'bg-amber-100 text-amber-700',
  'Ramadan':     'bg-emerald-100 text-emerald-700',
};

// ─────────────────────────────────────────
// Article Detail View
// ─────────────────────────────────────────
const ArticleDetail: React.FC<{ slug: string }> = ({ slug }) => {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Try by slug first, then by id
        let { data } = await supabase
          .from('news_articles')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'Publié')
          .single();

        if (!data) {
          const res = await supabase
            .from('news_articles')
            .select('*')
            .eq('id', slug)
            .single();
          data = res.data;
        }

        setArticle(data || null);

        if (data) {
          const { data: rel } = await supabase
            .from('news_articles')
            .select('*')
            .eq('status', 'Publié')
            .eq('category', data.category)
            .neq('id', data.id)
            .limit(3);
          setRelated(rel || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!article) return (
    <div className="container mx-auto px-4 py-24 text-center space-y-6">
      <p className="text-6xl">🕌</p>
      <h1 className="text-3xl font-serif font-bold text-soft-black">Article introuvable</h1>
      <p className="text-gray-500">Cet article n'existe pas ou n'est plus disponible.</p>
      <button onClick={() => navigate('/actualites')} className="bg-islamic-green text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all">
        ← Retour aux actualités
      </button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden bg-gray-100">
        {article.image_url ? (
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-islamic-dark to-islamic-green flex items-center justify-center">
            <span className="text-8xl opacity-20">🕌</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <span className={cn('inline-block text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4', categoryColors[article.category] || 'bg-gray-100 text-gray-600')}>
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight max-w-4xl">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-white/70 mt-4 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/actualites" className="inline-flex items-center gap-2 text-gray-400 hover:text-islamic-green font-medium text-sm mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </Link>

        {article.excerpt && (
          <p className="text-xl text-gray-600 font-serif italic leading-relaxed mb-8 border-l-4 border-islamic-green pl-6">
            {article.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {article.content || <p className="text-gray-400 italic">Contenu non disponible.</p>}
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-serif font-bold text-soft-black mb-8">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(r => (
                <motion.article key={r.id} whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    {r.image_url
                      ? <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl">🕌</div>}
                  </div>
                  <div className="p-5 space-y-2">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', categoryColors[r.category] || 'bg-gray-100')}>{r.category}</span>
                    <h3 className="font-bold text-soft-black text-sm leading-snug">{r.title}</h3>
                    <Link to={`/actualites/${r.slug || r.id}`} className="text-islamic-green text-xs font-bold inline-flex items-center gap-1">
                      Lire <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Full News Listing Page
// ─────────────────────────────────────────
const NewsListing: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const categories = ['Tous', 'Actualité', 'Événement', 'Annonce', 'Ramadan'];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('news_articles')
          .select('*')
          .eq('status', 'Publié')
          .order('published_at', { ascending: false });
        setArticles(data || []);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tous' || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-islamic-dark arabesque-pattern-dark py-24">
        <div className="container mx-auto px-4 text-center space-y-4">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-islamic-gold font-bold uppercase tracking-[0.3em] text-sm">
            Mosquée Attawheed
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white">
            Actualités & Événements
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/60 max-w-xl mx-auto">
            Restez informés des dernières nouvelles, programmes et activités de votre mosquée.
          </motion.p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn('px-4 py-2 rounded-full text-sm font-bold transition-all',
                  activeCategory === cat
                    ? 'bg-islamic-green text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-islamic-green w-52 transition-all" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-3xl overflow-hidden border border-gray-100">
                <div className="h-48 bg-gray-100 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse" />
                  <div className="h-5 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-6xl">🔍</p>
            <h3 className="text-2xl font-serif font-bold text-soft-black">Aucun article trouvé</h3>
            <p className="text-gray-500">Essayez une autre catégorie ou un autre terme de recherche.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="group grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all">
                <div className="relative h-72 md:h-auto overflow-hidden bg-gray-100">
                  {featured.image_url
                    ? <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    : <div className="w-full h-full bg-gradient-to-br from-islamic-green/10 to-islamic-green/5 flex items-center justify-center text-7xl">🕌</div>}
                  <div className={cn('absolute top-6 left-6 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider', categoryColors[featured.category] || 'bg-gray-100')}>
                    {featured.category}
                  </div>
                </div>
                <div className="bg-white p-10 flex flex-col justify-center space-y-5">
                  <span className="text-xs font-bold text-islamic-gold uppercase tracking-widest">À la une</span>
                  <h2 className="text-3xl font-serif font-bold text-soft-black group-hover:text-islamic-green transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {featured.published_at ? new Date(featured.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </div>
                  <Link to={`/actualites/${featured.slug || featured.id}`}
                    className="inline-flex items-center gap-2 bg-islamic-green text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all w-fit">
                    Lire l'article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((article, idx) => (
                  <motion.article key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      {article.image_url
                        ? <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl">🕌</div>}
                      <div className={cn('absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider', categoryColors[article.category] || 'bg-gray-100')}>
                        {article.category}
                      </div>
                    </div>
                    <div className="p-7 space-y-3">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                      </div>
                      <h3 className="text-xl font-serif font-bold group-hover:text-islamic-green transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt}</p>
                      <Link to={`/actualites/${article.slug || article.id}`}
                        className="inline-flex items-center gap-1.5 text-islamic-green font-bold text-sm pt-1 group/btn">
                        Lire la suite <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Main export — routes /actualites and /actualites/:slug
// ─────────────────────────────────────────
const Actualites: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <ArticleDetail slug={slug} /> : <NewsListing />;
};

export default Actualites;
