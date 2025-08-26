import { useState, useEffect } from 'react';
import { FAQ, Categoria, FAQFilters } from '@/types/faq';
import { mockFAQs, mockCategorias } from '@/data/mockData';

export function useFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simula carregamento inicial dos dados
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setFaqs(mockFAQs);
        setCategorias(mockCategorias);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do FAQ');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar FAQs
  const filterFAQs = (filters: FAQFilters) => {
    return faqs.filter(faq => {
      let matches = true;

      if (filters.categoria) {
        matches = matches && faq.categoria === filters.categoria;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        matches = matches && (
          faq.pergunta.toLowerCase().includes(searchLower) ||
          faq.resposta.toLowerCase().includes(searchLower) ||
          faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (filters.status) {
        matches = matches && faq.status === filters.status;
      }

      return matches;
    });
  };

  // CRUD Operations - FAQ
  const createFAQ = async (faqData: Omit<FAQ, 'id' | 'dataCreated' | 'dataUpdated'>) => {
    try {
      const newFAQ: FAQ = {
        ...faqData,
        id: Date.now().toString(),
        dataCreated: new Date(),
        dataUpdated: new Date(),
      };

      setFaqs(prev => [...prev, newFAQ]);
      
      // Aqui você poderia fazer uma chamada para a API
      // await api.createFAQ(newFAQ);
      
      return newFAQ;
    } catch (err) {
      setError('Erro ao criar FAQ');
      throw err;
    }
  };

  const updateFAQ = async (id: string, updates: Partial<FAQ>) => {
    try {
      const updatedFAQ = {
        ...updates,
        dataUpdated: new Date(),
      };

      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, ...updatedFAQ } : faq
      ));

      // Aqui você poderia fazer uma chamada para a API
      // await api.updateFAQ(id, updatedFAQ);
      
      return updatedFAQ;
    } catch (err) {
      setError('Erro ao atualizar FAQ');
      throw err;
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      setFaqs(prev => prev.filter(faq => faq.id !== id));
      
      // Aqui você poderia fazer uma chamada para a API
      // await api.deleteFAQ(id);
    } catch (err) {
      setError('Erro ao deletar FAQ');
      throw err;
    }
  };

  // CRUD Operations - Categorias
  const createCategoria = async (categoriaData: Omit<Categoria, 'id'>) => {
    try {
      const newCategoria: Categoria = {
        ...categoriaData,
        id: Date.now().toString(),
      };

      setCategorias(prev => [...prev, newCategoria]);
      
      // Aqui você poderia fazer uma chamada para a API
      // await api.createCategoria(newCategoria);
      
      return newCategoria;
    } catch (err) {
      setError('Erro ao criar categoria');
      throw err;
    }
  };

  const updateCategoria = async (id: string, updates: Partial<Categoria>) => {
    try {
      setCategorias(prev => prev.map(categoria => 
        categoria.id === id ? { ...categoria, ...updates } : categoria
      ));

      // Aqui você poderia fazer uma chamada para a API
      // await api.updateCategoria(id, updates);
      
      return updates;
    } catch (err) {
      setError('Erro ao atualizar categoria');
      throw err;
    }
  };

  const deleteCategoria = async (id: string) => {
    try {
      setCategorias(prev => prev.filter(categoria => categoria.id !== id));
      
      // Aqui você poderia fazer uma chamada para a API
      // await api.deleteCategoria(id);
    } catch (err) {
      setError('Erro ao deletar categoria');
      throw err;
    }
  };

  // Incrementar visualizações
  const incrementViews = async (faqId: string) => {
    try {
      setFaqs(prev => prev.map(faq => 
        faq.id === faqId 
          ? { ...faq, visualizacoes: (faq.visualizacoes || 0) + 1 }
          : faq
      ));

      // Aqui você poderia fazer uma chamada para a API
      // await api.incrementFAQViews(faqId);
    } catch (err) {
      console.error('Erro ao incrementar visualizações:', err);
    }
  };

  return {
    // Data
    faqs,
    categorias,
    loading,
    error,
    
    // Utilities
    filterFAQs,
    
    // FAQ Operations
    createFAQ,
    updateFAQ,
    deleteFAQ,
    
    // Categoria Operations
    createCategoria,
    updateCategoria,
    deleteCategoria,
    
    // Other
    incrementViews,
  };
}

// Hook específico para estatísticas
export function useFAQStats() {
  const { faqs, categorias } = useFAQ();

  const stats = {
    totalFAQs: faqs.length,
    faqsAtivos: faqs.filter(f => f.status === 'ativo').length,
    faqsInativos: faqs.filter(f => f.status === 'inativo').length,
    totalCategorias: categorias.length,
    categoriasAtivas: categorias.filter(c => c.status === 'ativo').length,
    ultimaAtualizacao: faqs.length > 0 
      ? new Date(Math.max(...faqs.map(f => f.dataUpdated.getTime())))
      : null,
    faqsPorCategoria: categorias.map(categoria => ({
      categoria: categoria.nome,
      total: faqs.filter(f => f.categoria === categoria.nome).length,
      ativos: faqs.filter(f => f.categoria === categoria.nome && f.status === 'ativo').length,
    })),
  };

  return stats;
}
