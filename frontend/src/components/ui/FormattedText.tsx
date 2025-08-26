import React from 'react';
import { cn } from '../../lib/utils.ts';

interface FormattedTextProps {
  text: string;
  className?: string;
  enableMarkdown?: boolean;
}

export function FormattedText({ text, className, enableMarkdown = true }: FormattedTextProps) {
  if (!text) return null;

  const formatText = (content: string) => {
    if (!enableMarkdown) {
      // Apenas preserva quebras de linha
      return content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }

    // Processa o texto linha por linha para suportar markdown básico
    const lines = content.split('\n');
    const processedLines: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        listKey++;
        if (listType === 'ol') {
          processedLines.push(
            <ol key={`list-${listKey}`} className="list-decimal list-inside ml-4 space-y-1 my-2">
              {currentList}
            </ol>
          );
        } else {
          processedLines.push(
            <ul key={`list-${listKey}`} className="list-disc list-inside ml-4 space-y-1 my-2">
              {currentList}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Verifica se é um bullet point (suporta -, *, •, e números)
      const bulletMatch = trimmedLine.match(/^([•\-\*]|\d+\.)\s+(.*)$/);
      
      if (bulletMatch) {
        const isNumbered = /^\d+\./.test(trimmedLine);
        const newListType = isNumbered ? 'ol' : 'ul';
        
        // Se mudou o tipo de lista, fecha a anterior
        if (listType && listType !== newListType) {
          flushList();
        }
        
        listType = newListType;
        const bulletText = bulletMatch[2];
        currentList.push(
          <li key={`bullet-${i}`} className="leading-relaxed">
            {bulletText}
          </li>
        );
      } else {
        // Se estava em uma lista e agora não é mais bullet, fecha a lista
        flushList();
        
        // Linha normal
        if (trimmedLine === '') {
          // Adiciona espaçamento entre parágrafos
          processedLines.push(<div key={`space-${i}`} className="h-2" />);
        } else {
          // Verifica se é um título (linha que termina com :)
          if (trimmedLine.endsWith(':') && trimmedLine.length > 1) {
            processedLines.push(
              <div key={`title-${i}`} className="font-semibold text-foreground mt-3 mb-1">
                {trimmedLine}
              </div>
            );
          } else {
            processedLines.push(
              <div key={`line-${i}`} className="leading-relaxed">
                {line}
              </div>
            );
          }
        }
      }
    }

    // Fecha a lista se terminou com bullets
    flushList();

    return processedLines;
  };

  return (
    <div className={cn('whitespace-pre-wrap', className)}>
      {formatText(text)}
    </div>
  );
}

export default FormattedText;