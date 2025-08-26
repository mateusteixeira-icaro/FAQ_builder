import { HelpCircle, ArrowRight, Search, Users } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Link } from 'react-router-dom';
import { useCategoriesWithActiveFaqs, useActiveFaqs } from '../hooks/useApi.ts';

const Index = () => {
  // Fetch real data for counters
  const { data: categories } = useCategoriesWithActiveFaqs();
  const { data: faqs } = useActiveFaqs();
  
  const totalFaqs = faqs?.length || 0;
  const totalCategories = categories?.length || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Cirex Help Center
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find quick answers to your questions with our comprehensive FAQ system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/faq"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              View FAQ
            </Link>
            <Link
              to="/faq/admin"
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-white transition-colors"
            >
              <Users className="mr-2 h-5 w-5" />
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Features Cards */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <Card className="border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Search</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Find answers quickly with our advanced search through questions, answers and tags
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Category Organization</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Navigate easily through organized and expandable categories to find what you need
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Complete FAQ System
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{totalFaqs}</div>
                <p className="text-muted-foreground">Frequently Asked Questions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{totalCategories}</div>
                <p className="text-muted-foreground">Active Categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
