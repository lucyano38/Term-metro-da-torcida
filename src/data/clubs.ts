import { Club } from '../types';

export const BRAZILIAN_CLUBS: Club[] = [
  { id: 'flamengo', nome: 'Flamengo', sigla: 'FLA', estado: 'RJ', corPrimaria: '#c5221f', corSecundaria: '#000000', escudoEmoji: '🔴⚫' },
  { id: 'corinthians', nome: 'Corinthians', sigla: 'COR', estado: 'SP', corPrimaria: '#111111', corSecundaria: '#ffffff', escudoEmoji: '⚪⚫' },
  { id: 'palmeiras', nome: 'Palmeiras', sigla: 'PAL', estado: 'SP', corPrimaria: '#046a38', corSecundaria: '#ffffff', escudoEmoji: '🟢⚪' },
  { id: 'sao-paulo', nome: 'São Paulo', sigla: 'SAO', estado: 'SP', corPrimaria: '#da291c', corSecundaria: '#000000', escudoEmoji: '🔴⚪⚫' },
  { id: 'santos', nome: 'Santos', sigla: 'SAN', estado: 'SP', corPrimaria: '#ffffff', corSecundaria: '#000000', escudoEmoji: '⚪⚫' },
  { id: 'vasco', nome: 'Vasco da Gama', sigla: 'VAS', estado: 'RJ', corPrimaria: '#000000', corSecundaria: '#ffffff', escudoEmoji: '⚪⚫' },
  { id: 'gremio', nome: 'Grêmio', sigla: 'GRE', estado: 'RS', corPrimaria: '#0d80bf', corSecundaria: '#000000', escudoEmoji: '🔵⚪⚫' },
  { id: 'internacional', nome: 'Internacional', sigla: 'INT', estado: 'RS', corPrimaria: '#e31b23', corSecundaria: '#ffffff', escudoEmoji: '🔴⚪' },
  { id: 'atletico-mg', nome: 'Atlético-MG', sigla: 'CAM', estado: 'MG', corPrimaria: '#111111', corSecundaria: '#ffffff', escudoEmoji: '⚫⚪' },
  { id: 'cruzeiro', nome: 'Cruzeiro', sigla: 'CRU', estado: 'MG', corPrimaria: '#003a70', corSecundaria: '#ffffff', escudoEmoji: '🔵⚪' },
  { id: 'botafogo', nome: 'Botafogo', sigla: 'BOT', estado: 'RJ', corPrimaria: '#000000', corSecundaria: '#ffffff', escudoEmoji: '⭐⚫⚪' },
  { id: 'fluminense', nome: 'Fluminense', sigla: 'FLU', estado: 'RJ', corPrimaria: '#8a1538', corSecundaria: '#006341', escudoEmoji: '🟢⚪🔴' },
  { id: 'bahia', nome: 'Bahia', sigla: 'BAH', estado: 'BA', corPrimaria: '#0062b8', corSecundaria: '#e21b22', escudoEmoji: '🔵⚪🔴' },
  { id: 'fortaleza', nome: 'Fortaleza', sigla: 'FOR', estado: 'CE', corPrimaria: '#114a9f', corSecundaria: '#de1d24', escudoEmoji: '🔵🔴⚪' },
  { id: 'athletico-pr', nome: 'Athletico-PR', sigla: 'CAP', estado: 'PR', corPrimaria: '#d31118', corSecundaria: '#000000', escudoEmoji: '🔴⚫' },
  { id: 'sport', nome: 'Sport Recife', sigla: 'SPT', estado: 'PE', corPrimaria: '#d40000', corSecundaria: '#111111', escudoEmoji: '🦁🔴⚫' },
  { id: 'ceara', nome: 'Ceará', sigla: 'CSC', estado: 'CE', corPrimaria: '#000000', corSecundaria: '#ffffff', escudoEmoji: '⚫⚪' },
  { id: 'vitoria', nome: 'Vitória', sigla: 'VIT', estado: 'BA', corPrimaria: '#e30613', corSecundaria: '#000000', escudoEmoji: '🔴⚫' },
  { id: 'coritiba', nome: 'Coritiba', sigla: 'CFC', estado: 'PR', corPrimaria: '#00552b', corSecundaria: '#ffffff', escudoEmoji: '🟢⚪' },
  { id: 'goias', nome: 'Goiás', sigla: 'GOI', estado: 'GO', corPrimaria: '#005e38', corSecundaria: '#ffffff', escudoEmoji: '🟢⚪' },
];

export function getClubById(id: string): Club | undefined {
  return BRAZILIAN_CLUBS.find(c => c.id === id);
}

export function getClubByName(name: string): Club | undefined {
  return BRAZILIAN_CLUBS.find(c => c.nome.toLowerCase() === name.toLowerCase() || c.id === name.toLowerCase());
}
