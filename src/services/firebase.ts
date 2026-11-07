import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import { BlogPost, FirebaseConfig, Vote } from '../types';
import { INITIAL_POSTS, INITIAL_VOTES } from '../data/initialData';

export const PLACEHOLDER_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "SUA_API_KEY_DO_FIREBASE_AQUI",
  authDomain: "termometrodatorcida.firebaseapp.com",
  projectId: "termometrodatorcida-2026",
  storageBucket: "termometrodatorcida-2026.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

const STORAGE_KEY_CONFIG = 'tdt_firebase_config';
const STORAGE_KEY_POSTS = 'tdt_local_posts';
const STORAGE_KEY_VOTES = 'tdt_local_votes';

export function getStoredFirebaseConfig(): FirebaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler config salva do Firebase', e);
  }
  return PLACEHOLDER_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
}

export function isRealFirebaseConfig(config: FirebaseConfig): boolean {
  return (
    Boolean(config.apiKey) &&
    Boolean(config.projectId) &&
    !config.apiKey.includes('SUA_API_KEY') &&
    config.apiKey.length > 15
  );
}

// Singleton instances
let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export function initializeFirebaseService(config: FirebaseConfig = getStoredFirebaseConfig()): {
  isLive: boolean;
  db: Firestore | null;
} {
  if (isRealFirebaseConfig(config)) {
    try {
      if (!getApps().length) {
        firebaseApp = initializeApp(config);
      } else {
        firebaseApp = getApp();
      }
      firestoreDb = getFirestore(firebaseApp);
      return { isLive: true, db: firestoreDb };
    } catch (err) {
      console.error('Falha ao inicializar Firebase SDK v10:', err);
      firestoreDb = null;
      return { isLive: false, db: null };
    }
  }

  firestoreDb = null;
  return { isLive: false, db: null };
}

// Local storage fallback helpers for demo/simulation
function getLocalPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Assegura que nenhum post local fique com URL externa quebrada ou nula
        return parsed.map((p, idx) => ({
          ...p,
          imagemUrl: p.imagemUrl && p.imagemUrl.startsWith('/src/assets/images')
            ? p.imagemUrl
            : (INITIAL_POSTS[idx % INITIAL_POSTS.length]?.imagemUrl || '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg'),
        }));
      }
    }
  } catch (e) {
    console.warn('Erro ao ler posts locais', e);
  }
  saveLocalPosts(INITIAL_POSTS);
  return INITIAL_POSTS;
}

function saveLocalPosts(posts: BlogPost[]): void {
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
}

function getLocalVotes(): Vote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOTES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erro ao ler votos locais', e);
  }
  return INITIAL_VOTES;
}

function saveLocalVotes(votes: Vote[]): void {
  localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(votes));
}

// Listeners for local changes to simulate onSnapshot
type PostsCallback = (posts: BlogPost[]) => void;
type VotesCallback = (votes: Vote[]) => void;

const localPostSubscribers: Set<PostsCallback> = new Set();
const localVoteSubscribers: Set<VotesCallback> = new Set();

function notifyLocalPosts(): void {
  const posts = getLocalPosts();
  localPostSubscribers.forEach(cb => cb(posts));
}

function notifyLocalVotes(): void {
  const votes = getLocalVotes();
  localVoteSubscribers.forEach(cb => cb(votes));
}

/**
 * -------------------------------------------------------------
 * VOTAÇÃO ANTIFRAUDE (Coleção "votos_torcida")
 * Requisito: Documento DEVE ter o CPF limpo como ID.
 * Verifica existência antes de gravar.
 * -------------------------------------------------------------
 */
export async function checkAndCastVote(
  nome: string,
  cpfLimpo: string,
  time: string
): Promise<{ success: boolean; message: string; existingVote?: Vote }> {
  const { isLive, db } = initializeFirebaseService();

  // 1. Se estiver conectado ao Firebase Firestore real
  if (isLive && db) {
    try {
      const docRef = doc(db, 'votos_torcida', cpfLimpo);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          success: false,
          message: `Voto bloqueado! O CPF informado já participou da votação e votou no time: ${data.time?.toUpperCase() || 'registrado'}. Só é permitido 1 voto por CPF.`,
          existingVote: {
            id: cpfLimpo,
            nome: data.nome || 'Torcedor',
            time: data.time || '',
            timestamp: data.timestamp || Date.now()
          }
        };
      }

      // Salva voto usando o CPF limpo como ID do documento
      await setDoc(docRef, {
        nome: nome.trim(),
        cpf: cpfLimpo,
        time: time.toLowerCase(),
        timestamp: serverTimestamp(),
        criadoEm: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Voto computado com sucesso no Termômetro da Torcida! O placar foi atualizado.'
      };
    } catch (err: any) {
      console.error('Erro ao votar:', err);
      return {
        success: false,
        message: `Erro na validação do voto: ${err.message || 'Tente novamente em instantes'}`
      };
    }
  }

  // 2. Modo Simulado / LocalStorage (Segue a mesma trava rígida de CPF)
  const votes = getLocalVotes();
  const existing = votes.find(v => v.id === cpfLimpo);

  if (existing) {
    return {
      success: false,
      message: `Voto bloqueado pelo sistema antifraude! O CPF já registrou um voto no ${existing.time.toUpperCase()}. Cada torcedor tem direito a apenas 1 voto.`,
      existingVote: existing
    };
  }

  const newVote: Vote = {
    id: cpfLimpo,
    nome: nome.trim(),
    time: time.toLowerCase(),
    timestamp: Date.now(),
    dataLegivel: 'Agora mesmo'
  };

  const updated = [newVote, ...votes];
  saveLocalVotes(updated);
  notifyLocalVotes();

  return {
    success: true,
    message: 'Voto registrado com sucesso! O placar do Termômetro foi atualizado instantaneamente.'
  };
}

/**
 * Escuta votos em tempo real (onSnapshot ou simulador)
 */
export function subscribeToVotes(callback: VotesCallback): Unsubscribe {
  const { isLive, db } = initializeFirebaseService();

  if (isLive && db) {
    try {
      const colRef = collection(db, 'votos_torcida');
      return onSnapshot(colRef, (snapshot) => {
        const votes: Vote[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          votes.push({
            id: docSnap.id,
            nome: data.nome || 'Torcedor',
            time: data.time || '',
            timestamp: data.timestamp || Date.now(),
            dataLegivel: 'Registrado no Firestore'
          });
        });
        callback(votes);
      }, (err) => {
        console.warn('Falha no onSnapshot de votos, usando fallback:', err);
        callback(getLocalVotes());
      });
    } catch (e) {
      console.warn('Erro ao assinar votos Firestore:', e);
    }
  }

  // Fallback local
  localVoteSubscribers.add(callback);
  callback(getLocalVotes());

  return () => {
    localVoteSubscribers.delete(callback);
  };
}

/**
 * -------------------------------------------------------------
 * BLOG DE NOTÍCIAS (Coleção "posts_esportes")
 * -------------------------------------------------------------
 */

export function subscribeToPosts(callback: PostsCallback): Unsubscribe {
  const { isLive, db } = initializeFirebaseService();

  if (isLive && db) {
    try {
      const q = query(collection(db, 'posts_esportes'), orderBy('dataCriacao', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const posts: BlogPost[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          let dataLegivel = 'Recente';
          if (data.dataCriacao?.toDate) {
            dataLegivel = data.dataCriacao.toDate().toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
          posts.push({
            id: docSnap.id,
            titulo: data.titulo || '',
            subtitulo: data.subtitulo || '',
            categoria: data.categoria || 'Geral',
            imagemUrl: data.imagemUrl || '',
            conteudo: data.conteudo || '',
            dataCriacao: data.dataCriacao || Date.now(),
            autor: data.autor || 'Redação',
            dataLegivel
          });
        });
        callback(posts);
      }, (err) => {
        console.warn('Erro ao assinar posts do Firestore, usando fallback:', err);
        callback(getLocalPosts());
      });
    } catch (e) {
      console.warn('Erro ao assinar posts Firestore:', e);
    }
  }

  // Fallback local
  localPostSubscribers.add(callback);
  callback(getLocalPosts());

  return () => {
    localPostSubscribers.delete(callback);
  };
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'dataCriacao'>): Promise<{ success: boolean; message: string; id?: string }> {
  const { isLive, db } = initializeFirebaseService();

  if (isLive && db) {
    try {
      const colRef = collection(db, 'posts_esportes');
      const docRef = await addDoc(colRef, {
        titulo: post.titulo.trim(),
        subtitulo: post.subtitulo.trim(),
        categoria: post.categoria.trim(),
        imagemUrl: post.imagemUrl.trim(),
        conteudo: post.conteudo.trim(),
        autor: post.autor || 'Redação Termômetro da Torcida',
        dataCriacao: serverTimestamp()
      });

      return {
        success: true,
        message: 'Matéria publicada com sucesso no Firestore (coleção posts_esportes)!',
        id: docRef.id
      };
    } catch (err: any) {
      console.error('Erro ao criar post no Firestore:', err);
      return {
        success: false,
        message: `Falha no Firebase: ${err.message || 'Erro ao publicar notícia'}`
      };
    }
  }

  // Fallback local
  const posts = getLocalPosts();
  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}`,
    dataCriacao: new Date().toISOString(),
    dataLegivel: 'Agora mesmo'
  };

  const updated = [newPost, ...posts];
  saveLocalPosts(updated);
  notifyLocalPosts();

  return {
    success: true,
    message: 'Matéria publicada com sucesso no blog!',
    id: newPost.id
  };
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; message: string }> {
  const { isLive, db } = initializeFirebaseService();

  if (isLive && db) {
    try {
      await deleteDoc(doc(db, 'posts_esportes', id));
      return { success: true, message: 'Matéria excluída com sucesso do Firestore!' };
    } catch (err: any) {
      return { success: false, message: `Erro ao excluir: ${err.message}` };
    }
  }

  const posts = getLocalPosts().filter(p => p.id !== id);
  saveLocalPosts(posts);
  notifyLocalPosts();
  return { success: true, message: 'Matéria removida com sucesso!' };
}

export function resetDemoData(): void {
  localStorage.removeItem(STORAGE_KEY_POSTS);
  localStorage.removeItem(STORAGE_KEY_VOTES);
  notifyLocalPosts();
  notifyLocalVotes();
}
