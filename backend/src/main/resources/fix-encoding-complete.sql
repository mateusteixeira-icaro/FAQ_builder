-- Script para corrigir completamente a codificação UTF-8 no banco de dados
-- Este script corrige todos os dados com problemas de codificação

-- Configurar codificação da sessão
SET client_encoding = 'UTF8';

-- Corrigir FAQs com problemas de codificação
UPDATE faqs SET 
    question = 'Como faço para criar uma conta?',
    answer = 'Para criar uma conta, clique no botão "Registrar" no canto superior direito da página inicial e preencha o formulário com suas informações pessoais.'
WHERE id = 1;

UPDATE faqs SET 
    question = 'Esqueci minha senha, como posso recuperá-la?',
    answer = 'Clique em "Esqueci minha senha" na página de login e siga as instruções enviadas para seu email cadastrado.'
WHERE id = 2;

UPDATE faqs SET 
    question = 'Como posso alterar meus dados pessoais?',
    answer = 'Acesse "Meu Perfil" no menu do usuário e clique em "Editar Informações" para alterar seus dados pessoais.'
WHERE id = 3;

UPDATE faqs SET 
    question = 'O sistema está lento, o que fazer?',
    answer = 'Verifique sua conexão com a internet e tente limpar o cache do navegador. Se o problema persistir, entre em contato conosco.'
WHERE id = 4;

UPDATE faqs SET 
    question = 'Não consigo fazer login, o que pode ser?',
    answer = 'Verifique se está usando o email e senha corretos. Certifique-se de que o Caps Lock não está ativado.'
WHERE id = 5;

UPDATE faqs SET 
    question = 'Como entrar em contato com o suporte?',
    answer = 'Você pode nos contatar através do chat online, email suporte@exemplo.com ou telefone (11) 1234-5678.'
WHERE id = 6;

UPDATE faqs SET 
    question = 'Por que não consigo acessar certas funcionalidades?',
    answer = 'Algumas funcionalidades podem estar restritas ao seu plano atual. Verifique as permissões da sua conta ou considere fazer upgrade.'
WHERE id = 7;

UPDATE faqs SET 
    question = 'Como visualizar minha fatura?',
    answer = 'Acesse a seção "Faturamento" no seu painel de controle para visualizar e baixar suas faturas.'
WHERE id = 8;

UPDATE faqs SET 
    question = 'Quais formas de pagamento são aceitas?',
    answer = 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), PIX e boleto bancário.'
WHERE id = 9;

UPDATE faqs SET 
    question = 'Como alterar minha forma de pagamento?',
    answer = 'Acesse "Configurações de Pagamento" no seu painel e adicione ou altere seus métodos de pagamento.'
WHERE id = 10;

UPDATE faqs SET 
    question = 'Como cancelar minha assinatura?',
    answer = 'Para cancelar sua assinatura, acesse "Configurações da Conta" e clique em "Cancelar Assinatura".'
WHERE id = 11;

UPDATE faqs SET 
    question = 'Posso pausar minha conta temporariamente?',
    answer = 'Sim, você pode pausar sua conta por até 3 meses. Acesse "Configurações da Conta" para esta opção.'
WHERE id = 12;

UPDATE faqs SET 
    question = 'Como alterar meu email cadastrado?',
    answer = 'Acesse "Meu Perfil" no menu do usuário e clique em "Editar Informações" para alterar seu email.'
WHERE id = 13;

UPDATE faqs SET 
    question = 'Como ativar a autenticação de dois fatores?',
    answer = 'Vá em "Segurança" nas configurações da conta e siga as instruções para ativar a autenticação de dois fatores.'
WHERE id = 14;

-- Corrigir categorias
UPDATE categories SET 
    name = 'Suporte Técnico',
    description = 'Problemas técnicos e soluções de troubleshooting'
WHERE id = 2;

-- Verificar resultados
SELECT 'Dados corrigidos com UTF-8:' as status;
SELECT id, question FROM faqs WHERE id <= 5 ORDER BY id;