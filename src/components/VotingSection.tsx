import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Lock, UserCheck, Flame, Loader2 } from 'lucide-react';
import { BRAZILIAN_CLUBS, getClubById } from '../data/clubs';
import { cleanCPF, formatCPF, maskCPFDisplay, validateCPF } from '../utils/cpf';
import { checkAndCastVote } from '../services/firebase';
import { triggerVoteConfetti } from '../utils/confetti';
import { Vote } from '../types';

interface VotingSectionProps {
  recentVotes: Vote[];
  onVoteCast: () => void;
}

export const VotingSection: React.FC<VotingSectionProps> = ({ recentVotes, onVoteCast }) => {
  const [nome, setNome] = useState('');
  const [cpfInput, setCpfInput] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    existingVote?: Vote;
  }>({ type: null, message: '' });

  const cleanedCPF = cleanCPF(cpfInput);
  const isCpfFull = cleanedCPF.length === 11;
  const isCpfValid = isCpfFull && validateCPF(cleanedCPF);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpfInput(formatted);
    // Limpa feedback anterior se estiver digitando novamente
    if (feedback.type) {
      setFeedback({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor, informe seu nome completo para validação do voto.',
      });
      return;
    }

    if (!isCpfValid) {
      setFeedback({
        type: 'error',
        message: 'CPF inválido! Por favor, informe um CPF de 11 dígitos válido.',
      });
      return;
    }

    if (!selectedClub) {
      setFeedback({
        type: 'error',
        message: 'Por favor, selecione seu time do coração no campo abaixo.',
      });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: null, message: '' });

    try {
      const result = await checkAndCastVote(nome, cleanedCPF, selectedClub);

      if (result.success) {
        const clubData = getClubById(selectedClub);
        triggerVoteConfetti(clubData?.corPrimaria);
        setFeedback({
          type: 'success',
          message: result.message,
        });
        // Limpa formulário
        setNome('');
        setCpfInput('');
        setSelectedClub('');
        onVoteCast();
      } else {
        setFeedback({
          type: 'error',
          message: result.message,
          existingVote: result.existingVote,
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Falha ao processar o voto: ${err.message || 'Erro inesperado'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="votacao"
      className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between"
    >
      {/* Luz ambiente de estádio */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Cabeçalho do Card - Estilo Sportstech / Vercel */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-white/10 text-emerald-400 flex items-center justify-center font-sans font-black text-2xl shadow-inner">
            🗳️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-black text-2xl text-white tracking-tight">
                Cédula Oficial de Votação
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              1 CPF = 1 Voto Oficial Auditado • Censo Nacional 2026
            </p>
          </div>
        </div>

        {/* Banner Informativo de Trava Antifraude */}
        <div className="mb-6 p-4 rounded-xl bg-slate-800/40 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300 backdrop-blur-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold block text-emerald-200 uppercase tracking-wider text-[11px] mb-0.5">
              Validação Antifraude por Documento
            </strong>
            O sistema valida seu CPF matematicamente (11 dígitos) e garante a unicidade do voto via identificador exclusivo. Tentativas de voto repetido são bloqueadas instantaneamente.
          </div>
        </div>

        {/* Formulário de Votação */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nome Completo */}
          <div>
            <label
              htmlFor="inputNome"
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Seu Nome Completo *
            </label>
            <input
              type="text"
              id="inputNome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Roberto Carlos da Silva"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm font-medium"
            />
          </div>

          {/* Campo: CPF com Máscara e Validação Automática */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="inputCPF"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                Seu CPF * (Chave Única Antifraude)
              </label>
              {cleanedCPF.length > 0 && (
                <span
                  className={`text-[11px] font-semibold flex items-center gap-1 font-mono ${
                    isCpfValid
                      ? 'text-emerald-400'
                      : isCpfFull
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {isCpfValid ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" /> CPF Válido
                    </>
                  ) : isCpfFull ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" /> Dígitos Inválidos
                    </>
                  ) : (
                    `${cleanedCPF.length}/11 dígitos`
                  )}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                id="inputCPF"
                value={cpfInput}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                required
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border font-mono tracking-wider text-white placeholder-slate-400 focus:outline-none transition text-sm ${
                  isCpfValid
                    ? 'border-emerald-500/80 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                    : isCpfFull
                    ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                    : 'border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                }`}
              />
              <div className="absolute right-3.5 top-3.5 pointer-events-none">
                {isCpfValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCpfFull ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Auditoria eleitoral: Seus dados são protegidos e auditados exclusivamente para garantir 1 voto único.
            </p>
          </div>

          {/* Campo: Time do Coração */}
          <div>
            <label
              htmlFor="selectTime"
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Seu Time do Coração *
            </label>
            <select
              id="selectTime"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm font-medium"
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                Selecione seu clube do coração no Brasil...
              </option>
              {BRAZILIAN_CLUBS.map((club) => (
                <option key={club.id} value={club.id} className="bg-slate-900 text-white">
                  {club.escudoEmoji} {club.nome} ({club.estado})
                </option>
              ))}
            </select>
          </div>

          {/* Feedback de Alerta / Sucesso */}
          {feedback.type && (
            <div
              className={`p-4 rounded-xl text-xs font-medium border flex items-start gap-3 animate-in fade-in duration-300 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">
                  {feedback.type === 'success' ? 'Voto Registrado!' : 'Voto Bloqueado pelo Antifraude'}
                </p>
                <p className="leading-relaxed">{feedback.message}</p>
                {feedback.existingVote && (
                  <div className="mt-2 pt-2 border-t border-rose-500/20 text-[11px] text-rose-300">
                    <p>
                      <strong>Registro Localizado:</strong> Torcedor{' '}
                      <span className="font-bold text-white">{feedback.existingVote.nome}</span> já
                      votou no clube{' '}
                      <span className="font-bold uppercase text-emerald-300">
                        {feedback.existingVote.time}
                      </span>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botão de Votar - Gradiente Vibrante com Brilho no Hover */}
          <button
            type="submit"
            disabled={isLoading || !isCpfValid}
            className={`w-full py-4 px-6 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isLoading || !isCpfValid
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:brightness-110 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verificando CPF e Computando Voto...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-current text-white" />
                <span>CONFIRMAR MEU VOTO NO TERMÔMETRO</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tabela de Auditoria dos Últimos Votantes */}
      <div className="mt-8 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-sans">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Últimos Votos Auditados</span>
          </p>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-white/5">
            CPF Protegido
          </span>
        </div>

        <div className="space-y-2">
          {recentVotes.slice(0, 4).map((vote, idx) => {
            const club = getClubById(vote.time);
            return (
              <div
                key={vote.id || idx}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/40 border border-white/5 text-xs backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium truncate">{vote.nome}</span>
                  <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">
                    {maskCPFDisplay(vote.id)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-emerald-400 font-bold text-[11px] font-mono">
                    {club ? `${club.escudoEmoji} ${club.sigla}` : vote.time.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
