import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faEye, faThumbsUp, faThumbsDown, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { Button } from '../components/ui/button.tsx';
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination.tsx';

interface ViewStats {
  id: string;
  question: string;
  answer: string;
  viewCount: number;
  category: string;
}

interface FeedbackStats {
  totalFeedbacks: number;
  totalPositive: number;
  totalNegative: number;
  mostLiked: [string, string, number][];
  leastLiked: [string, string, number][];
}

const Feedback = () => {
  const [viewStats, setViewStats] = useState<ViewStats[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewPage, setViewPage] = useState(1);
  const [positivePage, setPositivePage] = useState(1);
  const [negativePage, setNegativePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas de visualizações
        const viewResponse = await fetch('http://localhost:8080/api/faqs/view-stats?limit=50');
        if (!viewResponse.ok) {
          throw new Error('Error loading view statistics');
        }
        const viewData = await viewResponse.json();
        setViewStats(viewData);
        
        // Buscar estatísticas de feedback
        const feedbackResponse = await fetch('http://localhost:8080/api/feedback/admin/stats');
        if (!feedbackResponse.ok) {
          throw new Error('Error loading feedback statistics');
        }
        const feedbackData = await feedbackResponse.json();
        setFeedbackStats(feedbackData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 animate-spin" />
              <span className="body-text">Loading statistics...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="body-text text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="icon-action text-primary" />
            </div>
            <div>
              <h1 className="title-1 text-foreground">Feedback & Analytics</h1>
              <p className="body-text text-muted-foreground">User views and feedback</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Layout dividido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - View Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} className="h-5 w-5 text-blue-600" />
                  Most Viewed FAQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewStats && viewStats.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {viewStats
                        .slice((viewPage - 1) * itemsPerPage, viewPage * itemsPerPage)
                        .map((item, index) => {
                          const globalIndex = (viewPage - 1) * itemsPerPage + index;
                          return (
                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">#{globalIndex + 1}</Badge>
                                  <Badge variant="secondary">{item.category}</Badge>
                                </div>
                                <p className="font-medium text-sm mb-1">{item.question}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{item.answer}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-lg font-bold text-blue-600">{item.viewCount}</p>
                                <p className="text-xs text-muted-foreground">views</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    {/* Pagination for Views */}
                    {viewStats.length > itemsPerPage && (
                      <Pagination className="mt-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setViewPage(Math.max(1, viewPage - 1))}
                              className={viewPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.ceil(viewStats.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setViewPage(page)}
                                isActive={page === viewPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setViewPage(Math.min(Math.ceil(viewStats.length / itemsPerPage), viewPage + 1))}
                              className={viewPage === Math.ceil(viewStats.length / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No views found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Feedback Statistics */}
          <div className="space-y-6">
            {/* General Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faThumbsUp} className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Positive</p>
                      <p className="text-xl font-bold text-green-600">{feedbackStats?.totalPositive || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faThumbsDown} className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Negative</p>
                      <p className="text-xl font-bold text-red-600">{feedbackStats?.totalNegative || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Most Liked FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faThumbsUp} className="h-5 w-5 text-green-600" />
                  Most Liked FAQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackStats?.mostLiked && feedbackStats.mostLiked.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {feedbackStats.mostLiked
                        .slice((positivePage - 1) * itemsPerPage, positivePage * itemsPerPage)
                        .map((item, index) => {
                          const globalIndex = (positivePage - 1) * itemsPerPage + index;
                          return (
                            <div key={item[0]} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">#{globalIndex + 1}</Badge>
                                  <span className="text-sm text-muted-foreground">ID: {item[0]}</span>
                                </div>
                                <p className="font-medium text-sm">{item[1]}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">{item[2]}</p>
                                <p className="text-xs text-muted-foreground">likes</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    {/* Pagination for Most Liked FAQs */}
                    {feedbackStats.mostLiked.length > itemsPerPage && (
                      <Pagination className="mt-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setPositivePage(Math.max(1, positivePage - 1))}
                              className={positivePage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.ceil(feedbackStats.mostLiked.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setPositivePage(page)}
                                isActive={page === positivePage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setPositivePage(Math.min(Math.ceil(feedbackStats.mostLiked.length / itemsPerPage), positivePage + 1))}
                              className={positivePage === Math.ceil(feedbackStats.mostLiked.length / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No positive feedback found</p>
                )}
              </CardContent>
            </Card>

            {/* Least Liked FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faThumbsDown} className="h-5 w-5 text-red-600" />
                  Least Liked FAQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackStats?.leastLiked && feedbackStats.leastLiked.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {feedbackStats.leastLiked
                        .slice((negativePage - 1) * itemsPerPage, negativePage * itemsPerPage)
                        .map((item, index) => {
                          const globalIndex = (negativePage - 1) * itemsPerPage + index;
                          return (
                            <div key={item[0]} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">#{globalIndex + 1}</Badge>
                                  <span className="text-sm text-muted-foreground">ID: {item[0]}</span>
                                </div>
                                <p className="font-medium text-sm">{item[1]}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-red-600">{item[2]}</p>
                                <p className="text-xs text-muted-foreground">dislikes</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    {/* Pagination for Least Liked FAQs */}
                    {feedbackStats.leastLiked.length > itemsPerPage && (
                      <Pagination className="mt-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setNegativePage(Math.max(1, negativePage - 1))}
                              className={negativePage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.ceil(feedbackStats.leastLiked.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setNegativePage(page)}
                                isActive={page === negativePage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setNegativePage(Math.min(Math.ceil(feedbackStats.leastLiked.length / itemsPerPage), negativePage + 1))}
                              className={negativePage === Math.ceil(feedbackStats.leastLiked.length / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No negative feedback found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;