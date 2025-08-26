import { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, Save, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Textarea } from '../components/ui/textarea.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.tsx';
import { Label } from '../components/ui/label.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog.tsx';
import { FormattedText } from '../components/ui/FormattedText.tsx';
import { FAQ, Categoria, Category, faqToOldFormat, categoryToCategoria } from '../types/faq.ts';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast.ts';
import { 
  useFaqs, 
  useCategories, 
  useCreateFaq, 
  useUpdateFaq, 
  useDeleteFaq, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory,
  useUpdateFaqStatus
} from '../hooks/useApi.ts';

const FAQAdmin = () => {
  const { toast } = useToast();
  
  // API hooks
  const { data: faqsData, loading: faqsLoading, error: faqsError, refetch: refetchFaqs } = useFaqs();
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  
  // Mutation hooks
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();
  const updateFaqStatus = useUpdateFaqStatus();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // Convert API data to legacy format for compatibility
  const faqs = faqsData ? faqsData.map(faq => faqToOldFormat(faq, categoriesData)) : [];
  const categorias = categoriesData ? categoriesData.map(categoryToCategoria) : [];
  
  const loading = faqsLoading || categoriesLoading;
  const error = faqsError || categoriesError;

  const filteredFAQs = faqs.filter(faq =>
    faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.resposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveFAQ = async (faqData: Partial<any>) => {
    try {
      if (editingFAQ) {
        // Edit existing
        const categoryName = categorias.find(c => c.nome === faqData.categoria)?.nome || faqData.categoria;
        const categoryId = categoriesData?.find(c => c.name === categoryName)?.id || '';
        
        const updateData = {
          id: editingFAQ.id,
          categoryId,
          question: faqData.pergunta,
          answer: faqData.resposta,
          tags: faqData.tags || [],
          isActive: faqData.status === 'ativo',
          priority: faqData.prioridade || 1,
          author: faqData.autor || 'Admin'
        };
        
        const result = await updateFaq.mutate(updateData);
        if (result) {
          await refetchFaqs();
          toast({
            title: "FAQ atualizada",
            description: "A pergunta foi atualizada com sucesso."
          });
          setEditingFAQ(null);
          setIsDialogOpen(false);
        }
      } else {
        // Create new
        const categoryName = faqData.categoria;
        const categoryId = categoriesData?.find(c => c.name === categoryName)?.id || '';
        
        const newFaqData = {
          categoryId,
          question: faqData.pergunta,
          answer: faqData.resposta,
          tags: faqData.tags || [],
          isActive: faqData.status === 'ativo',
          priority: faqData.prioridade || 1,
          author: faqData.autor || 'Admin'
        };
        
        const result = await createFaq.mutate(newFaqData);
        if (result) {
          await refetchFaqs();
          toast({
            title: "FAQ criada",
            description: "Nova pergunta adicionada com sucesso."
          });
          setEditingFAQ(null);
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar FAQ:', error);
    }
  };

  const handleDeleteFAQ = (id: string) => {
    deleteFaq.mutate(id, {
      onSuccess: () => {
        refetchFaqs();
        toast({
          title: "FAQ removida",
          description: "A pergunta foi removida com sucesso."
        });
      }
    });
  };

  const handleSaveCategoria = async (catData: Partial<Categoria>) => {
    try {
      if (editingCategoria) {
        // Edit existing
        const result = await updateCategory.mutate({
          id: editingCategoria.id,
          name: catData.nome || editingCategoria.nome,
          description: catData.descricao || editingCategoria.descricao,
          displayOrder: catData.ordem || editingCategoria.ordem
        });
        
        if (result) {
          await refetchCategories();
          toast({
            title: "Categoria atualizada",
            description: "A categoria foi atualizada com sucesso."
          });
          setEditingCategoria(null);
          setIsCategoryDialogOpen(false);
        }
      } else {
        // Create new
        const result = await createCategory.mutate({
          name: catData.nome || '',
          description: catData.descricao || '',
          displayOrder: catData.ordem || categorias.length + 1
        });
        
        if (result) {
          await refetchCategories();
          toast({
            title: "Categoria criada",
            description: "Nova categoria adicionada com sucesso."
          });
          setEditingCategoria(null);
          setIsCategoryDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleDeleteCategoria = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        refetchCategories();
        toast({
          title: "Categoria removida",
          description: "A categoria foi removida com sucesso."
        });
      }
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
        {(faqsLoading || categoriesLoading) && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Carregando dados...</span>
            </div>
          </div>
        )}

        {(faqsError || categoriesError) && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-destructive">Erro ao carregar dados</p>
            <Button 
              onClick={() => {
                refetchFaqs();
                refetchCategories();
              }}
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!faqsLoading && !categoriesLoading && !faqsError && !categoriesError && (
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
                        <div className="text-muted-foreground mb-3 line-clamp-3">
                          <FormattedText 
                            text={faq.resposta} 
                            className="" 
                            enableMarkdown={true}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {faq.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Por {faq.autor} • Atualizado em {faq.dataUpdated instanceof Date ? faq.dataUpdated.toLocaleDateString('pt-BR') : new Date(faq.dataUpdated).toLocaleDateString('pt-BR')}
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
        )}
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

  // Função para atualizar tags quando categoria muda
  const updateTagsWithCategory = (selectedCategory: string) => {
    if (!selectedCategory) return '';
    
    // Limpa o campo de tags e mantém apenas a categoria selecionada
    return selectedCategory;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar se a resposta tem pelo menos 10 caracteres
    if (formData.resposta.length < 10) {
      return; // Não enviar o formulário se a validação falhar
    }
    
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => {
              const updatedTags = updateTagsWithCategory(value);
              setFormData({ 
                ...formData, 
                categoria: value,
                tags: updatedTags
              });
            }}
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
        <div className="flex justify-between items-center">
          <Label htmlFor="resposta">Resposta</Label>
          <span className={`text-sm ${
            formData.resposta.length > 3000 
              ? 'text-red-500 font-medium' 
              : formData.resposta.length > 2700 
                ? 'text-yellow-600' 
                : formData.resposta.length < 10
                  ? 'text-red-500 font-medium'
                  : 'text-muted-foreground'
          }`}>
            {formData.resposta.length < 10 
              ? `Mínimo 10 caracteres (${10 - formData.resposta.length} restantes)`
              : `${3000 - formData.resposta.length} caracteres restantes`
            }
          </span>
        </div>
        <Textarea
          id="resposta"
          value={formData.resposta}
          onChange={(e) => {
            if (e.target.value.length <= 3000) {
              setFormData({ ...formData, resposta: e.target.value });
            }
          }}
          placeholder="Digite a resposta... (mínimo 10 caracteres)"
          rows={4}
          required
          minLength={10}
          maxLength={3000}
        />
        {formData.resposta.length > 0 && formData.resposta.length < 10 && (
          <p className="text-sm text-red-500">
            A resposta deve ter pelo menos 10 caracteres.
          </p>
        )}
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
        <Button 
          type="submit" 
          disabled={formData.resposta.length < 10 || formData.pergunta.length < 5}
        >
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