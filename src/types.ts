export interface Vote {
  id: string; // Clean CPF (11 digits)
  nome: string;
  time: string;
  timestamp: string | number | { seconds: number; nanoseconds: number };
  dataLegivel?: string;
}

export interface BlogPost {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  imagemUrl: string;
  conteudo: string;
  dataCriacao: string | number | { seconds: number; nanoseconds: number };
  autor?: string;
  dataLegivel?: string;
}

export interface Club {
  id: string;
  nome: string;
  sigla: string;
  estado: string;
  corPrimaria: string;
  corSecundaria: string;
  escudoEmoji: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ClubTally {
  club: Club;
  votos: number;
  porcentagem: number;
}

export const MASTER_ADMIN_EMAIL = 'lucyano.pci@gmail.com';
