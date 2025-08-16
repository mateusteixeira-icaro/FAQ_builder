import { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Textarea } from '../components/ui/textarea.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.tsx';
import { Label } from '../components/ui/label.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog.tsx';
import { FAQ, Categoria } from '../types/faq.ts';
import { mockFAQs, mockCategorias } from '../data/mockData.ts';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast.ts';

const FAQAdmin = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const filteredFAQs = faqs.filter(faq =>
    faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.resposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveFAQ = (faqData: Partial<FAQ>) => {
    if (editingFAQ) {
      // Edit existing
      const updatedFAQ = {
        ...editingFAQ,
        ...faqData,
        dataUpdated: new Date()
      };
      setFaqs(faqs.map(f => f.id === editingFAQ.id ? updatedFAQ : f));
      toast({
        title: "FAQ atualizada",
        description: "A pergunta foi atualizada com sucesso."
      });
    } else {
      // Create new
      const newFAQ: FAQ = {
        id: Date.now().toString(),
        categoria: faqData.categoria || '',
        pergunta: faqData.pergunta || '',
        resposta: faqData.resposta || '',
        tags: faqData.tags || [],
        status: faqData.status || 'ativo',
        prioridade: faqData.prioridade || 1,
        autor: faqData.autor || 'Admin',
        dataCreated: new Date(),
        dataUpdated: new Date(),
        visualizacoes: 0
      };
      setFaqs([...faqs, newFAQ]);
      toast({
        title: "FAQ criada",
        description: "Nova pergunta adicionada com sucesso."
      });
    }
    setEditingFAQ(null);
    setIsDialogOpen(false);
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
    toast({
      title: "FAQ removida",
      description: "A pergunta foi removida com sucesso."
    });
  };

  const handleSaveCategoria = (catData: Partial<Categoria>) => {
    if (editingCategoria) {
      // Edit existing
      const updatedCategoria = { ...editingCategoria, ...catData };
      setCategorias(categorias.map(c => c.id === editingCategoria.id ? updatedCategoria : c));
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso."
      });
    } else {
      // Create new
      const newCategoria: Categoria = {
        id: Date.now().toString(),
        nome: catData.nome || '',
        descricao: catData.descricao || '',
        icone: catData.icone || 'Folder',
        ordem: catData.ordem || categorias.length + 1,
        status: catData.status || 'ativo'
      };
      setCategorias([...categorias, newCategoria]);
      toast({
        title: "Categoria criada",
        description: "Nova categoria adicionada com sucesso."
      });
    }
    setEditingCategoria(null);
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategoria = (id: string) => {
    setCategorias(categorias.filter(c => c.id !== id));
    toast({
      title: "Categoria removida",
      description: "A categoria foi removida com sucesso."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/faq">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao FAQ
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Painel Administrativo - FAQ</h1>
                <p className="text-muted-foreground">Gerencie perguntas frequentes e categorias</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="faqs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="faqs">Perguntas</TabsTrigger>
            <TabsTrigger value="categorias">Categorias</TabsTrigger>
          </TabsList>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingFAQ(null)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Pergunta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingFAQ ? 'Editar FAQ' : 'Nova FAQ'}
                    </DialogTitle>
                  </DialogHeader>
                  <FAQForm 
                    faq={editingFAQ} 
                    categorias={categorias}
                    onSave={handleSaveFAQ}
                    onCancel={() => {
                      setEditingFAQ(null);
                      setIsDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {filteredFAQs.map(faq => (
                <Card key={faq.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{faq.categoria}</Badge>
                          <Badge variant={faq.status === 'ativo' ? 'default' : 'secondary'}>
                            {faq.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Prioridade: {faq.prioridade}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{faq.pergunta}</h3>
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {faq.resposta}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {faq.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Por {faq.autor} • Atualizado em {faq.dataUpdated.toLocaleDateString('pt-BR')}
                          {faq.visualizacoes && ` • ${faq.visualizacoes} visualizações`}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingFAQ(faq);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFAQ(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categorias" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCategoria(null)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                    </DialogTitle>
                  </DialogHeader>
                  <CategoriaForm 
                    categoria={editingCategoria}
                    onSave={handleSaveCategoria}
                    onCancel={() => {
                      setEditingCategoria(null);
                      setIsCategoryDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {categorias.map(categoria => (
                <Card key={categoria.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-xl">📁</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{categoria.nome}</h3>
                            <Badge variant={categoria.status === 'ativo' ? 'default' : 'secondary'}>
                              {categoria.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {categoria.descricao}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Ordem: {categoria.ordem}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategoria(categoria);
                            setIsCategoryDialogOpen(true);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategoria(categoria.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// FAQ Form Component
function FAQForm({ 
  faq, 
  categorias, 
  onSave, 
  onCancel 
}: {
  faq: FAQ | null;
  categorias: Categoria[];
  onSave: (data: Partial<FAQ>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    categoria: faq?.categoria || '',
    pergunta: faq?.pergunta || '',
    resposta: faq?.resposta || '',
    tags: faq?.tags.join(', ') || '',
    status: faq?.status || 'ativo' as const,
    prioridade: faq?.prioridade || 1,
    autor: faq?.autor || 'Admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.filter(c => c.status === 'ativo').map(categoria => (
                <SelectItem key={categoria.id} value={categoria.nome}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'ativo' | 'inativo') => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pergunta">Pergunta</Label>
        <Input
          id="pergunta"
          value={formData.pergunta}
          onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
          placeholder="Digite a pergunta..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resposta">Resposta</Label>
        <Textarea
          id="resposta"
          value={formData.resposta}
          onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
          placeholder="Digite a resposta..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prioridade">Prioridade</Label>
          <Input
            id="prioridade"
            type="number"
            min="1"
            max="10"
            value={formData.prioridade}
            onChange={(e) => setFormData({ ...formData, prioridade: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="autor">Autor</Label>
          <Input
            id="autor"
            value={formData.autor}
            onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
            placeholder="Nome do autor"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>
    </form>
  );
}

// Category Form Component
function CategoriaForm({ 
  categoria, 
  onSave, 
  onCancel 
}: {
  categoria: Categoria | null;
  onSave: (data: Partial<Categoria>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    nome: categoria?.nome || '',
    descricao: categoria?.descricao || '',
    ordem: categoria?.ordem || 1,
    status: categoria?.status || 'ativo' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Categoria</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Digite o nome da categoria..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Digite a descrição da categoria..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ordem">Ordem</Label>
          <Input
            id="ordem"
            type="number"
            min="1"
            value={formData.ordem}
            onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'ativo' | 'inativo') => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>
    </form>
  );
}

export default FAQAdmin;