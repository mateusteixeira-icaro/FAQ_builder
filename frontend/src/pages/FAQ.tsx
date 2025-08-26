import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faSearch, faArrowLeft, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Input } from '../components/ui/input.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Link } from 'react-router-dom';
import { CategoryCard } from '../components/FAQ/CategoryCard.tsx';
import { useCategoriesWithActiveFaqs, useActiveFaqs, useSearchFaqs } from '../hooks/useApi.ts';
import { categoryToCategoria, faqToOldFormat } from '../types/faq.ts';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Fetch data from API
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategoriesWithActiveFaqs();
  const { data: faqs, loading: faqsLoading, error: faqsError } = useActiveFaqs();
  const { data: searchResults, loading: searchLoading } = useSearchFaqs(searchTerm.trim());

  const loading = categoriesLoading || faqsLoading || (searchTerm.trim() && searchLoading);
  const error = categoriesError || faqsError;

  // Convert API data to legacy format for compatibility
  const categoriasAtivas = useMemo(() => {
    return categories ? categories.map(categoryToCategoria) : [];
  }, [categories]);

  const faqsAtivos = useMemo(() => {
    return faqs ? faqs.map(faq => faqToOldFormat(faq, categories)) : [];
  }, [faqs, categories]);

  // Filter results based on search term
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        categorias: categoriasAtivas,
        total: faqsAtivos.length
      };
    }

    if (searchResults) {
      const searchFaqsConverted = searchResults.map(faq => faqToOldFormat(faq, categories));
      const categoriesWithMatchingFaqs = categoriasAtivas.filter(categoria => {
        const categoryFaqs = searchFaqsConverted.filter(faq => faq.categoria === categoria.nome);
        return categoryFaqs.length > 0 || categoria.nome.toLowerCase().includes(searchTerm.toLowerCase());
      });

      return {
        categorias: categoriesWithMatchingFaqs,
        total: searchFaqsConverted.length
      };
    }

    return {
      categorias: [],
      total: 0
    };
  }, [searchTerm, categoriasAtivas, faqsAtivos, searchResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faQuestionCircle} className="icon-action text-primary" />
            </div>
            <div>
              <h1 className="title-1 text-foreground">Cirex Help Center</h1>
              <p className="body-text text-muted-foreground">Find answers to your questions</p>
            </div>
          </div>
          <Link to="/">
            <button className="btn-primary gap-2 flex items-center">
              <FontAwesomeIcon icon={faArrowLeft} className="icon-action" />
              Back
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-action text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for questions, answers or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ds-input pl-10 h-12 w-full body-text"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2 bg-transparent border-none cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <FontAwesomeIcon icon={faTimes} className="icon-action" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="ds-card text-center py-12">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="title-2 mb-2">Loading...</h3>
            <p className="body-text text-muted-foreground">
              Fetching help center information.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="ds-card text-center py-12 border-destructive">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faQuestionCircle} className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="title-2 mb-2 text-destructive">Error loading data</h3>
            <p className="body-text text-muted-foreground mb-4">
              {error}
            </p>
            <button onClick={() => window.location.reload()} className="btn-secondary">
              Try again
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && filteredResults.total === 0 && searchTerm ? (
          <div className="ds-card text-center py-12">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="title-2 mb-2">No results found</h3>
            <p className="body-text text-muted-foreground mb-4">
              Try using different search terms or browse the categories below.
            </p>
            <button onClick={() => setSearchTerm('')} className="btn-accent">
              Clear search
            </button>
          </div>
        ) : !loading && !error ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="ds-card">
                <div className="pb-3">
                  <h4 className="body-text font-medium text-muted-foreground">
                    Total Questions
                  </h4>
                </div>
                <div className="title-1 font-bold text-primary">{faqsAtivos.length}</div>
              </div>
              
              <div className="ds-card">
                <div className="pb-3">
                  <h4 className="body-text font-medium text-muted-foreground">
                    Active Categories
                  </h4>
                </div>
                <div className="title-1 font-bold text-primary">{categoriasAtivas.length}</div>
              </div>

              <div className="ds-card">
                <div className="pb-3">
                  <h4 className="body-text font-medium text-muted-foreground">
                    Last Update
                  </h4>
                </div>
                <div className="title-1 font-bold text-primary">
                  {faqsAtivos.length > 0
                    ? new Date(Math.max(...faqsAtivos.map(f => f.dataUpdated.getTime()))).toLocaleDateString('en-US')
                    : 'N/A'
                  }
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              {filteredResults.categorias.map(categoria => (
                <CategoryCard
                  key={categoria.id}
                  categoria={categoria}
                  faqs={faqsAtivos}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FAQ;