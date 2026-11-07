import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, Search, PlusCircle, Clock, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
  onSelectPost: (post: BlogPost) => void;
  onOpenAdmin: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  isLoading = false,
  onSelectPost,
  onOpenAdmin,
}) => {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'Todas',
    'Brasileirão',
    'Libertadores',
    'Mercado da Bola',
    'Torcidas & Cultura',
    'Copa do Brasil',
    'Seleção Brasileira',
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'Todas' ||
      post.categoria.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subtitulo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1);

  return (
    <section id="blog" className="pt-10 border-t border-white/10">
      {/* Cabeçalho da Seção - Sportstech / Vercel Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Boletim Esportivo & Bastidores
            </span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-white tracking-tight">
            Notícias do Futebol Brasileiro
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
            Cobertura esportiva atualizada com análises táticas, mercado da bola e o termômetro das maiores torcidas do país.
          </p>
        </div>

        <button
          onClick={onOpenAdmin}
          className="self-start md:self-end px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-110 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Nova Matéria (lucyano.pci@gmail.com)</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca de Notícias */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        {/* Categorias Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 font-black'
                  : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input de Busca Dark Mode */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar notícias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Skeleton Loading State (substitui piscagem durante o fetch) */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse" aria-label="Carregando notícias...">
          {/* Featured Skeleton Card */}
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 shadow-xl">
            <div className="lg:col-span-7 h-64 sm:h-80 lg:h-96 bg-slate-800/60" />
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-slate-800 rounded" />
                  <div className="h-4 w-4 bg-slate-800 rounded-full" />
                  <div className="h-4 w-20 bg-slate-800 rounded" />
                </div>
                <div className="h-8 w-11/12 bg-slate-800 rounded-lg" />
                <div className="h-8 w-3/4 bg-slate-800 rounded-lg" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-full bg-slate-800/70 rounded" />
                  <div className="h-3.5 w-5/6 bg-slate-800/70 rounded" />
                  <div className="h-3.5 w-4/6 bg-slate-800/70 rounded" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="h-4 w-32 bg-slate-800 rounded" />
                <div className="h-4 w-24 bg-slate-800 rounded" />
              </div>
            </div>
          </div>

          {/* Grid Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col"
              >
                <div className="h-48 w-full bg-slate-800/60" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-20 bg-slate-800 rounded" />
                      <div className="h-3.5 w-16 bg-slate-800/60 rounded" />
                    </div>
                    <div className="h-5 w-10/12 bg-slate-800 rounded" />
                    <div className="h-5 w-3/4 bg-slate-800 rounded" />
                    <div className="h-3.5 w-full bg-slate-800/70 rounded pt-1" />
                    <div className="h-3.5 w-4/5 bg-slate-800/70 rounded" />
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="h-3.5 w-20 bg-slate-800 rounded" />
                    <div className="h-3.5 w-16 bg-slate-800 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-2xl backdrop-blur-md">
          <Newspaper className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-300 text-sm font-semibold">
            Nenhuma matéria encontrada com os termos selecionados.
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Utilize o painel administrativo para publicar novidades no blog.
          </p>
        </div>
      ) : (
        <div className="space-y-6 transition-opacity duration-300">
          {/* Matéria de Destaque Principal - Glassmorphism & Hover */}
          {featuredPost && (
            <article
              onClick={() => onSelectPost(featuredPost)}
              className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group cursor-pointer shadow-xl"
            >
              <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-slate-950">
                <img
                  src={featuredPost.imagemUrl || '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg'}
                  alt={featuredPost.titulo}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">
                      {featuredPost.categoria}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {featuredPost.dataLegivel || 'Publicado hoje'}
                    </span>
                  </div>

                  <h3 className="font-sans font-black text-2xl sm:text-3xl text-white tracking-tight group-hover:text-emerald-300 transition-colors leading-tight">
                    {featuredPost.titulo}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed font-normal">
                    {featuredPost.subtitulo}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {featuredPost.autor || 'Redação Termômetro'}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5 transition-colors uppercase tracking-wider font-sans">
                    Ler Matéria Completa <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* Grid de Notícias Secundárias (3 colunas) */}
          {secondaryPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col group cursor-pointer shadow-lg"
                >
                  {/* Imagem de Capa com Fallback Seguro */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={post.imagemUrl || '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg'}
                      alt={post.titulo}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Detalhes da Matéria */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-2">
                        <span className="text-emerald-400 font-bold uppercase tracking-wider">
                          {post.categoria}
                        </span>
                        <span>·</span>
                        <span>{post.dataLegivel || 'Recente'}</span>
                      </div>

                      <h3 className="font-sans font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                        {post.titulo}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {post.subtitulo}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {post.autor || 'Redação'}
                      </span>
                      <span className="font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 transition-colors">
                        Ler <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
