import React, { useState } from 'react';
import { Trophy, Search, Flame, Sparkles, Filter, ChevronRight, BarChart3 } from 'lucide-react';
import { ClubTally } from '../types';

interface LeaderboardSectionProps {
  tallies: ClubTally[];
  totalVotos: number;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  tallies,
  totalVotos,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'TODOS' | 'SP' | 'RJ' | 'MG' | 'RS' | 'NORDESTE'>('TODOS');

  // Garante de forma estrita que APENAS clubes com pelo menos 1 voto apareçam no placar
  const activeTallies = tallies.filter((item) => item.votos > 0);

  const filteredTallies = activeTallies.filter((item) => {
    const matchesSearch =
      item.club.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.club.sigla.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedRegion === 'TODOS') return true;
    if (selectedRegion === 'NORDESTE') {
      return ['BA', 'CE', 'PE'].includes(item.club.estado);
    }
    return item.club.estado === selectedRegion;
  });

  const lider = activeTallies[0];

  return (
    <section
      id="placar"
      className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between"
    >
      {/* Luz sutil de arquibancada */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Cabeçalho do Placar - Estilo Sportstech / Vercel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-white/10 text-emerald-400 flex items-center justify-center font-sans font-black text-2xl shadow-inner">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-2xl text-white tracking-tight">
                  Termômetro das Torcidas
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Ranking oficial ao vivo • Apenas clubes com votos computados por CPF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Ao Vivo
              </span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {totalVotos.toLocaleString('pt-BR')} {totalVotos === 1 ? 'voto' : 'votos'}
              </span>
            </div>
          </div>
        </div>

        {/* Card de Destaque da Torcida Líder Nacional - Glassmorphism */}
        {lider ? (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-900/60 backdrop-blur-md border border-amber-500/30 flex items-center justify-between gap-4 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-black text-3xl shadow-lg shadow-amber-500/10">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                    1º Lugar Geral
                  </span>
                  <span className="text-slate-600 font-mono text-xs">·</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {lider.club.estado} • {lider.club.sigla}
                  </span>
                </div>
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-white tracking-tight mt-0.5 flex items-center gap-2.5">
                  <span className="text-2xl">{lider.club.escudoEmoji}</span>
                  <span>{lider.club.nome}</span>
                </h3>
              </div>
            </div>

            <div className="text-right relative z-10 shrink-0">
              <span className="font-sans text-3xl sm:text-4xl font-black text-emerald-400 tabular-nums leading-none">
                {lider.porcentagem.toFixed(1)}%
              </span>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {lider.votos.toLocaleString('pt-BR')} {lider.votos === 1 ? 'voto' : 'votos'}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-5 rounded-2xl bg-slate-900/50 border border-dashed border-white/10 text-center">
            <p className="text-slate-300 text-sm font-semibold">
              Nenhum clube pontuou até o momento.
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Vote ao lado e coloque seu clube no topo do ranking nacional!
            </p>
          </div>
        )}

        {/* Barra de Filtros e Busca de Clubes */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar clube com votos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs scrollbar-none">
            {(['TODOS', 'SP', 'RJ', 'MG', 'RS', 'NORDESTE'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black shadow-md shadow-emerald-500/25'
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 border border-white/5'
                }`}
              >
                {reg === 'NORDESTE' ? 'Nordeste' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Classificação dos Clubes com Votos */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredTallies.length === 0 ? (
            <div className="py-14 text-center bg-slate-900/40 border border-dashed border-white/10 rounded-xl">
              <BarChart3 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-semibold">
                Nenhum clube com votos encontrado para este filtro.
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Conforme novos votos forem auditados, eles surgem instantaneamente aqui.
              </p>
            </div>
          ) : (
            filteredTallies.map((item, index) => {
              const posicao = index + 1;
              const badgeBg =
                posicao === 1
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : posicao === 2
                  ? 'bg-slate-200 text-slate-950 font-black'
                  : posicao === 3
                  ? 'bg-amber-600 text-white font-black'
                  : 'bg-slate-800 text-slate-300 font-mono border border-white/10';

              return (
                <div
                  key={item.club.id}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-800/40 border border-white/5 hover:border-emerald-500/40 backdrop-blur-sm transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-3 text-xs mb-2">
                    <div className="flex items-center gap-3 font-bold min-w-0">
                      {/* Posição */}
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${badgeBg}`}
                      >
                        {posicao}
                      </span>

                      {/* Escudo e Nome */}
                      <span className="text-lg shrink-0">{item.club.escudoEmoji}</span>
                      <span className="text-white text-sm font-sans font-bold uppercase tracking-tight truncate group-hover:text-emerald-300 transition-colors">
                        {item.club.nome}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 hidden sm:inline">
                        {item.club.sigla} · {item.club.estado}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono shrink-0">
                      <span className="text-slate-400 text-xs tabular-nums">
                        {item.votos.toLocaleString('pt-BR')} {item.votos === 1 ? 'voto' : 'votos'}
                      </span>
                      <span className="text-emerald-400 font-bold text-sm font-sans tabular-nums">
                        {item.porcentagem.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso Sportstech */}
                  <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(item.porcentagem, 1.5)}%`,
                        backgroundColor: item.club.corPrimaria || '#10b981',
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Rodapé da Classificação */}
      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Mostrando apenas clubes com votos válidos</span>
        <span className="font-mono text-emerald-400 font-semibold">1 CPF = 1 Voto Oficial</span>
      </div>
    </section>
  );
};
