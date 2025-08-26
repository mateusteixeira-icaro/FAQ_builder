-- FAQ System Sample Data for PostgreSQL
-- Execute this script after creating the schema

-- Insert sample categories
INSERT INTO categories (name, description, icon, display_order, active) VALUES
('Tecnologia', 'Perguntas sobre tecnologia e sistemas', '💻', 1, true),
('Suporte', 'Dúvidas sobre suporte técnico', '🛠️', 2, true),
('Conta', 'Questões relacionadas à conta do usuário', '👤', 3, true),
('Pagamentos', 'Informações sobre pagamentos e cobrança', '💳', 4, true),
('Políticas', 'Políticas da empresa e termos de uso', '📋', 5, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample FAQs
INSERT INTO faqs (category_id, question, answer, tags, active, priority, author, view_count) VALUES
-- Tecnologia FAQs
(1, 'Como resetar minha senha?', 
 'Para resetar sua senha, clique em "Esqueci minha senha" na tela de login e siga as instruções enviadas por email.', 
 ARRAY['senha', 'login', 'reset'], true, 10, 'Admin', 150),

(1, 'Quais navegadores são suportados?', 
 'Nosso sistema suporta Chrome, Firefox, Safari e Edge nas versões mais recentes.', 
 ARRAY['navegador', 'compatibilidade'], true, 8, 'Admin', 89),

(1, 'Como atualizar meu perfil?', 
 'Acesse "Meu Perfil" no menu superior e clique em "Editar" para atualizar suas informações.', 
 ARRAY['perfil', 'editar'], true, 7, 'Admin', 67),

-- Suporte FAQs
(2, 'Como entrar em contato com o suporte?', 
 'Você pode entrar em contato através do email suporte@empresa.com ou pelo chat online disponível 24/7.', 
 ARRAY['contato', 'suporte', 'chat'], true, 9, 'Admin', 234),

(2, 'Qual o horário de funcionamento?', 
 'Nosso suporte funciona 24 horas por dia, 7 dias por semana para melhor atendê-lo.', 
 ARRAY['horário', 'funcionamento'], true, 6, 'Admin', 45),

-- Conta FAQs
(3, 'Como criar uma nova conta?', 
 'Clique em "Registrar" na página inicial e preencha o formulário com suas informações pessoais.', 
 ARRAY['registro', 'conta', 'criar'], true, 8, 'Admin', 123),

(3, 'Posso ter múltiplas contas?', 
 'Não, cada usuário pode ter apenas uma conta ativa por CPF/CNPJ.', 
 ARRAY['múltiplas', 'contas'], true, 5, 'Admin', 34),

-- Pagamentos FAQs
(4, 'Quais formas de pagamento são aceitas?', 
 'Aceitamos cartão de crédito, débito, PIX e boleto bancário.', 
 ARRAY['pagamento', 'cartão', 'pix', 'boleto'], true, 9, 'Admin', 178),

(4, 'Como cancelar uma assinatura?', 
 'Acesse "Minha Conta" > "Assinaturas" e clique em "Cancelar" ao lado da assinatura desejada.', 
 ARRAY['cancelar', 'assinatura'], true, 7, 'Admin', 92),

-- Políticas FAQs
(5, 'Qual é a política de privacidade?', 
 'Nossa política de privacidade está disponível no rodapé do site e detalha como tratamos seus dados.', 
 ARRAY['privacidade', 'dados', 'lgpd'], true, 6, 'Admin', 56),

(5, 'Como funciona a política de reembolso?', 
 'Oferecemos reembolso integral em até 7 dias após a compra, conforme nossos termos de uso.', 
 ARRAY['reembolso', 'devolução'], true, 5, 'Admin', 43);

-- Update sequences to avoid conflicts
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('faqs_id_seq', (SELECT MAX(id) FROM faqs));