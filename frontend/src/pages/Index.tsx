import { HelpCircle, ArrowRight, FileText, Search, Users } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Link } from 'react-router-dom';

const Index = () => {
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
            Central de Ajuda
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Encontre respostas rápidas para suas dúvidas ou gerencie o conteúdo de FAQ do seu sistema
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/faq">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                <Search className="h-5 w-5" />
                Ver FAQ
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/faq/admin">
              <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                <FileText className="h-5 w-5" />
                Painel Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border/50 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Busca Inteligente</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Encontre respostas rapidamente com nossa busca avançada por perguntas, respostas e tags
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Organização por Categorias</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Navegue facilmente através de categorias organizadas e expansíveis para encontrar o que precisa
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Painel Administrativo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Gerencie facilmente perguntas, respostas e categorias com nosso painel administrativo completo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Sistema FAQ Completo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <p className="text-muted-foreground">Perguntas Frequentes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4</div>
              <p className="text-muted-foreground">Categorias Ativas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Integração Pronta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
