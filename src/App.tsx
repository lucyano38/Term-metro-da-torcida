import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { VotingSection } from './components/VotingSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { BlogSection } from './components/BlogSection';
import { ArticleModal } from './components/ArticleModal';
import { AdminModal } from './components/AdminModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { ExportHtmlModal } from './components/ExportHtmlModal';
import { BlogPost, ClubTally, Vote } from './types';
import { BRAZILIAN_CLUBS, getClubById } from './data/clubs';
import {
  subscribeToPosts,
  subscribeToVotes,
  initializeFirebaseService,
  getStoredFirebaseConfig,
} from './services/firebase';

import { INITIAL_POSTS, INITIAL_VOTES } from './data/initialData';

export default function App() {
  const [votes, setVotes] = useState<Vote[]>(INITIAL_VOTES);
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState(false);
  const [isExportHtmlOpen, setIsExportHtmlOpen] = useState(false);
  const [isLiveFirebase, setIsLiveFirebase] = useState(false);

  // Inicializa e sincroniza dados em tempo real
  useEffect(() => {
    const { isLive } = initializeFirebaseService();
    setIsLiveFirebase(isLive);

    const unsubVotes = subscribeToVotes((v) => {
      if (v && v.length > 0) {
        setVotes(v);
      }
    });

    const unsubPosts = subscribeToPosts((p) => {
      if (p && p.length > 0) {
        setPosts(p);
      }
      // Transição suave para desativar o skeleton após carregar
      setIsLoadingPosts(false);
    });

    return () => {
      unsubVotes();
      unsubPosts();
    };
  }, []);

  const handleConfigUpdated = () => {
    const { isLive } = initializeFirebaseService();
    setIsLiveFirebase(isLive);
  };

  // Cálculo de placar e porcentagens: EXIBE APENAS TIMES COM VOTOS > 0
  const tallies: ClubTally[] = useMemo(() => {
    const total = votes.length;
    const countMap: Record<string, number> = {};

    BRAZILIAN_CLUBS.forEach((c) => {
      countMap[c.id] = 0;
    });

    votes.forEach((v) => {
      const clubId = (v.time || '').toLowerCase();
      if (countMap[clubId] !== undefined) {
        countMap[clubId]++;
      } else {
        countMap[clubId] = (countMap[clubId] || 0) + 1;
      }
    });

    const result = BRAZILIAN_CLUBS.map((club) => {
      const count = countMap[club.id] || 0;
      const pct = total > 0 ? (count / total) * 100 : 0;
      return {
        club,
        votos: count,
        porcentagem: pct,
      };
    });

    // Filtra ESTRITAMENTE apenas os clubes que têm votos (votos > 0) e ordena do maior para o menor
    return result
      .filter((item) => item.votos > 0)
      .sort((a, b) => b.votos - a.votos);
  }, [votes]);

  const liderTally = tallies[0];

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-black font-sans">
      {/* Header com Transmissão ao Vivo e Ações Rápidas */}
      <Header
        isLiveFirebase={isLiveFirebase}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFirebaseConfig={() => setIsFirebaseConfigOpen(true)}
        onOpenExportHtml={() => setIsExportHtmlOpen(true)}
        totalVotos={votes.length}
      />

      {/* Hero Banner Esportivo */}
      <HeroBanner
        totalVotos={votes.length}
        liderClub={liderTally?.club}
        liderVotos={liderTally?.votos || 0}
        liderPorcentagem={liderTally?.porcentagem || 0}
        isLiveFirebase={isLiveFirebase}
      />

      {/* Seção Principal do Portal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex-1 w-full space-y-16">
        {/* Grid com Formulário de Votação Antifraude e Placar das Torcidas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <VotingSection
              recentVotes={votes}
              onVoteCast={() => {
                // Sincronização automática via listener
              }}
            />
          </div>

          <div className="lg:col-span-7">
            <LeaderboardSection tallies={tallies} totalVotos={votes.length} />
          </div>
        </div>

        {/* Blog de Notícias e Bastidores (Coleção posts_esportes) com Skeleton Loading */}
        <BlogSection
          posts={posts}
          isLoading={isLoadingPosts}
          onSelectPost={(post) => setSelectedPost(post)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Rodapé Oficial Estilo Sportstech / Vercel */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-10 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-sans font-black text-base text-white tracking-tight uppercase">
                Termômetro <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">da Torcida</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                Censo Oficial 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              termometrodatorcida.com.br • O portal oficial do censo esportivo das torcidas brasileiras
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Sistema oficial com trava de segurança antifraude e validação de 1 voto único por CPF.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-xs">
            <button
              onClick={() => setIsExportHtmlOpen(true)}
              className="hover:text-emerald-400 transition underline underline-offset-4 cursor-pointer"
            >
              Código HTML Único (Standalone)
            </button>
            <span>•</span>
            <span className="text-slate-500">
              © {new Date().getFullYear()} Termômetro da Torcida. Todos os direitos reservados.
            </span>
            <span>•</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-emerald-400 transition font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>🔒 Admin (lucyano.pci@gmail.com)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modais do Sistema */}
      <ArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        posts={posts}
        votes={votes}
        onPostCreated={() => {}}
        onSelectPost={(post) => setSelectedPost(post)}
      />

      <FirebaseConfigModal
        isOpen={isFirebaseConfigOpen}
        onClose={() => setIsFirebaseConfigOpen(false)}
        onConfigUpdated={handleConfigUpdated}
      />

      <ExportHtmlModal
        isOpen={isExportHtmlOpen}
        onClose={() => setIsExportHtmlOpen(false)}
      />
    </div>
  );
}
