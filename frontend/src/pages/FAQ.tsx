import { useState, useMemo } from 'react';
import { Search, HelpCircle, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/input.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Link } from 'react-router-dom';
import { CategoryCard } from '../components/FAQ/CategoryCard.tsx';
import { mockFAQs, mockCategorias } from '../data/mockData.ts';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Filter active FAQs and categories
  const faqsAtivos = mockFAQs.filter(faq => faq.status === 'ativo');
  const categoriasAtivas = mockCategorias.filter(cat => cat.status === 'ativo');

  // Filter results based on search term
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        categorias: categoriasAtivas,
        total: faqsAtivos.length
      };
    }

    const searchLower = searchTerm.toLowerCase();
    const matchingFaqs = faqsAtivos.filter(faq => 
      faq.pergunta.toLowerCase().includes(searchLower) ||
      faq.resposta.toLowerCase().includes(searchLower) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );

    const categoriesWithMatchingFaqs = categoriasAtivas.filter(categoria => {
      const categoryFaqs = matchingFaqs.filter(faq => faq.categoria === categoria.nome);
      return categoryFaqs.length > 0 || categoria.nome.toLowerCase().includes(searchLower);
    });

    return {
      categorias: categoriesWithMatchingFaqs,
      total: matchingFaqs.length
    };
  }, [searchTerm, faqsAtivos, categoriasAtivas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Central de Ajuda</h1>
              <p className="text-sm text-muted-foreground">Encontre respostas para suas dúvidas</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por perguntas, respostas ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2"
            >
              ✕
            </Button>
          )}
        </div>

        {/* Main Content */}
        {filteredResults.total === 0 && searchTerm ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente usar outros termos de busca ou navegue pelas categorias abaixo.
              </p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Limpar busca
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    Total de Perguntas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{faqsAtivos.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    Categorias Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{categoriasAtivas.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    Última Atualização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {faqsAtivos.length > 0
                      ? new Date(Math.max(...faqsAtivos.map(f => f.dataUpdated.getTime()))).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </div>
                </CardContent>
              </Card>
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
        )}
      </div>
    </div>
  );
};

export default FAQ;