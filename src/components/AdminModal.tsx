import React, { useState } from 'react';
import { Lock, Unlock, X, PlusCircle, Trash2, ShieldCheck, Newspaper, Image as ImageIcon, CheckCircle2, AlertTriangle, Eye, Loader2 } from 'lucide-react';
import { BlogPost, MASTER_ADMIN_EMAIL, Vote } from '../types';
import { createBlogPost, deleteBlogPost } from '../services/firebase';
import { cleanCPF, maskCPFDisplay } from '../utils/cpf';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  votes: Vote[];
  onPostCreated: () => void;
  onSelectPost: (post: BlogPost) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  posts,
  votes,
  onPostCreated,
  onSelectPost,
}) => {
  const [adminEmail, setAdminEmail] = useState(MASTER_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('tdt_admin_auth') === MASTER_ADMIN_EMAIL;
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'NOVO_POST' | 'GERENCIAR_POSTS' | 'AUDITORIA_VOTOS' | 'ROBO_GEMINI'>('NOVO_POST');

  // Form states
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [categoria, setCategoria] = useState('Brasileirão');
  const [imagemUrl, setImagemUrl] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState(`Lucyano (${MASTER_ADMIN_EMAIL})`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();

    // Trava de segurança: Apenas lucyano.pci@gmail.com tem autorização
    if (cleanEmail !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      setAuthError(`Acesso bloqueado! O e-mail "${cleanEmail}" NÃO possui autorização administrativa. Apenas o administrador exclusivo ${MASTER_ADMIN_EMAIL} tem permissão para gerenciar o blog.`);
      return;
    }

    if (passwordInput.trim() === 'torcida2026') {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('tdt_admin_auth', MASTER_ADMIN_EMAIL);
    } else {
      setAuthError('Senha incorreta! Dica do sistema: torcida2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    localStorage.removeItem('tdt_admin_auth');
  };

  const handleSetPresetImage = (url: string) => {
    setImagemUrl(url);
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !subtitulo.trim() || !imagemUrl.trim() || !conteudo.trim()) {
      setFeedback({ type: 'error', message: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await createBlogPost({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        categoria,
        imagemUrl: imagemUrl.trim(),
        conteudo: conteudo.trim(),
        autor: autor.trim() || 'Redação Termômetro da Torcida',
      });

      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setTitulo('');
        setSubtitulo('');
        setImagemUrl('');
        setConteudo('');
        onPostCreated();
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Erro ao salvar: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Tem certeza que deseja excluir esta matéria do blog?')) {
      await deleteBlogPost(postId);
      onPostCreated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 backdrop-blur-xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-sans font-bold text-xl text-white uppercase tracking-wide">
                Área Restrita / Painel Admin
              </h3>
              <p className="text-xs text-slate-400">
                Publicação de notícias no blog e auditoria da votação antifraude
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TELA 1: LOGIN COM E-MAIL E SENHA EXCLUSIVOS */}
        {!isAuthenticated ? (
          <div className="space-y-4 max-w-md mx-auto py-6">
            {/* Banner de Administrador Exclusivo */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Administrador Exclusivo Definido</span>
              </div>
              <p className="text-zinc-300">
                O gerenciamento diário do blog e a publicação de notícias foram configurados com exclusividade para o e-mail:
              </p>
              <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-emerald-500/30 font-mono text-emerald-400 font-bold text-xs flex items-center justify-between">
                <span>{MASTER_ADMIN_EMAIL}</span>
                <span className="text-[10px] uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Autorizado</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Nenhum outro usuário ou e-mail possui permissão de administrador nesta aplicação.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  E-mail do Administrador *
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="lucyano.pci@gmail.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Senha de Acesso *
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite sua senha..."
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-sm font-mono tracking-wider"
                />
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition cursor-pointer"
              >
                ENTRAR COMO ADMINISTRADOR EXCLUSIVO
              </button>
            </form>
          </div>
        ) : (
          /* TELA 2: PAINEL LIBERADO */
          <div className="space-y-6">
            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin Conectado:</span>
                <span className="text-white font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {MASTER_ADMIN_EMAIL}
                </span>
                <span className="text-[10px] text-emerald-300 uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  Exclusivo
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-rose-400 transition font-mono text-xs"
              >
                Encerrar Sessão
              </button>
            </div>

            {/* Abas */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveTab('NOVO_POST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  activeTab === 'NOVO_POST'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nova Matéria (posts_esportes)</span>
              </button>

              <button
                onClick={() => setActiveTab('GERENCIAR_POSTS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  activeTab === 'GERENCIAR_POSTS'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Matérias Publicadas ({posts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('AUDITORIA_VOTOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  activeTab === 'AUDITORIA_VOTOS'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Auditoria ({votes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ROBO_GEMINI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  activeTab === 'ROBO_GEMINI'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>🤖</span>
                <span>Robô Gemini (1x/dia)</span>
              </button>
            </div>

            {/* CONTEÚDO DA ABA 1: FORMULÁRIO DE NOVA NOTÍCIA */}
            {activeTab === 'NOVO_POST' && (
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm uppercase text-white flex items-center gap-2">
                    <span>✍️</span> Escrever Nova Matéria no Blog
                  </h4>
                  <span className="text-[11px] text-zinc-500 font-mono">Coleção: posts_esportes</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Título da Notícia *
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    placeholder="Ex: Choque-rei decisivo bate recorde de público e define líder da temporada"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Subtítulo / Linha Fina *
                  </label>
                  <input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    required
                    placeholder="Ex: Mais de 60 mil ingressos vendidos para o clássico mais esperado do ano."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Brasileirão">Brasileirão</option>
                      <option value="Libertadores">Libertadores</option>
                      <option value="Mercado da Bola">Mercado da Bola</option>
                      <option value="Seleção Brasileira">Seleção Brasileira</option>
                      <option value="Copa do Brasil">Copa do Brasil</option>
                      <option value="Torcidas & Cultura">Torcidas & Cultura</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      URL da Imagem de Capa *
                    </label>
                    <input
                      type="url"
                      value={imagemUrl}
                      onChange={(e) => setImagemUrl(e.target.value)}
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Presets rápidos de fotos de esportes */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs">
                  <span className="font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    Fotos esportivas em alta resolução para teste rápido:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleSetPresetImage(
                          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
                        )
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      ⚽ Estádio Noturno Lotado
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSetPresetImage(
                          'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80'
                        )
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      🏟️ Arquibancada com Fumaça
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSetPresetImage(
                          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
                        )
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      🥅 Bola na Rede
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSetPresetImage(
                          'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80'
                        )
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      🇧🇷 Gramado de Futebol
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Conteúdo da Matéria *
                  </label>
                  <textarea
                    rows={6}
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    required
                    placeholder="Redija o texto completo da matéria com todas as informações..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      feedback.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gravando no Firestore (posts_esportes)...</span>
                    </>
                  ) : (
                    <>
                      <span>PUBLICAR MATÉRIA NO BLOG</span>
                      <span>🚀</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* CONTEÚDO DA ABA 2: GERENCIAR POSTS */}
            {activeTab === 'GERENCIAR_POSTS' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">
                  Lista de matérias registradas na coleção <code className="text-emerald-400">posts_esportes</code> do Firestore.
                </p>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <img
                          src={post.imagemUrl || '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg'}
                          alt={post.titulo}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-zinc-900"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg';
                          }}
                        />
                        <div className="truncate">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                            {post.categoria}
                          </span>
                          <h5 className="font-bold text-white text-sm truncate mt-0.5">
                            {post.titulo}
                          </h5>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {post.dataLegivel || 'Recente'} • ID: {post.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectPost(post);
                          }}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                          title="Visualizar notícia"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-400"
                          title="Excluir notícia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTEÚDO DA ABA 3: AUDITORIA ANTIFRAUDE */}
            {activeTab === 'AUDITORIA_VOTOS' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                  <strong>Auditoria Eleitoral Antifraude:</strong> Cada voto abaixo corresponde a um documento único na coleção <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-400 font-mono">votos_torcida</code> cujo Document ID é exatamente o CPF Limpo do torcedor.
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                        <th className="py-2 px-3">Nome do Torcedor</th>
                        <th className="py-2 px-3">Document ID (CPF)</th>
                        <th className="py-2 px-3">Time Votado</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {votes.map((v) => (
                        <tr key={v.id} className="hover:bg-zinc-950/60">
                          <td className="py-2 px-3 text-white font-medium">{v.nome}</td>
                          <td className="py-2 px-3 font-mono text-zinc-400">
                            {cleanCPF(v.id).slice(0, 3)}.{cleanCPF(v.id).slice(3, 6)}.***-**
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold uppercase text-[11px]">
                              {v.time}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> Auditado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTEÚDO DA ABA 4: ROBÔ GEMINI (1x ao dia - Free Tier) */}
            {activeTab === 'ROBO_GEMINI' && (
              <div className="space-y-4 text-xs text-zinc-300">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                    <span>⚡ Robô Diário 100% no Plano Gratuito (Free Tier)</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Este robô foi projetado para rodar <strong>exatamente 1 vez por dia</strong>, gerando 1 notícia oficial com a IA do Google Gemini (<code className="text-emerald-400 font-mono">gemini-3.8-flash</code>) e salvando 1 documento no Firestore.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                    <div className="p-2 rounded bg-black/40 border border-zinc-800">
                      <span className="text-zinc-400 block text-[10px]">Consumo Diário:</span>
                      <strong className="text-emerald-400">1 escrita / dia</strong>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-zinc-800">
                      <span className="text-zinc-400 block text-[10px]">Limite Gratuito Firebase:</span>
                      <strong className="text-white">20.000 / dia</strong>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-zinc-800 col-span-2 sm:col-span-1">
                      <span className="text-zinc-400 block text-[10px]">Consumo do Limite:</span>
                      <strong className="text-emerald-300">0.005% (100% Free)</strong>
                    </div>
                  </div>
                </div>

                {/* Arquivos do Robô */}
                <div className="space-y-2">
                  <span className="font-bold text-zinc-200 block">Arquivos criados no repositório:</span>
                  
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <code className="text-emerald-400 font-mono font-bold block">scripts/gerar-noticia-diaria.mjs</code>
                      <span className="text-[11px] text-zinc-400">Script Node.js com @google/genai e Firebase Firestore</span>
                    </div>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-mono">Pronto</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <code className="text-emerald-400 font-mono font-bold block">.github/workflows/gerador-diario.yml</code>
                      <span className="text-[11px] text-zinc-400">Automação GitHub Actions rodando diariamente (cron: 0 9 * * *)</span>
                    </div>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-mono">Cron Ativo</span>
                  </div>
                </div>

                {/* Como testar localmente */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <span className="font-bold text-zinc-200 block">Como testar no seu terminal agora:</span>
                  <pre className="p-2.5 rounded bg-black/70 border border-zinc-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
npm run gerar:noticia
                  </pre>
                  <p className="text-[11px] text-zinc-400">
                    O script verificará se a data de hoje já foi gerada (ex: <code className="text-zinc-300">post_2026-11-07</code>). Se já existir, ele não gera duplicata e poupa sua quota.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
