import React, { useState } from 'react';
import { X, Calendar, User, Share2, Check, Tag } from 'lucide-react';
import { BlogPost } from '../types';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/10 backdrop-blur-xl rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition border border-white/10 cursor-pointer"
          title="Fechar matéria"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Categoria */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider font-mono">
              {post.categoria}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              termometrodatorcida.com.br
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
            {post.titulo}
          </h1>

          {/* Subtítulo / Linha Fina */}
          <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed border-l-2 border-emerald-500 pl-3">
            {post.subtitulo}
          </p>

          {/* Metadados: Autor e Data */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" />
                <span>{post.autor || 'Redação Termômetro da Torcida'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{post.dataLegivel || 'Publicado recentemente'}</span>
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/5 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>
          </div>

          {/* Foto de Capa em Alta Resolução */}
          <div className="rounded-xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner">
            <img
              src={post.imagemUrl || '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg'}
              alt={post.titulo}
              className="w-full h-auto max-h-[440px] object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg';
              }}
            />
          </div>

          {/* Conteúdo Completo do Artigo */}
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-4 whitespace-pre-line pt-2">
            {post.conteudo}
          </div>

          {/* Rodapé do Modal */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Notícia Oficial • Termômetro da Torcida
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Fechar Leitura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
