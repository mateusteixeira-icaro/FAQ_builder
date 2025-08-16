export interface FAQ {
  id: string;
  categoria: string;
  pergunta: string;
  resposta: string;
  tags: string[];
  status: 'ativo' | 'inativo';
  prioridade: number;
  autor: string;
  dataCreated: Date;
  dataUpdated: Date;
  visualizacoes?: number;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  icone?: string;
  ordem: number;
  status: 'ativo' | 'inativo';
}

export interface FAQFilters {
  categoria?: string;
  search?: string;
  status?: 'ativo' | 'inativo';
}