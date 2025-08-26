import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion.tsx';
import { Badge } from '../ui/badge.tsx';
import { FormattedText } from '../ui/FormattedText.tsx';
import { Categoria } from '../../types/faq.ts';
import { cn } from '../../lib/utils.ts';

interface CategoryCardProps {
  categoria: Categoria;
  faqs: any[]; // Using any for compatibility with converted FAQ format
  searchTerm: string;
}

export function CategoryCard({ categoria, faqs, searchTerm }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = faq.categoria === categoria.nome;
    const matchesSearch = searchTerm === '' || 
      faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesCategory && matchesSearch && faq.status === 'ativo';
  });

  if (filteredFAQs.length === 0 && searchTerm !== '') {
    return null;
  }

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

        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="border-t border-border/50">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-border/30">
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
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">
                        By {faq.autor} • {faq.dataUpdated instanceof Date ? faq.dataUpdated.toLocaleDateString('en-US') : new Date(faq.dataUpdated).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}