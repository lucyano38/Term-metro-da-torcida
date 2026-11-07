import React, { useState } from 'react';
import { Code, Download, Copy, Check, X, FileText, CheckCircle2 } from 'lucide-react';

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/termometro_da_torcida.html');
      const htmlText = await response.text();
      await navigator.clipboard.writeText(htmlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Falha ao copiar HTML:', e);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/termometro_da_torcida.html');
      const htmlText = await response.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'termometro_da_torcida.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (e) {
      console.error('Falha no download:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 backdrop-blur-xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-xl text-white uppercase tracking-wide">
                Arquivo Único HTML Standalone
              </h3>
              <p className="text-xs text-slate-400">
                100% autônomo com Tailwind CSS via CDN e Firebase v10 modular
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

        {/* Informações */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pronto para rodar em qualquer hospedagem</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Conforme solicitado, geramos o código completo em um único arquivo HTML contendo:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Design moderno Sportstech / Vercel com fundo <code className="text-emerald-400">slate-950</code>, efeito glassmorphism e skeleton loading</li>
              <li>Tailwind CSS via CDN oficial (<code className="text-emerald-400">cdn.tailwindcss.com</code>)</li>
              <li>SDK Modular do Firebase v10 via CDN ES Modules (<code className="text-emerald-400">gstatic.com/firebasejs/10.12.2</code>)</li>
              <li>Trava antifraude na coleção <code className="text-emerald-400">votos_torcida</code> com Document ID sendo o CPF limpo</li>
              <li>Placar parcial em tempo real ordenado do maior para o menor (apenas clubes com votos)</li>
              <li>Blog de notícias com skeleton loaders para eliminar qualquer piscagem</li>
              <li>Painel administrativo exclusivo para <code className="text-emerald-400 font-bold">lucyano.pci@gmail.com</code> com bloqueio para qualquer outro usuário (<code className="text-amber-400">torcida2026</code>)</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
            <span className="font-bold text-slate-200">Como publicar:</span>
            <p className="text-slate-400">
              Basta baixar o arquivo <code className="text-white">termometro_da_torcida.html</code> (ou renomear para <code className="text-white">index.html</code>) e enviar para qualquer servidor (HostGator, cPanel, Apache, Nginx, Vercel ou Netlify). Não requer instalação de npm ou build!
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyCode}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer border border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Código Copiado para a Área de Transferência!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Código HTML Completo</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Arquivo Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar termometro_da_torcida.html</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
