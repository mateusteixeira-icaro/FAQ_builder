// Interfaces que correspondem ao backend Spring Boot
export interface FAQ {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  tags: string[];
  isActive: boolean;
  priority: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  displayOrder: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQFilters {
  categoryId?: string;
  search?: string;
  active?: boolean;
}

// Interfaces para compatibilidade com código existente
export interface Categoria extends Category {
  nome: string;
  descricao: string;
  icone?: string;
  ordem: number;
  status: 'ativo' | 'inativo';
}

// Função para converter Category para Categoria (compatibilidade)
export function categoryToCategoria(category: Category): Categoria {
  return {
    ...category,
    nome: category.name,
    descricao: category.description,
    icone: category.icon,
    ordem: category.displayOrder,
    status: (category.active !== false) ? 'ativo' : 'inativo'
  };
}

// Função para converter FAQ do backend para formato antigo (compatibilidade)
export function faqToOldFormat(faq: FAQ, categories?: Category[]): any {
  // Encontra o nome da categoria pelo ID
  const categoryName = categories?.find(cat => cat.id === faq.categoryId)?.name || faq.categoryId;
  
  // Função auxiliar para converter string ISO para Date válida
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    // Se a string já está no formato correto, usa diretamente
    const date = new Date(dateString);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return new Date();
    }
    
    return date;
  };
  
  return {
    id: faq.id,
    categoria: categoryName,
    pergunta: faq.question,
    resposta: faq.answer,
    tags: faq.tags || [],
    status: faq.isActive ? 'ativo' : 'inativo',
    prioridade: faq.priority,
    autor: faq.author,
    dataCreated: parseDate(faq.createdAt),
    dataUpdated: parseDate(faq.updatedAt),
    visualizacoes: faq.viewCount
  };
}