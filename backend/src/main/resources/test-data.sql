-- Test data for FAQ application
-- This file is loaded during application startup to populate the H2 database

-- Insert test categories (compatible with our Category entity)
INSERT INTO categories (name, description, active, display_order, created_at, updated_at) VALUES
('Perguntas Gerais', 'Perguntas gerais sobre nossos serviços', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Suporte Técnico', 'Suporte técnico e solução de problemas', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Faturamento', 'Perguntas relacionadas a faturamento e pagamento', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gerenciamento de Conta', 'Configuração e gerenciamento de conta', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test FAQs (compatible with our Faq entity)
-- Note: category_id will be 1, 2, 3, 4 based on the order of insertion above
INSERT INTO faqs (question, answer, category_id, view_count, is_active, priority, created_at, updated_at) VALUES
('O que é este serviço?', 'Este é um sistema abrangente de gerenciamento de FAQ que ajuda organizações a gerenciar suas perguntas frequentes de forma eficiente.', 1, 150, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como começar?', 'Para começar, simplesmente crie uma conta e siga nosso guia passo a passo de integração. Você pode acessá-lo no painel principal.', 1, 120, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como redefinir minha senha?', 'Para redefinir sua senha, clique no link "Esqueci a Senha" na página de login e siga as instruções enviadas para seu email.', 2, 200, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Por que minha aplicação não está funcionando?', 'Se sua aplicação não está funcionando, verifique sua conexão com a internet, limpe o cache do navegador e tente novamente. Se o problema persistir, entre em contato com nossa equipe de suporte.', 2, 89, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como atualizar minhas informações de faturamento?', 'Você pode atualizar suas informações de faturamento indo em Configurações da Conta > Faturamento e clicando em "Atualizar Método de Pagamento".', 3, 75, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quais métodos de pagamento vocês aceitam?', 'Aceitamos todos os principais cartões de crédito (Visa, MasterCard, American Express), PayPal e transferências bancárias para clientes empresariais.', 3, 95, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como alterar meu endereço de email?', 'Para alterar seu endereço de email, vá em Configurações da Conta > Perfil e atualize seu email. Você precisará verificar o novo endereço de email.', 4, 60, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Posso excluir minha conta?', 'Sim, você pode excluir sua conta indo em Configurações da Conta > Privacidade e clicando em "Excluir Conta". Note que esta ação é irreversível.', 4, 45, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Meus dados estão seguros?', 'Sim, levamos a segurança dos dados muito a sério. Todos os dados são criptografados em trânsito e em repouso, e seguimos as melhores práticas da indústria para segurança.', 1, 180, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Como entrar em contato com o suporte?', 'Você pode entrar em contato com nossa equipe de suporte através da Central de Ajuda, por email em suporte@exemplo.com, ou através do chat ao vivo disponível 24/7.', 2, 110, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Commit the transaction
COMMIT;