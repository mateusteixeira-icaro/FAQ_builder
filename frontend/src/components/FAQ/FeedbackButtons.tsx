import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button.tsx';
import { cn } from '../../lib/utils.ts';

interface FeedbackButtonsProps {
  faqId: string;
  className?: string;
}

interface FeedbackStats {
  positiveCount: number;
  negativeCount: number;
  userFeedback: 'POSITIVE' | 'NEGATIVE' | null;
}

export function FeedbackButtons({ faqId, className }: FeedbackButtonsProps) {
  const [stats, setStats] = useState<FeedbackStats>({
    positiveCount: 0,
    negativeCount: 0,
    userFeedback: null
  });
  const [loading, setLoading] = useState(false);

  const loadFeedbackStats = useCallback(() => {
    // Carregar estatísticas gerais
    fetch(`http://localhost:8080/api/feedback/faq/${faqId}/stats`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return null;
      })
      .then(statsData => {
        if (statsData) {
          setStats(prev => ({
            ...prev,
            positiveCount: statsData.positive || 0,
            negativeCount: statsData.negative || 0
          }));
        }
      })
      .catch(() => {
        // Silenciar erros de rede
      });

    // Verificar se o usuário já deu feedback
    fetch(`http://localhost:8080/api/feedback/faq/${faqId}/user`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          // 404 é esperado quando não há feedback do usuário
          return null;
        }
        // Não fazer throw para evitar logs desnecessários no console
        return null;
      })
      .then(userData => {
        setStats(prev => ({
          ...prev,
          userFeedback: userData ? userData.feedbackType || null : null
        }));
      })
      .catch(() => {
        // Silenciar erros de rede
        setStats(prev => ({
          ...prev,
          userFeedback: null
        }));
      });
  }, [faqId]);

  // Load feedback statistics when component mounts
  useEffect(() => {
    loadFeedbackStats();
  }, [loadFeedbackStats]);

  const handleFeedback = async (type: 'POSITIVE' | 'NEGATIVE') => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faqId: faqId,
          feedbackType: type
        })
      });

      if (response.ok) {
        // Recarregar estatísticas após enviar feedback
        await loadFeedbackStats();
      } else {
        console.error('Erro ao enviar feedback');
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm text-muted-foreground">Was this article helpful?</span>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback('POSITIVE')}
          disabled={loading}
          className={cn(
            "h-8 px-3 transition-all duration-200",
            stats.userFeedback === 'POSITIVE'
              ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
              : "hover:bg-muted"
          )}
        >
          <FontAwesomeIcon 
            icon={faThumbsUp} 
            className={cn(
              "h-4 w-4",
              stats.userFeedback === 'POSITIVE' ? "text-green-600" : "text-muted-foreground"
            )} 
          />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback('NEGATIVE')}
          disabled={loading}
          className={cn(
            "h-8 px-3 transition-all duration-200",
            stats.userFeedback === 'NEGATIVE'
              ? "bg-gray-200 text-gray-600 hover:bg-gray-300 border border-gray-400"
              : "hover:bg-muted"
          )}
        >
          <FontAwesomeIcon 
            icon={faThumbsDown} 
            className={cn(
              "h-4 w-4",
              stats.userFeedback === 'NEGATIVE' ? "text-gray-600" : "text-muted-foreground"
            )} 
          />
        </Button>
      </div>

      <span className="text-sm text-muted-foreground">
        Users who found this helpful: {stats.positiveCount} of {stats.positiveCount + stats.negativeCount}
      </span>
    </div>
  );
}