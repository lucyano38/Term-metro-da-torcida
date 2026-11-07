import React from 'react';
import { ShieldCheck, Flame, Trophy, BarChart2 } from 'lucide-react';
import { Club } from '../types';

interface HeroBannerProps {
  totalVotos: number;
  liderClub?: Club;
  liderVotos: number;
  liderPorcentagem: number;
  isLiveFirebase: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  totalVotos,
  liderClub,
  liderVotos,
  liderPorcentagem,
  isLiveFirebase,
}) => {
  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-b border-white/10">
      {/* Radial Gradient Esmeralda Sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/25 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Ticker de Censo */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Censo Oficial das Torcidas 2026</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-normal">1 Voto Único por CPF</span>
        </div>

        {/* Headline esportiva de Alto Impacto - Sportstech / Vercel */}
        <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase max-w-5xl mx-auto leading-tight">
          QUAL É A MAIOR E MAIS{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            APAIXONADA TORCIDA
          </span>{' '}
          DO BRASIL?
        </h1>

        <p className="mt-5 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
          Sem votos repetidos, sem robôs manipulando enquetes. No{' '}
          <strong className="text-emerald-400 font-bold">Termômetro da Torcida</strong>, cada torcedor tem
          direito a apenas <strong className="text-white">1 voto registrado por CPF</strong> com validação
          matemática e apuração oficial ao vivo.
        </p>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#votacao"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-sans font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-current text-white" />
            <span>Registrar Meu Voto Agora</span>
          </a>

          <a
            href="#placar"
            className="px-7 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 text-slate-200 font-sans font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Ver Placar Parcial</span>
          </a>
        </div>

        {/* Métricas e Estatísticas Principais - Cards Glassmorphism */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-lg">
            <p className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Total de Votos
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-black text-emerald-400 mt-1 tabular-nums">
              {totalVotos.toLocaleString('pt-BR')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Torcedores auditados</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-amber-500/40 transition-all duration-300 shadow-lg">
            <p className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Líder Nacional
            </p>
            <p className="font-sans text-2xl sm:text-3xl font-black text-white mt-1 truncate">
              {liderClub ? `${liderClub.escudoEmoji} ${liderClub.nome}` : 'Aguardando votos...'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {liderClub ? `${liderPorcentagem.toFixed(1)}% (${liderVotos} votos)` : 'Seja o primeiro a votar'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-lg">
            <p className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Segurança
            </p>
            <p className="font-sans text-lg sm:text-xl font-black text-emerald-300 mt-1 uppercase">
              Trava por CPF
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Validação algorítmica</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-teal-500/40 transition-all duration-300 shadow-lg">
            <p className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-teal-400" />
              Transparência
            </p>
            <p className="font-sans text-lg sm:text-xl font-black text-teal-300 mt-1 uppercase">
              100% Auditado
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Censo Eleitoral Oficial</p>
          </div>
        </div>
      </div>
    </section>
  );
};
