const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  details?: string;
  timestamp: string;
  status: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Erro na comunicação com o servidor',
          status: response.status
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Se a resposta estiver vazia (204 No Content), retorna null
      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos para Categories
  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  async getCategoryById(id: string) {
    return this.request<Category>(`/categories/${id}`);
  }

  async getCategoriesWithActiveFaqs() {
    return this.request<Category[]>('/categories/with-faqs');
  }

  async searchCategories(term: string) {
    return this.request<Category[]>(`/categories/search?q=${encodeURIComponent(term)}`);
  }

  async createCategory(category: Omit<Category, 'id'>) {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: Partial<Category>) {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string) {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async categoryExists(id: string) {
    return this.request<{ exists: boolean }>(`/categories/${id}/exists`);
  }

  // Métodos para FAQs
  async getFaqs() {
    return this.request<Faq[]>('/faqs');
  }

  async getActiveFaqs() {
    return this.request<Faq[]>('/faqs');
  }

  async getFaqById(id: string) {
    return this.request<Faq>(`/faqs/${id}`);
  }

  async getFaqsByCategory(categoryId: string) {
    return this.request<Faq[]>(`/faqs/category/${categoryId}`);
  }

  async searchFaqs(term: string) {
    return this.request<Faq[]>(`/faqs/search?q=${encodeURIComponent(term)}`);
  }

  async getMostViewedFaqs(limit: number = 10) {
    return this.request<Faq[]>(`/faqs/most-viewed?limit=${limit}`);
  }

  async getRecentFaqs(limit: number = 10) {
    return this.request<Faq[]>(`/faqs/recent?limit=${limit}`);
  }

  async getRelatedFaqs(faqId: string, limit: number = 5) {
    return this.request<Faq[]>(`/faqs/${faqId}/related?limit=${limit}`);
  }

  async createFaq(faq: Omit<Faq, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) {
    return this.request<Faq>('/faqs', {
      method: 'POST',
      body: JSON.stringify(faq),
    });
  }

  async updateFaq(id: string, faq: Partial<Faq>) {
    return this.request<Faq>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faq),
    });
  }

  async updateFaqStatus(id: string, isActive: boolean) {
    return this.request<Faq>(`/faqs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteFaq(id: string) {
    return this.request<void>(`/faqs/${id}`, {
      method: 'DELETE',
    });
  }

  async incrementFaqViews(id: string) {
    return this.request<void>(`/faqs/${id}/view`, {
      method: 'POST',
    });
  }
}

// Interfaces que correspondem ao backend
export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  displayOrder: number;
}

export interface Faq {
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

export const apiService = new ApiService();
export default apiService;