import React, { useState } from 'react';
import { Database, X, Check, Save, RotateCcw, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { FirebaseConfig } from '../types';
import {
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  PLACEHOLDER_FIREBASE_CONFIG,
  resetDemoData,
} from '../services/firebase';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [config, setConfig] = useState<FirebaseConfig>(getStoredFirebaseConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof FirebaseConfig, val: string) => {
    setConfig((prev) => ({ ...prev, [field]: val }));
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredFirebaseConfig(config);
    setSavedSuccess(true);
    onConfigUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetToPlaceholders = () => {
    setConfig(PLACEHOLDER_FIREBASE_CONFIG);
    saveStoredFirebaseConfig(PLACEHOLDER_FIREBASE_CONFIG);
    resetDemoData();
    onConfigUpdated();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-wide">
                Configuração do Firebase SDK v10
              </h3>
              <p className="text-xs text-zinc-400">
                Cole suas credenciais do Console Firebase ou utilize os placeholders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explicação */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2 mb-6">
          <p className="flex items-center gap-1.5 font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            Integração Modular do Firebase Firestore v10:
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Se você deixar os campos com os placeholders (ex: <code className="text-zinc-300">SUA_API_KEY_DO_FIREBASE_AQUI</code>), o sistema funciona perfeitamente em modo de simulação com armazenamento local. Quando você colar as credenciais do seu projeto Firebase, o portal conecta-se em tempo real diretamente ao seu banco Firestore!
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
              apiKey *
            </label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                projectId *
              </label>
              <input
                type="text"
                value={config.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                authDomain
              </label>
              <input
                type="text"
                value={config.authDomain}
                onChange={(e) => handleChange('authDomain', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                storageBucket
              </label>
              <input
                type="text"
                value={config.storageBucket}
                onChange={(e) => handleChange('storageBucket', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                messagingSenderId
              </label>
              <input
                type="text"
                value={config.messagingSenderId}
                onChange={(e) => handleChange('messagingSenderId', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                appId
              </label>
              <input
                type="text"
                value={config.appId}
                onChange={(e) => handleChange('appId', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Guia de regras do Firestore */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-emerald-400">Coleções esperadas no seu Firestore:</span>
            <ul className="list-disc list-inside space-y-0.5 text-zinc-300">
              <li>
                <code className="text-emerald-400 font-mono">votos_torcida</code>: Document ID = CPF Limpo (11 dígitos).
              </li>
              <li>
                <code className="text-emerald-400 font-mono">posts_esportes</code>: Notícias ordenadas por <code className="text-emerald-400 font-mono">dataCriacao</code> desc.
              </li>
            </ul>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Configuração do Firebase atualizada com sucesso!</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToPlaceholders}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Placeholders / Modo Teste</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configuração</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
