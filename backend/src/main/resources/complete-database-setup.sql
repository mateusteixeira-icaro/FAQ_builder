-- Script completo para configuração do banco de dados FAQ System
-- Codificação: UTF-8
-- Este script cria as tabelas e popula com dados de teste

-- Limpar dados existentes (se houver)
DELETE FROM feedbacks;
DELETE FROM faqs;
DELETE FROM categories;

-- Resetar sequências
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE faqs_id_seq RESTART WITH 1;
ALTER SEQUENCE feedbacks_id_seq RESTART WITH 1;

-- Inserir categorias
INSERT INTO categories (name, description, display_order, active, created_at, updated_at) VALUES 
('Perguntas Gerais', 'Dúvidas frequentes sobre o uso básico do sistema', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Suporte Técnico', 'Problemas técnicos e soluções de troubleshooting', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Faturamento', 'Questões relacionadas a pagamentos e faturas', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gerenciamento de Conta', 'Configurações e gerenciamento da conta do usuário', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserir FAQs com IDs corretos das categorias (1, 2, 3, 4)
INSERT INTO faqs (question, answer, category_id, is_active, priority, view_count, created_at, updated_at) VALUES 
-- Perguntas Gerais (category_id = 1)
('Como faço para criar uma conta?', 'Para criar uma conta, clique no botão "Registrar" no canto superior direito da página inicial e preencha o formulário com suas informações pessoais.', 1, true, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Esqueci minha senha, como posso recuperá-la?', 'Clique em "Esqueci minha senha" na página de login e siga as instruções enviadas para seu email cadastrado.', 1, true, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como posso alterar meus dados pessoais?', 'Acesse "Meu Perfil" no menu do usuário e clique em "Editar Informações" para alterar seus dados pessoais.', 1, true, 3, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Suporte Técnico (category_id = 2)
('O sistema está lento, o que fazer?', 'Verifique sua conexão com a internet e tente limpar o cache do navegador. Se o problema persistir, entre em contato conosco.', 2, true, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Não consigo fazer login, o que pode ser?', 'Verifique se está usando o email e senha corretos. Certifique-se de que o Caps Lock não está ativado.', 2, true, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como entrar em contato com o suporte?', 'Você pode nos contatar através do chat online, email suporte@exemplo.com ou telefone (11) 1234-5678.', 2, true, 3, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Por que não consigo acessar certas funcionalidades?', 'Algumas funcionalidades podem estar restritas ao seu plano atual. Verifique as permissões da sua conta ou considere fazer upgrade.', 2, true, 4, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Faturamento (category_id = 3)
('Como visualizar minha fatura?', 'Acesse a seção "Faturamento" no seu painel de controle para visualizar e baixar suas faturas.', 3, true, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quais formas de pagamento são aceitas?', 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), PIX e boleto bancário.', 3, true, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como alterar minha forma de pagamento?', 'Acesse "Configurações de Pagamento" no seu painel e adicione ou altere seus métodos de pagamento.', 3, true, 3, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Gerenciamento de Conta (category_id = 4)
('Como cancelar minha assinatura?', 'Para cancelar sua assinatura, acesse "Configurações da Conta" e clique em "Cancelar Assinatura".', 4, true, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Posso pausar minha conta temporariamente?', 'Sim, você pode pausar sua conta por até 3 meses. Acesse "Configurações da Conta" para esta opção.', 4, true, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como alterar meu email cadastrado?', 'Acesse "Meu Perfil" no menu do usuário e clique em "Editar Informações" para alterar seu email.', 4, true, 3, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como ativar a autenticação de dois fatores?', 'Vá em "Segurança" nas configurações da conta e siga as instruções para ativar a autenticação de dois fatores.', 4, true, 4, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserir alguns feedbacks de exemplo
INSERT INTO feedbacks (faq_id, user_email, rating, comment, created_at) VALUES 
(1, 'usuario1@exemplo.com', 5, 'Muito útil! Consegui criar minha conta rapidamente.', CURRENT_TIMESTAMP),
(2, 'usuario2@exemplo.com', 4, 'Funcionou perfeitamente, obrigado!', CURRENT_TIMESTAMP),
(4, 'usuario3@exemplo.com', 3, 'Ajudou um pouco, mas ainda está lento.', CURRENT_TIMESTAMP),
(8, 'usuario4@exemplo.com', 5, 'Excelente explicação sobre as formas de pagamento.', CURRENT_TIMESTAMP),
(10, 'usuario5@exemplo.com', 4, 'Processo de cancelamento bem claro.', CURRENT_TIMESTAMP);

-- Confirmar transação
COMMIT;

-- Verificar dados inseridos
SELECT 'Categorias inseridas:' as info, COUNT(*) as total FROM categories
UNION ALL
SELECT 'FAQs inseridas:', COUNT(*) FROM faqs
UNION ALL
SELECT 'Feedbacks inseridos:', COUNT(*) FROM feedbacks;

-- Mostrar distribuição de FAQs por categoria
SELECT 
    c.name as categoria,
    COUNT(f.id) as total_faqs
FROM categories c 
LEFT JOIN faqs f ON c.id = f.category_id 
GROUP BY c.id, c.name 
ORDER BY c.display_order;