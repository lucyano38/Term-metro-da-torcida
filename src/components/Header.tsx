import React from 'react';
import { Flame, ShieldCheck, Newspaper, Lock, Database, Code, Trophy } from 'lucide-react';

interface HeaderProps {
  isLiveFirebase: boolean;
  onOpenAdmin: () => void;
  onOpenFirebaseConfig: () => void;
  onOpenExportHtml: () => void;
  totalVotos: number;
}

export const Header: React.FC<HeaderProps> = ({
  isLiveFirebase,
  onOpenAdmin,
  onOpenFirebaseConfig,
  onOpenExportHtml,
  totalVotos,
}) => {
  return (
    <>
      {/* Barra superior de transmissão ao vivo - Estilo Scoreboard Ticker */}
      <div className="bg-slate-950/90 border-b border-white/5 py-2 px-4 text-xs font-mono text-emerald-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider text-[10px] border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Ao Vivo
            </span>
            <span className="text-slate-300 truncate text-[11px] sm:text-xs font-sans">
              Censo Oficial do Futebol Brasileiro • {totalVotos.toLocaleString('pt-BR')} torcedores já votaram com validação única por CPF
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Votação Segura & Auditada</span>
            </span>

            <button
              onClick={onOpenExportHtml}
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-emerald-400 text-[11px] font-medium transition cursor-pointer"
              title="Obter arquivo HTML único standalone com CDN"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Código HTML Único</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 text-[11px] font-mono transition cursor-pointer"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Área Admin (lucyano.pci@gmail.com)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cabeçalho Principal Glassmorphism */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              ⚽
            </div>
            <div>
              <span className="font-sans font-black text-xl sm:text-2xl tracking-tight text-white uppercase flex items-center gap-1.5 leading-none">
                Termômetro <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">da Torcida</span>
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono tracking-tight mt-1">
                termometrodatorcida.com.br • Censo Oficial 2026
              </p>
            </div>
          </a>

          {/* Navegação Rápida Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-sans font-bold uppercase tracking-wider text-slate-300">
            <a href="#votacao" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>Votar Agora</span>
            </a>
            <a href="#placar" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Placar Parcial</span>
            </a>
            <a href="#blog" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Newspaper className="w-4 h-4 text-emerald-400" />
              <span>Blog de Notícias</span>
            </a>
            <button
              onClick={onOpenExportHtml}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Baixar HTML Único</span>
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
              title="Acesso exclusivo: lucyano.pci@gmail.com"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin (Lucyano)</span>
            </button>
          </nav>

          {/* Botões Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenExportHtml}
              className="p-2 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 text-xs"
              title="HTML Standalone"
            >
              <Code className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
