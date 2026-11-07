import { BlogPost, Vote } from '../types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    titulo: 'Rodada Decisiva do Brasileirão 2026: Líderes entram em campo sob pressão máxima das torcidas',
    subtitulo: 'Diferença de apenas dois pontos no topo da tabela transforma cada clássico em final antecipada nas principais arenas do país.',
    categoria: 'Brasileirão',
    imagemUrl: '/src/assets/images/hero_brasileirao_stadium_1794060293571.jpg',
    conteudo: `A reta decisiva do Campeonato Brasileiro de 2026 atinge seu ápice de emoção e técnica. Com ingressos esgotados em menos de duas horas em estádios como o Maracanã, Allianz Parque, Neo Química Arena e Mineirão, os clubes que disputam a ponta da tabela entram em campo cientes de que cada detalhe decidirá o campeonato.

Nas coletivas desta manhã, comissões técnicas ressaltaram que a energia que desce das arquibancadas é o diferencial decisivo nesta rodada. No Termômetro da Torcida, as massas populares se mobilizam para demonstrar quem é a força motriz mais imponente do futebol brasileiro.

As formações táticas projetam marcação em bloco alto, transições fulminantes pelos corredores laterais e concentração total nos acréscimos.`,
    dataCriacao: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    autor: 'Lucyano • Editor do Termômetro',
    dataLegivel: 'Hoje, há 18 min'
  },
  {
    id: 'post-2',
    titulo: 'Final da Libertadores 2026: Ingressos esgotados e caravanas mobilizam torcidas pelo continente',
    subtitulo: 'Palco da grande decisão única recebe torcedores de Norte a Sul para o duelo mais aguardado da América do Sul.',
    categoria: 'Libertadores',
    imagemUrl: '/src/assets/images/libertadores_final_match_1794060293464.jpg',
    conteudo: `A Conmebol confirmou a venda total dos ingressos para a decisão única da Copa Libertadores de 2026. A invasão de torcedores brasileiros promete transformar a capital continental em um mar de bandeiras, fumaça e cantos ininterruptos.

A logística das torcidas organizadas montou pontos de apoio estratégicos para acolher caravanas vindas de todos os cantos do Brasil. Para os elencos, a conquista representa a glória eterna e a garantia de vaga direta nos novos torneios intercontinentais da FIFA.`,
    dataCriacao: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    autor: 'Lucyano • Editor do Termômetro',
    dataLegivel: 'Hoje, há 45 min'
  },
  {
    id: 'post-3',
    titulo: 'Mercado da Bola 2026: Gigantes travam duelo financeiro por reforços de peso internacional',
    subtitulo: 'Investimentos das SAFs e receitas recordes de bilheteria e sócios-torcedores aquecem a janela de transferências com cifras históricas.',
    categoria: 'Mercado da Bola',
    imagemUrl: '/src/assets/images/mercado_bola_signing_1794060295826.jpg',
    conteudo: `O futebol brasileiro se consolidou como a principal potência financeira da América do Sul. Com contratos comerciais renegociados e faturamento em alta nas arenas, as diretorias preparam contratações de impacto que movimentam a imprensa esportiva internacional.

Negociações que antes pareciam inviáveis agora se concretizam em contratos de longo prazo, com jogadores de renome optando pelo protagonismo nos clássicos nacionais e na disputa da Taça Libertadores.`,
    dataCriacao: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    autor: 'Redação Esportiva',
    dataLegivel: 'Hoje, há 2 horas'
  },
  {
    id: 'post-4',
    titulo: 'Mosaicos e Festas nas Arquibancadas: Torcidas brasileiras quebram recordes mundiais de público',
    subtitulo: 'A união entre a paixão popular e as arenas modernas recoloca o Brasil no topo dos espetáculos esportivos globais.',
    categoria: 'Torcidas & Cultura',
    imagemUrl: '/src/assets/images/torcida_mosaico_passion_1794060294535.jpg',
    conteudo: `O espetáculo do futebol no Brasil extrapola as quatro linhas. Os mosaicos 3D, as bandeiras gigantescas e a sincronia das arquibancadas transformaram os estádios nacionais em referências mundiais de fervor esportivo.

O Termômetro da Torcida celebra essa cultura popular, medindo com precisão de 1 voto por CPF qual clube mobiliza a comunidade mais dedicada e apaixonada do país.`,
    dataCriacao: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    autor: 'Lucyano • Editor do Termômetro',
    dataLegivel: 'Hoje, há 3 horas'
  }
];

export const INITIAL_VOTES: Vote[] = [
  { id: '11122233344', nome: 'Rodrigo Silva', time: 'flamengo', timestamp: Date.now() - 1000 * 60 * 12, dataLegivel: 'Há 12 min' },
  { id: '22233344455', nome: 'Ana Paula Ramos', time: 'corinthians', timestamp: Date.now() - 1000 * 60 * 20, dataLegivel: 'Há 20 min' },
  { id: '33344455566', nome: 'Gabriel Barbosa P.', time: 'palmeiras', timestamp: Date.now() - 1000 * 60 * 35, dataLegivel: 'Há 35 min' },
  { id: '44455566677', nome: 'Juliana Costa', time: 'sao-paulo', timestamp: Date.now() - 1000 * 60 * 50, dataLegivel: 'Há 50 min' },
  { id: '55566677788', nome: 'Mateus Oliveira', time: 'flamengo', timestamp: Date.now() - 1000 * 60 * 65, dataLegivel: 'Há 1 hora' },
  { id: '66677788899', nome: 'Beatriz Martins', time: 'vasco', timestamp: Date.now() - 1000 * 60 * 80, dataLegivel: 'Há 1 hora' },
  { id: '77788899900', nome: 'Eduardo Souza', time: 'gremio', timestamp: Date.now() - 1000 * 60 * 95, dataLegivel: 'Há 1 hora' },
  { id: '88899900011', nome: 'Carla Nogueira', time: 'internacional', timestamp: Date.now() - 1000 * 60 * 110, dataLegivel: 'Há 2 horas' },
  { id: '99900011122', nome: 'Felipe Santos', time: 'cruzeiro', timestamp: Date.now() - 1000 * 60 * 130, dataLegivel: 'Há 2 horas' },
  { id: '00011122233', nome: 'Larissa Alencar', time: 'atletico-mg', timestamp: Date.now() - 1000 * 60 * 150, dataLegivel: 'Há 2 horas' },
  { id: '12345678901', nome: 'Thiago Mendes', time: 'botafogo', timestamp: Date.now() - 1000 * 60 * 180, dataLegivel: 'Há 3 horas' },
  { id: '23456789012', nome: 'Camila Ferreira', time: 'fluminense', timestamp: Date.now() - 1000 * 60 * 210, dataLegivel: 'Há 3 horas' },
  { id: '34567890123', nome: 'Vitor Hugo B.', time: 'bahia', timestamp: Date.now() - 1000 * 60 * 240, dataLegivel: 'Há 4 horas' },
  { id: '45678901234', nome: 'Letícia Lima', time: 'palmeiras', timestamp: Date.now() - 1000 * 60 * 300, dataLegivel: 'Há 5 horas' },
  { id: '56789012345', nome: 'Diego Rocha', time: 'flamengo', timestamp: Date.now() - 1000 * 60 * 360, dataLegivel: 'Há 6 horas' },
];
