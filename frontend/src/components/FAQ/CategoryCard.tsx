import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion.tsx';
import { Badge } from '../ui/badge.tsx';
import { FormattedText } from '../ui/FormattedText.tsx';
import { FeedbackButtons } from './FeedbackButtons.tsx';
import { Categoria } from '../../types/faq.ts';
import { apiService } from '../../services/api.ts';


interface CategoryCardProps {
  categoria: Categoria;
  faqs: any[]; // Using any for compatibility with converted FAQ format
  searchTerm: string;
  onFaqUpdate?: () => void; // Callback para atualizar dados
}

export function CategoryCard({ categoria, faqs, searchTerm, onFaqUpdate }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFaqs, setLocalFaqs] = useState(faqs);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  // Atualizar FAQs locais quando props mudarem
  useEffect(() => {
    setLocalFaqs(faqs);
  }, [faqs]);

  const filteredFAQs = localFaqs.filter(faq => {
    const matchesCategory = faq.categoria === categoria.nome;
    const matchesSearch = searchTerm === '' || 
      faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesCategory && matchesSearch && faq.status === 'ativo';
  });

  // FAQs filtrados por categoria e termo de busca



  if (filteredFAQs.length === 0 && searchTerm !== '') {
    return null;
  }

  const handleFaqExpand = async (faqId: number) => {
    if (!expandedFaqs.has(faqId)) {
      try {
        await apiService.incrementFaqViews(faqId);
        setExpandedFaqs(prev => new Set([...prev, faqId]));
      } catch (error) {
        console.error('Erro ao incrementar visualizações:', error);
      }
    }
  };

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-accent text-accent-foreground rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div>
      <Card className="overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300">
        <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full p-6 justify-between text-left hover:bg-accent/50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faSearchPlus} className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{categoria.nome}</h3>
              <p className="text-sm text-muted-foreground">{categoria.descricao}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
            </Badge>
            {isExpanded ? (
              <FontAwesomeIcon icon={faChevronDown} className="h-5 w-5 text-muted-foreground" />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </Button>

        {isExpanded && filteredFAQs.length > 0 && (
          <div className="overflow-hidden">
          <div className="border-t border-border/50">
            <Accordion 
              type="single" 
              className="w-full"
              onValueChange={(value) => {
                if (value) {
                  const faqId = parseInt(value);
                  handleFaqExpand(faqId);
                }
              }}
            >
              {filteredFAQs.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id.toString()} className="border-border/30">
                  <AccordionTrigger className="px-6 py-4 hover:bg-muted/30 text-left">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {highlightText(faq.pergunta)}
                      </h4>
                      <div className="flex gap-1 mt-2">
                        {faq.tags && faq.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="prose prose-sm max-w-none">
                      <FormattedText 
                        text={faq.resposta} 
                        className="text-muted-foreground" 
                        enableMarkdown={true}
                      />
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                      <FeedbackButtons faqId={faq.id} />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          By {faq.autor} • {faq.dataUpdated instanceof Date ? faq.dataUpdated.toLocaleDateString('en-US') : new Date(faq.dataUpdated).toLocaleDateString('en-US')}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
}