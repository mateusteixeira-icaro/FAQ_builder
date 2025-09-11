-- Script para corrigir problemas de codificação UTF-8 no banco de dados
-- Executar este script para corrigir caracteres especiais

-- Corrigir categorias
UPDATE categories SET 
    name = 'Suporte Técnico',
    description = 'Questões relacionadas a problemas técnicos'
WHERE id = 3;

UPDATE categories SET 
    description = 'Dúvidas sobre cobrança e pagamentos'
WHERE id = 4;

UPDATE categories SET 
    description = 'Informações sobre gerenciamento de conta de usuário'
WHERE id = 5;

-- Corrigir FAQs
UPDATE faqs SET 
    question = 'Como faço para criar uma conta?',
    answer = 'Para criar uma conta, clique no botão "Registrar" no canto superior direito da página inicial e preencha o formulário com suas informações pessoais.'
WHERE id = 12;

UPDATE faqs SET 
    question = 'Esqueci minha senha, como posso recuperá-la?',
    answer = 'Clique em "Esqueci minha senha" na página de login e siga as instruções enviadas para seu email cadastrado.'
WHERE id = 13;

UPDATE faqs SET 
    question = 'Como posso alterar meu email cadastrado?',
    answer = 'Acesse "Meu Perfil" no menu do usuário e clique em "Editar Informações" para alterar seu email.'
WHERE id = 14;

UPDATE faqs SET 
    question = 'O sistema está lento, o que posso fazer?',
    answer = 'Verifique sua conexão com a internet e tente limpar o cache do navegador. Se o problema persistir, entre em contato conosco.'
WHERE question LIKE '%sistema est%lento%';

UPDATE faqs SET 
    question = 'Como entro em contato com o suporte técnico?',
    answer = 'Você pode entrar em contato através do email suporte@empresa.com ou pelo telefone (11) 1234-5678 em horário comercial.'
WHERE question LIKE '%contato%suporte%';

UPDATE faqs SET 
    question = 'Posso cancelar minha assinatura a qualquer momento?',
    answer = 'Sim, você pode cancelar sua assinatura a qualquer momento através da área "Minha Conta" > "Gerenciar Assinatura".'
WHERE question LIKE '%cancelar%assinatura%';

UPDATE faqs SET 
    question = 'Como faço para atualizar meus dados de pagamento?',
    answer = 'Acesse "Minha Conta" > "Métodos de Pagamento" e clique em "Adicionar" ou "Editar" para atualizar suas informações.'
WHERE question LIKE '%atualizar%dados%pagamento%';

UPDATE faqs SET 
    question = 'Existe um aplicativo móvel disponível?',
    answer = 'Sim, nosso aplicativo está disponível para iOS e Android. Você pode baixá-lo nas respectivas lojas de aplicativos.'
WHERE question LIKE '%aplicativo%';

UPDATE faqs SET 
    question = 'Como posso excluir minha conta permanentemente?',
    answer = 'Para excluir sua conta permanentemente, entre em contato conosco através do suporte. Esta ação não pode ser desfeita.'
WHERE question LIKE '%excluir%conta%';

UPDATE faqs SET 
    question = 'Quais são os métodos de pagamento aceitos?',
    answer = 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), débito e PIX. Todos os pagamentos são processados com segurança.'
WHERE question LIKE '%métodos%pagamento%';

-- Verificar se as correções foram aplicadas
SELECT 'Categorias corrigidas:' as status;
SELECT id, name, description FROM categories WHERE id IN (3, 4, 5);

SELECT 'FAQs corrigidas:' as status;
SELECT id, question FROM faqs WHERE id BETWEEN 12 AND 21 ORDER BY id;