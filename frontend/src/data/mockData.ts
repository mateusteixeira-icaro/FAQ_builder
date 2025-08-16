import { FAQ, Categoria } from '@/types/faq';

export const mockCategorias: Categoria[] = [
  {
    id: '1',
    nome: 'Conta e Login',
    descricao: 'Questões relacionadas ao acesso e gerenciamento de conta',
    icone: 'User',
    ordem: 1,
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Pagamentos',
    descricao: 'Dúvidas sobre cobrança, faturas e métodos de pagamento',
    icone: 'CreditCard',
    ordem: 2,
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Suporte Técnico',
    descricao: 'Problemas técnicos e resolução de bugs',
    icone: 'Settings',
    ordem: 3,
    status: 'ativo'
  },
  {
    id: '4',
    nome: 'Funcionalidades',
    descricao: 'Como usar as funcionalidades do sistema',
    icone: 'Zap',
    ordem: 4,
    status: 'ativo'
  }
];

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    categoria: 'Conta e Login',
    pergunta: 'Como faço para resetar minha senha?',
    resposta: 'Para resetar sua senha, acesse a página de login e clique em "Esqueci minha senha". Digite seu email e você receberá um link para criar uma nova senha.',
    tags: ['senha', 'login', 'reset'],
    status: 'ativo',
    prioridade: 1,
    autor: 'Admin',
    dataCreated: new Date('2024-01-15'),
    dataUpdated: new Date('2024-01-15'),
    visualizacoes: 150
  },
  {
    id: '2',
    categoria: 'Conta e Login',
    pergunta: 'Posso alterar meu email de cadastro?',
    resposta: 'Sim, você pode alterar seu email acessando Configurações > Perfil > Dados Pessoais. Lembre-se de confirmar o novo email através do link enviado.',
    tags: ['email', 'alterar', 'perfil'],
    status: 'ativo',
    prioridade: 2,
    autor: 'Admin',
    dataCreated: new Date('2024-01-16'),
    dataUpdated: new Date('2024-01-16'),
    visualizacoes: 89
  },
  {
    id: '3',
    categoria: 'Pagamentos',
    pergunta: 'Quais métodos de pagamento são aceitos?',
    resposta: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), débito, PIX, boleto bancário e transferência bancária.',
    tags: ['pagamento', 'métodos', 'cartão'],
    status: 'ativo',
    prioridade: 1,
    autor: 'Admin',
    dataCreated: new Date('2024-01-17'),
    dataUpdated: new Date('2024-01-17'),
    visualizacoes: 203
  },
  {
    id: '4',
    categoria: 'Pagamentos',
    pergunta: 'Como faço para alterar dados da fatura?',
    resposta: 'Para alterar dados da fatura, acesse Configurações > Cobrança > Dados de Faturamento. As alterações serão aplicadas na próxima cobrança.',
    tags: ['fatura', 'dados', 'cobrança'],
    status: 'ativo',
    prioridade: 3,
    autor: 'Admin',
    dataCreated: new Date('2024-01-18'),
    dataUpdated: new Date('2024-01-18'),
    visualizacoes: 76
  },
  {
    id: '5',
    categoria: 'Suporte Técnico',
    pergunta: 'O sistema está lento, o que fazer?',
    resposta: 'Experimente limpar o cache do navegador, desabilitar extensões ou tentar acessar em modo anônimo. Se o problema persistir, entre em contato conosco.',
    tags: ['lentidão', 'performance', 'cache'],
    status: 'ativo',
    prioridade: 2,
    autor: 'Admin',
    dataCreated: new Date('2024-01-19'),
    dataUpdated: new Date('2024-01-19'),
    visualizacoes: 124
  },
  {
    id: '6',
    categoria: 'Funcionalidades',
    pergunta: 'Como exportar relatórios?',
    resposta: 'Para exportar relatórios, acesse a seção Relatórios, selecione o período desejado e clique no botão "Exportar". Você pode escolher entre PDF, Excel ou CSV.',
    tags: ['relatórios', 'exportar', 'pdf'],
    status: 'ativo',
    prioridade: 1,
    autor: 'Admin',
    dataCreated: new Date('2024-01-20'),
    dataUpdated: new Date('2024-01-20'),
    visualizacoes: 95
  }
];