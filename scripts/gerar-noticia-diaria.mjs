/**
 * ==============================================================================
 * TERMÔMETRO DA TORCIDA - GERADOR DIÁRIO AUTOMATIZADO COM GOOGLE GEMINI E FIREBASE
 * ==============================================================================
 * 
 * Este script foi projetado para rodar 1 VEZ POR DIA dentro do PLANO GRATUITO:
 * - 1 chamada à API do Google Gemini (@google/genai)
 * - 1 escrita na coleção "posts_esportes" do Firestore
 * - ID determinístico idempotente por data (ex: "post_2026-11-07") para evitar duplicatas
 * 
 * Como executar localmente:
 *   node scripts/gerar-noticia-diaria.mjs
 * ==============================================================================
 */

import { GoogleGenAI, Type } from '@google/genai';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente de .env se existir
dotenv.config();

// ------------------------------------------------------------------------------
// 1. CONFIGURAÇÃO DAS CHAVES E AMBIENTE
// ------------------------------------------------------------------------------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "SUA_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "termometrodatorcida.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "termometrodatorcida",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "termometrodatorcida.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Fotos esportivas de alta qualidade rotativas do Unsplash
const IMAGENS_FUTEBOL_PRESET = [
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80"
];

async function executarGeradorDiario() {
  console.log("-----------------------------------------------------------------");
  console.log("⚡ INICIANDO ROTINA DIÁRIA DO TERMÔMETRO DA TORCIDA");
  console.log("📅 Data Atual:", new Date().toISOString());
  console.log("-----------------------------------------------------------------");

  if (!GEMINI_API_KEY) {
    console.error("❌ ERRO: A variável de ambiente GEMINI_API_KEY não foi encontrada!");
    process.exit(1);
  }

  // Define ID determinístico do dia (ex: post_2026-11-07)
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  const docIdHoje = `post_${ano}-${mes}-${dia}`;

  console.log(`🎯 ID do Documento do Dia: "${docIdHoje}"`);

  // ----------------------------------------------------------------------------
  // 2. INICIALIZAÇÃO DO FIREBASE FIRESTORE E CHECAGEM DE DUPLICIDADE
  // ----------------------------------------------------------------------------
  console.log("🔌 Conectando ao Firebase Firestore...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    const postRef = doc(db, "posts_esportes", docIdHoje);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      console.log(`⚠️ A notícia de hoje (${docIdHoje}) JÁ FOI GERADA anteriormente.`);
      console.log("🛡️ Economia ativada: Nenhuma escrita redundante gasta no Firestore.");
      console.log("✅ Processo concluído com sucesso.");
      return;
    }
  } catch (err) {
    console.warn("⚠️ Aviso ao verificar existência no Firestore (prosseguindo):", err.message);
  }

  // ----------------------------------------------------------------------------
  // 3. GERAÇÃO DE CONTEÚDO COM GOOGLE GEMINI (@google/genai)
  // ----------------------------------------------------------------------------
  console.log("🤖 Chamando o modelo Google Gemini (gemini-3.8-flash)...");

  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const prompt = `Faça um resumo jornalístico esportivo e envolvente sobre os principais acontecimentos do futebol brasileiro (Brasileirão, Copa do Brasil ou Estaduais) ocorridos no dia anterior. 
O texto deve ser profissional, vibrante, no tom esportivo das grandes redações brasileiras, mencionando a paixão das torcidas e a disputa acirrada. 
Formate o texto do conteúdo com parágrafos claros e tags HTML básicas (<p>, <strong>, <em>).`;

  const fotoSorteada = IMAGENS_FUTEBOL_PRESET[Math.floor(Math.random() * IMAGENS_FUTEBOL_PRESET.length)];

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      systemInstruction: "Você é o Editor-Chefe de esportes do portal 'Termômetro da Torcida' (termometrodatorcida.com.br). Seu objetivo é produzir 1 resumo diário dinâmico, factual e de alto engajamento sobre o futebol brasileiro.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titulo: {
            type: Type.STRING,
            description: "Título chamativo e jornalístico da rodada esportiva."
          },
          subtitulo: {
            type: Type.STRING,
            description: "Chamada curta e impactante (linha fina)."
          },
          categoria: {
            type: Type.STRING,
            description: "Deve ser 'Futebol Nacional'."
          },
          conteudo: {
            type: Type.STRING,
            description: "O texto completo da matéria esportiva formatado com tags HTML básicas (<p>, <strong>, <em>)."
          },
          imagemCapa: {
            type: Type.STRING,
            description: "URL de imagem esportiva de capa em alta resolução."
          }
        },
        required: ["titulo", "subtitulo", "categoria", "conteudo"]
      }
    }
  });

  const textoGerado = response.text;
  if (!textoGerado) {
    throw new Error("O Gemini não retornou nenhum texto.");
  }

  const dadosMateria = JSON.parse(textoGerado);
  console.log("✅ Conteúdo gerado com sucesso pelo Gemini:");
  console.log(`📌 Título: "${dadosMateria.titulo}"`);
  console.log(`📌 Subtítulo: "${dadosMateria.subtitulo}"`);

  // Se a IA não forneceu imagemCapa ou se veio vazia, usamos o preset temático de futebol
  const imagemFinal = dadosMateria.imagemCapa && dadosMateria.imagemCapa.startsWith("http")
    ? dadosMateria.imagemCapa
    : fotoSorteada;

  // ----------------------------------------------------------------------------
  // 4. SALVAMENTO NO FIRESTORE (Coleção "posts_esportes")
  // ----------------------------------------------------------------------------
  console.log(`💾 Salvando no Firestore em: posts_esportes/${docIdHoje}...`);

  const docFinal = {
    id: docIdHoje,
    titulo: dadosMateria.titulo,
    subtitulo: dadosMateria.subtitulo,
    categoria: dadosMateria.categoria || "Futebol Nacional",
    imagemUrl: imagemFinal,
    conteudo: dadosMateria.conteudo,
    autor: "Redação Termômetro da Torcida (Lucyano / IA)",
    adminEmail: "lucyano.pci@gmail.com",
    dataPublicacao: serverTimestamp(),
    criadoEmISO: new Date().toISOString()
  };

  const docRef = doc(db, "posts_esportes", docIdHoje);
  await setDoc(docRef, docFinal, { merge: true });

  console.log("-----------------------------------------------------------------");
  console.log("🎉 SUCESSO ABSOLUTO!");
  console.log(`📰 Notícia diária publicada com ID: "${docIdHoje}"`);
  console.log("📊 Custo consumido: Exatamente 1 chamada Gemini + 1 escrita no Firestore.");
  console.log("-----------------------------------------------------------------");
}

executarGeradorDiario().catch((err) => {
  console.error("❌ FALHA NA EXECUÇÃO DO SCRIPT:", err);
  process.exit(1);
});
