import { useState, useEffect, useCallback } from 'react';
import { apiService, Category, FAQ } from '../services/api.ts';
import { useToast } from './use-toast.ts';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

// Hook genérico para chamadas de API
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState({ data: null, loading: false, error: errorMessage });
      
      toast({
        title: 'API Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Hook específico para categorias
export function useCategories() {
  return useApi(() => apiService.getCategories());
}

// Hook específico para categorias com FAQs ativos
export function useCategoriesWithActiveFaqs() {
  return useApi(() => apiService.getCategoriesWithActiveFaqs());
}

// Hook específico para FAQs
export function useFaqs() {
  return useApi(() => apiService.getFaqs());
}

// Hook específico para FAQs ativos
export function useActiveFaqs() {
  return useApi(() => apiService.getActiveFaqs());
}

// Hook para FAQs por categoria
export function useFaqsByCategory(categoryId: string | null) {
  return useApi(
    () => categoryId ? apiService.getFaqsByCategory(categoryId) : Promise.resolve([]),
    [categoryId]
  );
}

// Hook para busca de FAQs
export function useSearchFaqs(searchTerm: string) {
  return useApi(
    () => searchTerm ? apiService.searchFaqs(searchTerm) : Promise.resolve([]),
    [searchTerm]
  );
}

// Hook para FAQs mais visualizados
export function useMostViewedFaqs(limit: number = 10) {
  return useApi(() => apiService.getMostViewedFaqs(limit), [limit]);
}

// Hook para FAQs recentes
export function useRecentFaqs(limit: number = 10) {
  return useApi(() => apiService.getRecentFaqs(limit), [limit]);
}

// Hook para operações de mutação (criar, atualizar, deletar)
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
  }>({ loading: false, error: null });

  const { toast } = useToast();

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    setState({ loading: true, error: null });
    
    try {
      const result = await mutationFn(variables);
      setState({ loading: false, error: null });
      
      toast({
        title: 'Success',
        description: 'Operation completed successfully!',
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState({ loading: false, error: errorMessage });
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  }, [mutationFn, toast]);

  return {
    ...state,
    mutate,
  };
}

// Hooks específicos para mutações
export function useCreateCategory() {
  return useApiMutation((category: Omit<Category, 'id'>) => 
    apiService.createCategory(category)
  );
}

export function useUpdateCategory() {
  return useApiMutation(({ id, ...category }: { id: string } & Partial<Category>) => 
    apiService.updateCategory(id, category)
  );
}

export function useDeleteCategory() {
  return useApiMutation((id: string) => apiService.deleteCategory(id));
}

export function useCreateFaq() {
  return useApiMutation((faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => 
    apiService.createFaq(faq)
  );
}

export function useUpdateFaq() {
  return useApiMutation(({ id, ...faq }: { id: string } & Partial<FAQ>) => 
    apiService.updateFaq(id, faq)
  );
}

export function useDeleteFaq() {
  return useApiMutation((id: string) => apiService.deleteFaq(id));
}

export function useUpdateFaqStatus() {
  return useApiMutation(({ id, isActive }: { id: string; isActive: boolean }) => 
    apiService.updateFaqStatus(id, isActive)
  );
}